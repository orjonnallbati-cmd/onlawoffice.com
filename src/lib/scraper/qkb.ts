/**
 * QKB (Qendra Kombëtare e Biznesit) Business Lookup
 * https://qkb.gov.al
 *
 * Searches the Albanian National Business Center registry
 * for business information by NIPT, name, or shareholder.
 */

import * as cheerio from 'cheerio';

export interface BusinessInfo {
  name: string;
  nipt: string | null;
  status: string | null;
  legalForm: string | null;
  registrationDate: string | null;
  address: string | null;
  administrator: string | null;
  capital: string | null;
  activity: string | null;
  shareholders: string[];
  sourceUrl: string;
}

const SEARCH_URL = 'https://www.qkr.gov.al/kerko/kerko-ne-regjistrin-tregtar/kerko-per-subjekt/';

/**
 * Search for businesses by NIPT, name, or other criteria
 */
export async function searchBusiness(query: string): Promise<BusinessInfo[]> {
  try {
    // First, get the search page to obtain any CSRF tokens or form data
    const pageResponse = await fetch(SEARCH_URL, {
      headers: {
        'User-Agent': 'OnLawOffice-LegalResearch/1.0 (+https://onlawoffice.com)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'sq,en;q=0.5',
      },
    });

    if (!pageResponse.ok) {
      console.warn(`[QKB] HTTP ${pageResponse.status} fetching search page`);
      return [];
    }

    const pageHtml = await pageResponse.text();
    const $page = cheerio.load(pageHtml);

    // Extract form tokens
    const csrfToken = $page('input[name="__RequestVerificationToken"]').val() ||
                      $page('input[name="_token"]').val() || '';

    // Determine if query is NIPT (pattern: letter + 8 digits + letter)
    const isNipt = /^[A-Za-z]\d{8}[A-Za-z]$/.test(query.trim());

    // Submit search form
    const formData = new URLSearchParams();
    if (csrfToken) {
      formData.append('__RequestVerificationToken', csrfToken.toString());
    }

    if (isNipt) {
      formData.append('SearchNipt', query.trim().toUpperCase());
    } else {
      formData.append('SearchName', query.trim());
    }

    const searchResponse = await fetch(SEARCH_URL, {
      method: 'POST',
      headers: {
        'User-Agent': 'OnLawOffice-LegalResearch/1.0 (+https://onlawoffice.com)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'sq,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: SEARCH_URL,
      },
      body: formData.toString(),
      redirect: 'follow',
    });

    if (!searchResponse.ok) {
      console.warn(`[QKB] HTTP ${searchResponse.status} on search`);
      return [];
    }

    const html = await searchResponse.text();
    return parseSearchResults(html);
  } catch (error) {
    console.error(`[QKB] Search error:`, error);
    return [];
  }
}

/**
 * Parse search results page
 */
function parseSearchResults(html: string): BusinessInfo[] {
  const $ = cheerio.load(html);
  const businesses: BusinessInfo[] = [];

  // Look for result rows/cards
  $('table tbody tr, .result-item, .card, .list-group-item').each((_i, el) => {
    const $el = $(el);
    const cells = $el.find('td');

    if (cells.length >= 2) {
      // Table row format
      const name = $(cells[0]).text().trim() || $(cells[1]).text().trim();
      const nipt = extractNipt($el.text());
      const status = $(cells[cells.length - 1]).text().trim();
      const link = $el.find('a').first().attr('href');

      if (name) {
        businesses.push({
          name,
          nipt,
          status: status || null,
          legalForm: null,
          registrationDate: null,
          address: null,
          administrator: null,
          capital: null,
          activity: null,
          shareholders: [],
          sourceUrl: link ? resolveUrl(link) : SEARCH_URL,
        });
      }
    } else {
      // Card/item format
      const name = $el.find('h3, h4, .title, strong').first().text().trim();
      const text = $el.text();
      const nipt = extractNipt(text);
      const link = $el.find('a').first().attr('href');

      if (name) {
        businesses.push({
          name,
          nipt,
          status: extractField(text, 'status', 'gjendj'),
          legalForm: extractField(text, 'forma', 'lloji'),
          registrationDate: extractField(text, 'dat', 'regjistr'),
          address: extractField(text, 'adres'),
          administrator: extractField(text, 'administrat', 'përfaqësues'),
          capital: null,
          activity: null,
          shareholders: [],
          sourceUrl: link ? resolveUrl(link) : SEARCH_URL,
        });
      }
    }
  });

  // Fallback: try parsing any structured content
  if (businesses.length === 0) {
    const fullText = $('body').text();
    const nipt = extractNipt(fullText);

    // Look for a single business detail page
    const name = $('h1, h2, .company-name, .business-name').first().text().trim();
    if (name && name.length > 2) {
      const info: BusinessInfo = {
        name,
        nipt,
        status: null,
        legalForm: null,
        registrationDate: null,
        address: null,
        administrator: null,
        capital: null,
        activity: null,
        shareholders: [],
        sourceUrl: SEARCH_URL,
      };

      // Extract detail fields
      $('table tr, dl dt, .field-label').each((_i, el) => {
        const label = $(el).text().trim().toLowerCase();
        const value = $(el).next().text().trim() || $(el).find('+ td, + dd').text().trim();

        if (label.includes('gjendj') || label.includes('status')) info.status = value;
        if (label.includes('form') || label.includes('lloj')) info.legalForm = value;
        if (label.includes('adres')) info.address = value;
        if (label.includes('administrat')) info.administrator = value;
        if (label.includes('kapital')) info.capital = value;
        if (label.includes('aktivitet') || label.includes('objekt')) info.activity = value;
        if (label.includes('dat') && label.includes('regjistr')) info.registrationDate = value;
      });

      businesses.push(info);
    }
  }

  return businesses;
}

function extractNipt(text: string): string | null {
  const match = text.match(/[A-Z]\d{8}[A-Z]/i);
  return match ? match[0].toUpperCase() : null;
}

function extractField(text: string, ...keywords: string[]): string | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      const parts = line.split(/[:：]/);
      if (parts.length >= 2) {
        return parts.slice(1).join(':').trim() || null;
      }
    }
  }
  return null;
}

function resolveUrl(url: string): string {
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `https://www.qkr.gov.al${url}`;
  return `https://www.qkr.gov.al/${url}`;
}
