/**
 * Scraper for QBZ (Qendra e Botimeve Zyrtare)
 * https://qbz.gov.al
 *
 * Fetches Albanian legal codes and legislation summaries.
 * Uses ELI (European Legislation Identifier) URL pattern.
 */

import * as cheerio from 'cheerio';

export interface LegalCode {
  title: string;
  previewUrl: string;
  pdfUrl: string | null;
  category: 'CODE' | 'SUMMARY' | 'LAW' | 'DECISION';
  lastUpdated: string | null;
}

export interface LegislationAct {
  title: string;
  actType: string;
  actNumber: string | null;
  institution: string | null;
  datePublished: Date | null;
  officialGazetteNumber: string | null;
  eliUrl: string;
  pdfUrl: string | null;
  summary: string | null;
}

const BASE_URL = 'https://qbz.gov.al';

// Known codes with their QBZ preview URLs
export const ALBANIAN_CODES: LegalCode[] = [
  {
    title: 'Kodi Civil i Republikës së Shqipërisë',
    previewUrl: `${BASE_URL}/preview/f010097e-d6c8-402f-8f10-d9b60af94744`,
    pdfUrl: null,
    category: 'CODE',
    lastUpdated: null,
  },
  {
    title: 'Kodi Penal i Republikës së Shqipërisë',
    previewUrl: `${BASE_URL}/preview/a2b117e6-69b2-4355-aa49-78967c31bf4d`,
    pdfUrl: null,
    category: 'CODE',
    lastUpdated: null,
  },
  {
    title: 'Kodi i Procedurës Civile',
    previewUrl: `${BASE_URL}/publications/codes`,
    pdfUrl: 'https://www.drejtesia.gov.al/wp-content/uploads/2017/11/Kodi_i_Procedures_Civile-2014-perf-1.pdf',
    category: 'CODE',
    lastUpdated: null,
  },
  {
    title: 'Kodi i Procedurës Penale',
    previewUrl: `${BASE_URL}/publications/codes`,
    pdfUrl: 'https://www.pp.gov.al/rc/doc/kodi_i_procedures_penale_date_30_gusht_2017_1201.pdf',
    category: 'CODE',
    lastUpdated: null,
  },
  {
    title: 'Kodi i Procedurës Administrative',
    previewUrl: `${BASE_URL}/publications/codes`,
    pdfUrl: null,
    category: 'CODE',
    lastUpdated: null,
  },
  {
    title: 'Kodi i Familjes',
    previewUrl: `${BASE_URL}/publications/codes`,
    pdfUrl: null,
    category: 'CODE',
    lastUpdated: null,
  },
  {
    title: 'Kodi i Punës',
    previewUrl: `${BASE_URL}/publications/codes`,
    pdfUrl: null,
    category: 'CODE',
    lastUpdated: null,
  },
];

// Known legislation summaries
export const LEGISLATION_SUMMARIES: LegalCode[] = [
  {
    title: 'Përmbledhje Legjislacioni - Barazia Gjinore dhe Mosdiskriminimi (2021)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2021',
  },
  {
    title: 'Përmbledhje Legjislacioni - Teknologjia e Informacionit dhe Komunikimet Elektronike (2020)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2020',
  },
  {
    title: 'Përmbledhje Legjislacioni - Qarkullimi Rrugor (2021)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2021',
  },
  {
    title: 'Përmbledhje Legjislacioni - E Drejta e Informimit, Konsultimi Publik dhe Mbrojtja e të Dhënave Personale (2017)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2017',
  },
  {
    title: 'Përmbledhje Legjislacioni - Drejtësia (2018)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2018',
  },
  {
    title: 'Përmbledhje Legjislacioni - Koncesionet (2018)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2018',
  },
  {
    title: 'Përmbledhje Legjislacioni - Pronësia e Paluajtshme (2018)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2018',
  },
  {
    title: 'Përmbledhje Legjislacioni - Nënpunësi Civil (2015)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2015',
  },
  {
    title: 'Përmbledhje Legjislacioni - Vetëqeverisja Vendore (2018)',
    previewUrl: `${BASE_URL}/publications/summaries`,
    pdfUrl: null,
    category: 'SUMMARY',
    lastUpdated: '2018',
  },
];

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OnLawOffice-LegalResearch/1.0 (+https://onlawoffice.com)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'sq,en;q=0.5',
      },
    });

    if (!response.ok) {
      console.warn(`[QBZ] HTTP ${response.status} for ${url}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`[QBZ] Failed to fetch ${url}:`, error);
    return null;
  }
}

/**
 * Scrape codes page to discover available codes and their URLs
 */
export async function scrapeCodesPage(): Promise<LegalCode[]> {
  const html = await fetchPage(`${BASE_URL}/publications/codes`);
  if (!html) return ALBANIAN_CODES;

  const $ = cheerio.load(html);
  const codes: LegalCode[] = [];

  $('a').each((_i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    const href = $el.attr('href');

    if (href && text && (
      text.toLowerCase().includes('kod') ||
      text.toLowerCase().includes('code')
    )) {
      const resolvedUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      codes.push({
        title: text,
        previewUrl: resolvedUrl,
        pdfUrl: href.endsWith('.pdf') ? resolvedUrl : null,
        category: 'CODE',
        lastUpdated: null,
      });
    }
  });

  return codes.length > 0 ? codes : ALBANIAN_CODES;
}

/**
 * Scrape summaries page for legislation compilations
 */
export async function scrapeSummariesPage(): Promise<LegalCode[]> {
  const html = await fetchPage(`${BASE_URL}/publications/summaries`);
  if (!html) return LEGISLATION_SUMMARIES;

  const $ = cheerio.load(html);
  const summaries: LegalCode[] = [];

  $('a').each((_i, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    const href = $el.attr('href');

    if (href && text && text.length > 10 && (
      text.toLowerCase().includes('përmbledhje') ||
      text.toLowerCase().includes('legjislacion') ||
      href.endsWith('.pdf')
    )) {
      const resolvedUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      summaries.push({
        title: text,
        previewUrl: resolvedUrl,
        pdfUrl: href.endsWith('.pdf') ? resolvedUrl : null,
        category: 'SUMMARY',
        lastUpdated: null,
      });
    }
  });

  return summaries.length > 0 ? summaries : LEGISLATION_SUMMARIES;
}

/**
 * Search QBZ for legislation acts
 * Uses the search page at qbz.gov.al/search
 */
export async function searchLegislation(query: string): Promise<LegislationAct[]> {
  const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
  const html = await fetchPage(searchUrl);
  if (!html) return [];

  const $ = cheerio.load(html);
  const acts: LegislationAct[] = [];

  // Parse search results
  $('.search-result, .result-item, article, .list-group-item, tr').each((_i, el) => {
    const $el = $(el);
    const title = $el.find('h3, h4, .title, a').first().text().trim();
    const link = $el.find('a').first().attr('href');
    const summary = $el.find('p, .description, .summary').first().text().trim();

    if (title && link) {
      const resolvedUrl = link.startsWith('http') ? link : `${BASE_URL}${link}`;
      const isEli = link.includes('/eli/');

      acts.push({
        title,
        actType: detectActType(title),
        actNumber: extractActNumber(title),
        institution: null,
        datePublished: extractDateFromEli(link),
        officialGazetteNumber: null,
        eliUrl: resolvedUrl,
        pdfUrl: link.endsWith('.pdf') ? resolvedUrl : null,
        summary: summary || null,
      });

      // Only use ELI URL if it's an ELI link
      if (!isEli) {
        acts[acts.length - 1].eliUrl = resolvedUrl;
      }
    }
  });

  return acts;
}

/**
 * Build ELI URL for a specific act
 */
export function buildEliUrl(type: string, year: number, month: number, day: number, number: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${BASE_URL}/eli/${type}/${year}/${m}/${d}/${number}`;
}

// Helper functions

function detectActType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('ligj')) return 'Ligj';
  if (lower.includes('vendim')) return 'Vendim';
  if (lower.includes('dekret')) return 'Dekret';
  if (lower.includes('udhëzim')) return 'Udhëzim';
  if (lower.includes('urdhër')) return 'Urdhër';
  if (lower.includes('rregullore')) return 'Rregullore';
  if (lower.includes('rezolutë')) return 'Rezolutë';
  if (lower.includes('akt normativ')) return 'Akt Normativ';
  return 'Tjetër';
}

function extractActNumber(text: string): string | null {
  const match = text.match(/[Nn]r\.?\s*([\d\-\/]+)/);
  return match ? match[1] : null;
}

function extractDateFromEli(url: string): Date | null {
  // ELI pattern: /eli/{type}/{year}/{month}/{day}/{number}
  const match = url.match(/\/eli\/\w+\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/\d+/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }
  return null;
}
