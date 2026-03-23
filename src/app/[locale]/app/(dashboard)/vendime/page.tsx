'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  ScaleIcon,
  BookmarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import AppHeader from '@/components/app/AppHeader';

interface DecisionData {
  id: string;
  decisionNumber: string;
  caseNumber: string | null;
  court: string;
  college: string | null;
  decisionType: string | null;
  decisionDate: string | null;
  subject: string;
  summary: string | null;
  sourceUrl: string | null;
  pdfUrl: string | null;
  isSaved: boolean;
}

const courtLabels: Record<string, string> = {
  GJYKATA_LARTE: 'Gjykata e Lartë',
  GJYKATA_KUSHTETUESE: 'Gjykata Kushtetuese',
  GJYKATA_APELIT: 'Gjykata e Apelit',
  GJYKATA_RRETHIT: 'Gjykata e Rrethit',
  GJYKATA_ADMINISTRATIVE: 'Gjykata Administrative',
};

const collegeColors: Record<string, string> = {
  'Kolegji Civil': 'bg-blue-100 text-blue-700',
  'Kolegji Penal': 'bg-red-100 text-red-700',
  'Kolegji Administrativ': 'bg-green-100 text-green-700',
  'Kolegjet e Bashkuara': 'bg-purple-100 text-purple-700',
  'Gjykata Kushtetuese': 'bg-amber-100 text-amber-700',
};

export default function VendimePage() {
  const [decisions, setDecisions] = useState<DecisionData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courtFilter, setCourtFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState('');

  const fetchDecisions = useCallback(async (q?: string, court?: string, college?: string) => {
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (court) params.set('court', court);
      if (college) params.set('college', college);
      const url = `/api/vendime${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDecisions(data.decisions || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching decisions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchDecisions(search || undefined, courtFilter || undefined, collegeFilter || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, courtFilter, collegeFilter, fetchDecisions]);

  const toggleSave = async (decisionId: string) => {
    try {
      const res = await fetch('/api/vendime/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setDecisions((prev) =>
          prev.map((d) => (d.id === decisionId ? { ...d, isSaved: data.saved } : d))
        );
      }
    } catch (error) {
      console.error('Error saving decision:', error);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    setScrapeMessage('');
    try {
      const res = await fetch('/api/scraper', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setScrapeMessage(`U gjetën ${data.itemsFound} vendime, ${data.itemsNew} të reja.`);
        fetchDecisions();
      } else if (res.status === 403) {
        setScrapeMessage('Vetëm administratori mund të ekzekutojë scraper-in.');
      } else {
        const err = await res.json();
        setScrapeMessage(err.error || 'Gabim gjatë scraping.');
      }
    } catch {
      setScrapeMessage('Gabim gjatë lidhjes me serverin.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div>
      <AppHeader
        title="Vendime Gjyqësore"
        subtitle="Kërko vendime nga Gjykata e Lartë dhe Gjykata Kushtetuese"
      />

      <div className="p-6">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko vendime... (p.sh. 'pronë', 'kontratë', 'parashkrim', 'akt administrativ')"
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select value={courtFilter} onChange={(e) => setCourtFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none">
              <option value="">Të gjitha gjykatat</option>
              <option value="GJYKATA_LARTE">Gjykata e Lartë</option>
              <option value="GJYKATA_KUSHTETUESE">Gjykata Kushtetuese</option>
            </select>
            <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none">
              <option value="">Të gjitha kolegjet</option>
              <option value="Kolegji Civil">Kolegji Civil</option>
              <option value="Kolegji Penal">Kolegji Penal</option>
              <option value="Kolegji Administrativ">Kolegji Administrativ</option>
              <option value="Kolegjet e Bashkuara">Kolegjet e Bashkuara</option>
              <option value="Gjykata Kushtetuese">Gjykata Kushtetuese</option>
            </select>

            <span className="text-sm text-gray-500">
              {loading ? 'Duke ngarkuar...' : `${total} vendime të gjetura`}
            </span>

            <button
              onClick={handleScrape}
              disabled={scraping}
              className="ml-auto flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'Duke kërkuar...' : 'Përditëso vendimet'}
            </button>
          </div>

          {scrapeMessage && (
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {scrapeMessage}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <ScaleIcon className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Burimet e të dhënave</p>
              <p className="mt-1 text-sm text-blue-600">
                Vendimet merren nga faqjet zyrtare të{' '}
                <a href="https://www.gjykataelarte.gov.al/sq/vendimet-e-gjykates/" target="_blank" rel="noopener noreferrer" className="underline">
                  Gjykatës së Lartë
                </a>{' '}
                dhe{' '}
                <a href="https://www.gjykatakushtetuese.gov.al/" target="_blank" rel="noopener noreferrer" className="underline">
                  Gjykatës Kushtetuese
                </a>.
                Klikoni &quot;Përditëso vendimet&quot; për të marrë vendimet e fundit.
              </p>
            </div>
          </div>
        </div>

        {/* Decision Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-500">Duke ngarkuar vendimet...</div>
          ) : decisions.length === 0 ? (
            <div className="py-16 text-center">
              <ScaleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">
                {search || courtFilter || collegeFilter
                  ? 'Nuk u gjet asnjë vendim me këto kritere'
                  : 'Nuk ka vendime ende në databazë'}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {search || courtFilter || collegeFilter
                  ? 'Provoni të ndryshoni filtrat ose fjalët kyçe'
                  : 'Klikoni butonin "Përditëso vendimet" më lart për të marrë vendimet e fundit nga gjykatat'}
              </p>
              {!search && !courtFilter && !collegeFilter && (
                <button
                  onClick={handleScrape}
                  disabled={scraping}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`} />
                  {scraping ? 'Duke kërkuar...' : 'Përditëso vendimet tani'}
                </button>
              )}
            </div>
          ) : (
            decisions.map((decision) => {
              const collegeColor = collegeColors[decision.college || ''] || 'bg-gray-100 text-gray-700';

              return (
                <div key={decision.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      {decision.college && (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${collegeColor}`}>
                          {decision.college}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {courtLabels[decision.court] || decision.court}
                      </span>
                      {decision.decisionDate && (
                        <>
                          <span className="text-sm text-gray-400">·</span>
                          <span className="text-sm text-gray-500">
                            {new Date(decision.decisionDate).toLocaleDateString('sq-AL')}
                          </span>
                        </>
                      )}
                    </div>
                    <button onClick={() => toggleSave(decision.id)}
                      className="rounded-lg p-1.5 hover:bg-gray-100"
                      title={decision.isSaved ? 'Hiq nga të ruajturat' : 'Ruaj vendimin'}>
                      {decision.isSaved ? (
                        <BookmarkSolidIcon className="h-5 w-5 text-amber-500" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{decision.decisionNumber}</span>
                    {decision.caseNumber && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">Çështja: {decision.caseNumber}</span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-2 text-base font-semibold text-gray-900">{decision.subject}</h3>

                  {decision.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{decision.summary}</p>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    {decision.sourceUrl && (
                      <a href={decision.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        Shiko origjinalin
                      </a>
                    )}
                    {decision.pdfUrl && (
                      <a href={decision.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                        <DocumentArrowDownIcon className="h-4 w-4" />
                        Shkarko PDF
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
