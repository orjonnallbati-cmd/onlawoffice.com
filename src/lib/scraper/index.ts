/**
 * Court Decision Scraper - Main Module
 *
 * Coordinates scraping from all Albanian court sources
 * and stores results in the database.
 */

export { scrapeAllDecisions, scrapeDecisionPage } from './gjykataElarte';
export { scrapeConstitutionalDecisions } from './gjykataKushtetuese';
export type { ScrapedDecision } from './gjykataElarte';

export {
  ALBANIAN_CODES,
  LEGISLATION_SUMMARIES,
  scrapeCodesPage,
  scrapeSummariesPage,
  searchLegislation,
  buildEliUrl,
} from './qbz';
export type { LegalCode, LegislationAct } from './qbz';

export { searchBusiness } from './qkb';
export type { BusinessInfo } from './qkb';
