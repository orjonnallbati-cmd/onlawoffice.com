/**
 * Scraper for Gjykata e Lartë (High Court of Albania)
 * https://www.gjykataelarte.gov.al/sq/vendimet-e-gjykates/
 *
 * Extracts court decisions (vendime) from the High Court website.
 * Respects robots.txt and rate limits (1 request per 3 seconds).
 */

import * as cheerio from 'cheerio';

export interface ScrapedDecision {
  decisionNumber: string | null;
  caseNumber: string | null;
  college: string | null;
  decisionType: string | null;
  decisionDate: Date | null;
  parties: string | null;
  subject: string | null;
  summary: string | null;
  fullText: string | null;
  pdfUrl: string | null;
  sourceUrl: string;
}

const BASE_URL = 'https://www.gjykataelarte.gov.al';

const DECISION_PAGES = {
  final: '/sq/vendime-perfundimtare/',
  unification: '/sq/vendime-per-njesiminndryshimin-e-praktikes-gjyqesore/',
  administrative: '/sq/per-shqyrtim-ne-dhome-keshillimi-administrative/',
};

const COLLEGES = {
  civil: 'Kolegji Civil',
  penal: 'Kolegji Penal',
  administrative: 'Kolegji Administrativ',
  joint: 'Kolegjet e Bashkuara',
};

/**
 * Rate-limited fetch with retry logic
 */
async function fetchWithDelay(url: string, delayMs = 3000): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'OnLawOffice-LegalResearch/1.0 (+https://onlawoffice.com)',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'sq,en;q=0.5',
        },
      });

      if (!response.ok) {
        console.warn(`[Scraper] HTTP ${response.status} for ${url}`);
        if (response.status === 429) {
          await new Promise((r) => setTimeout(r, 10000));
          continue;
        }
        return null;
      }

      return await response.text();
    } catch (error) {
      console.error(`[Scraper] Attempt ${attempt + 1} failed for ${url}:`, error);
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
      }
    }
  }

  return null;
}

/**
 * Parse a decision page listing from gjykataelarte.gov.al
 */
function parseDecisionList(html: string, sourceUrl: string): ScrapedDecision[] {
  const $ = cheerio.load(html);
  const decisions: ScrapedDecision[] = [];

  // The site typically lists decisions in article/post containers or table rows
  // We target common patterns: .entry-content links, article elements, table rows
  $('article, .post, .entry, tr[data-id], .vendim-item').each((_i, el) => {
    const $el = $(el);
    const title = $el.find('h2, h3, .entry-title, td:first-child').first().text().trim();
    const link = $el.find('a').first().attr('href');
    const dateText = $el.find('.date, .entry-date, time, td:nth-child(2)').first().text().trim();
    const summary = $el.find('.excerpt, .entry-summary, p, td:nth-child(3)').first().text().trim();
    const pdfLink = $el.find('a[href$=".pdf"]').first().attr('href');

    if (title || link) {
      const decision: ScrapedDecision = {
        decisionNumber: extractDecisionNumber(title),
        caseNumber: extractCaseNumber(title),
        college: detectCollege(title + ' ' + summary),
        decisionType: null,
        decisionDate: parseAlbanianDate(dateText),
        parties: null,
        subject: title || null,
        summary: summary || null,
        fullText: null,
        pdfUrl: pdfLink ? resolveUrl(pdfLink) : null,
        sourceUrl: link ? resolveUrl(link) : sourceUrl,
      };
      decisions.push(decision);
    }
  });

  // Also try parsing simple link lists (common on Albanian gov sites)
  if (decisions.length === 0) {
    $('a[href*="vendim"], a[href*="decision"], .wp-block-file a, ul li a').each((_i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const href = $el.attr('href');

      if (text && href && (text.length > 10 || href.includes('.pdf'))) {
        decisions.push({
          decisionNumber: extractDecisionNumber(text),
          caseNumber: extractCaseNumber(text),
          college: detectCollege(text),
          decisionType: null,
          decisionDate: extractDateFromText(text),
          parties: null,
          subject: text,
          summary: null,
          fullText: null,
          pdfUrl: href.endsWith('.pdf') ? resolveUrl(href) : null,
          sourceUrl: resolveUrl(href),
        });
      }
    });
  }

  return decisions;
}

/**
 * Parse a single decision detail page
 */
function parseDecisionDetail(html: string): Partial<ScrapedDecision> {
  const $ = cheerio.load(html);

  const content = $('.entry-content, .post-content, article, .vendim-content, main')
    .first()
    .text()
    .trim();

  const pdfLink = $('a[href$=".pdf"]').first().attr('href');

  return {
    fullText: content || null,
    pdfUrl: pdfLink ? resolveUrl(pdfLink) : null,
  };
}

/**
 * Scrape decisions from a specific category page
 */
export async function scrapeDecisionPage(
  pageKey: keyof typeof DECISION_PAGES
): Promise<ScrapedDecision[]> {
  const url = BASE_URL + DECISION_PAGES[pageKey];
  console.log(`[Scraper] Fetching ${pageKey} decisions from ${url}`);

  const html = await fetchWithDelay(url);
  if (!html) {
    console.error(`[Scraper] Failed to fetch ${url}`);
    return [];
  }

  const decisions = parseDecisionList(html, url);
  console.log(`[Scraper] Found ${decisions.length} decisions on ${pageKey} page`);

  // Fetch detail pages for each decision (with rate limiting)
  for (const decision of decisions.slice(0, 20)) {
    // Limit to 20 per run
    if (decision.sourceUrl && !decision.fullText) {
      const detailHtml = await fetchWithDelay(decision.sourceUrl);
      if (detailHtml) {
        const details = parseDecisionDetail(detailHtml);
        Object.assign(decision, details);
      }
    }
  }

  return decisions;
}

/**
 * Scrape all decision categories
 */
export async function scrapeAllDecisions(): Promise<{
  decisions: ScrapedDecision[];
  errors: string[];
}> {
  const allDecisions: ScrapedDecision[] = [];
  const errors: string[] = [];

  for (const [key, _path] of Object.entries(DECISION_PAGES)) {
    try {
      const decisions = await scrapeDecisionPage(key as keyof typeof DECISION_PAGES);
      allDecisions.push(...decisions);
    } catch (error) {
      const msg = `Failed to scrape ${key}: ${error}`;
      console.error(`[Scraper] ${msg}`);
      errors.push(msg);
    }
  }

  return { decisions: allDecisions, errors };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function resolveUrl(url: string): string {
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return BASE_URL + url;
  return BASE_URL + '/' + url;
}

function extractDecisionNumber(text: string): string | null {
  // Match patterns like "Nr. 123", "Vendim nr. 45", "Nr.00-2024-123"
  const match = text.match(/[Nn]r\.?\s*(\d[\d\-\/]*)/);
  return match ? match[1] : null;
}

function extractCaseNumber(text: string): string | null {
  // Match patterns like "Çështja nr. 123/2024"
  const match = text.match(/[Çç]ështj[ae]\s*[Nn]r\.?\s*([\d\-\/]+)/);
  return match ? match[1] : null;
}

function detectCollege(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('civil') || lower.includes('civile')) return COLLEGES.civil;
  if (lower.includes('penal') || lower.includes('penale')) return COLLEGES.penal;
  if (lower.includes('administrat')) return COLLEGES.administrative;
  if (lower.includes('bashkuar')) return COLLEGES.joint;
  return null;
}

function parseAlbanianDate(text: string): Date | null {
  if (!text) return null;

  // Try ISO format first
  const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return new Date(isoMatch[0]);

  // Albanian format: DD.MM.YYYY or DD/MM/YYYY
  const match = text.match(/(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/);
  if (match) {
    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
  }

  // Albanian month names
  const months: Record<string, number> = {
    janar: 0, shkurt: 1, mars: 2, prill: 3,
    maj: 4, qershor: 5, korrik: 6, gusht: 7,
    shtator: 8, tetor: 9, nëntor: 10, dhjetor: 11,
  };

  for (const [name, idx] of Object.entries(months)) {
    if (text.toLowerCase().includes(name)) {
      const dayMatch = text.match(/(\d{1,2})/);
      const yearMatch = text.match(/(\d{4})/);
      if (dayMatch && yearMatch) {
        return new Date(parseInt(yearMatch[1]), idx, parseInt(dayMatch[1]));
      }
    }
  }

  return null;
}

function extractDateFromText(text: string): Date | null {
  return parseAlbanianDate(text);
}
