/**
 * Scraper for Gjykata Kushtetuese (Constitutional Court of Albania)
 * https://www.gjykatakushtetuese.gov.al/
 *
 * Extracts constitutional court decisions (vendime kushtetuese).
 */

import * as cheerio from 'cheerio';
import type { ScrapedDecision } from './gjykataElarte';

const BASE_URL = 'https://www.gjykatakushtetuese.gov.al';

// Known decision listing pages
const DECISION_PATHS = [
  '/vendime-perfundimtare-2026/',
  '/vendime-perfundimtare-2025/',
  '/vendime-perfundimtare-2024/',
];

async function fetchPage(url: string): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OnLawOffice-LegalResearch/1.0 (+https://onlawoffice.com)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'sq,en;q=0.5',
      },
    });

    if (!response.ok) {
      console.warn(`[KushtetueseScraper] HTTP ${response.status} for ${url}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`[KushtetueseScraper] Failed to fetch ${url}:`, error);
    return null;
  }
}

function parseDecisionList(html: string, sourceUrl: string): ScrapedDecision[] {
  const $ = cheerio.load(html);
  const decisions: ScrapedDecision[] = [];

  // WordPress-based site: look for post listings and PDF links
  $('.entry-content a, article a, .wp-block-file a, .post-content a').each((_i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    const href = $el.attr('href');

    if (!href || !text || text.length < 5) return;

    // Skip navigation/menu links
    if (href === '#' || href === sourceUrl) return;

    const isPdf = href.endsWith('.pdf');
    const isDecisionLink =
      isPdf ||
      text.toLowerCase().includes('vendim') ||
      text.match(/[Nn]r\.?\s*\d/) ||
      text.match(/\d{1,2}\.\d{1,2}\.\d{4}/);

    if (isDecisionLink) {
      decisions.push({
        decisionNumber: extractNumber(text),
        caseNumber: null,
        college: 'Gjykata Kushtetuese',
        decisionType: 'Vendim Përfundimtar',
        decisionDate: extractDate(text),
        parties: null,
        subject: text,
        summary: null,
        fullText: null,
        pdfUrl: isPdf ? resolveUrl(href) : null,
        sourceUrl: isPdf ? sourceUrl : resolveUrl(href),
      });
    }
  });

  return decisions;
}

export async function scrapeConstitutionalDecisions(): Promise<{
  decisions: ScrapedDecision[];
  errors: string[];
}> {
  const allDecisions: ScrapedDecision[] = [];
  const errors: string[] = [];

  for (const path of DECISION_PATHS) {
    const url = BASE_URL + path;
    console.log(`[KushtetueseScraper] Fetching ${url}`);

    try {
      const html = await fetchPage(url);
      if (html) {
        const decisions = parseDecisionList(html, url);
        allDecisions.push(...decisions);
        console.log(`[KushtetueseScraper] Found ${decisions.length} decisions at ${path}`);
      }
    } catch (error) {
      const msg = `Failed to scrape ${path}: ${error}`;
      console.error(`[KushtetueseScraper] ${msg}`);
      errors.push(msg);
    }
  }

  return { decisions: allDecisions, errors };
}

function resolveUrl(url: string): string {
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return BASE_URL + url;
  return BASE_URL + '/' + url;
}

function extractNumber(text: string): string | null {
  const match = text.match(/[Nn]r\.?\s*(\d[\d\-\/]*)/);
  return match ? match[1] : null;
}

function extractDate(text: string): Date | null {
  const match = text.match(/(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/);
  if (match) {
    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
  }
  return null;
}
