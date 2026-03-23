/**
 * Court Decision Scraper - Main Module
 *
 * Coordinates scraping from all Albanian court sources
 * and stores results in the database.
 */

export { scrapeAllDecisions, scrapeDecisionPage } from './gjykataElarte';
export { scrapeConstitutionalDecisions } from './gjykataKushtetuese';
export type { ScrapedDecision } from './gjykataElarte';
