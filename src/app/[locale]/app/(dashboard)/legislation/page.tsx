'use client';

import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface LegalCode {
  title: string;
  previewUrl: string;
  pdfUrl: string | null;
  category: 'CODE' | 'SUMMARY' | 'LAW' | 'DECISION';
  lastUpdated: string | null;
}

interface LegislationAct {
  title: string;
  actType: string;
  actNumber: string | null;
  institution: string | null;
  datePublished: string | null;
  eliUrl: string;
  pdfUrl: string | null;
  summary: string | null;
}

type Tab = 'codes' | 'summaries' | 'search';

export default function LegislationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('codes');
  const [codes, setCodes] = useState<LegalCode[]>([]);
  const [summaries, setSummaries] = useState<LegalCode[]>([]);
  const [searchResults, setSearchResults] = useState<LegislationAct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchLegislation();
  }, []);

  const fetchLegislation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/legislation');
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
        setSummaries(data.summaries || []);
      }
    } catch (error) {
      console.error('Failed to fetch legislation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setActiveTab('search');
    try {
      const res = await fetch(`/api/legislation?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const tabs = [
    { key: 'codes' as Tab, label: 'Kodet e RSH', count: codes.length },
    { key: 'summaries' as Tab, label: 'Përmbledhje Legjislacioni', count: summaries.length },
    { key: 'search' as Tab, label: 'Kërko Legjislacion', count: searchResults.length },
  ];

  return (
    <div>
      <AppHeader
        title="Legjislacioni"
        subtitle="Kodet, ligjet dhe përmbledhjet e legjislacionit shqiptar"
      />

      <div className="p-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërko ligje, vendime, akte normative... (p.sh. 'ligj punës', 'kodi civil')"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {searching ? 'Duke kërkuar...' : 'Kërko në QBZ'}
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Duke ngarkuar...</div>
        ) : (
          <>
            {/* Codes Tab */}
            {activeTab === 'codes' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {codes.map((code, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="rounded-lg bg-amber-100 p-2">
                        <BookOpenIcon className="h-6 w-6 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{code.title}</h3>
                        <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          Kod
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={code.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                        Shiko në QBZ
                      </a>
                      {code.pdfUrl && (
                        <a
                          href={code.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          <DocumentArrowDownIcon className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summaries Tab */}
            {activeTab === 'summaries' && (
              <div className="grid gap-4 md:grid-cols-2">
                {summaries.map((summary, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <DocumentTextIcon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{summary.title}</h3>
                        {summary.lastUpdated && (
                          <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {summary.lastUpdated}
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={summary.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                      Shiko në QBZ
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results Tab */}
            {activeTab === 'search' && (
              <div>
                {searching ? (
                  <div className="py-12 text-center text-gray-500">Duke kërkuar në QBZ...</div>
                ) : searchResults.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    {searchQuery
                      ? 'Nuk u gjetën rezultate. Provoni me terma të ndryshme.'
                      : 'Shkruani një kërkim për të gjetur ligje dhe akte.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((act, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{act.title}</h3>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                                {act.actType}
                              </span>
                              {act.actNumber && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                  Nr. {act.actNumber}
                                </span>
                              )}
                              {act.datePublished && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                  {new Date(act.datePublished).toLocaleDateString('sq-AL')}
                                </span>
                              )}
                            </div>
                            {act.summary && (
                              <p className="mt-2 text-xs text-gray-600 line-clamp-2">{act.summary}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={act.eliUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                            >
                              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                              Hap
                            </a>
                            {act.pdfUrl && (
                              <a
                                href={act.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                              >
                                <DocumentArrowDownIcon className="h-3.5 w-3.5" />
                                PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Source Info */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
          <p>
            Burimi: <a href="https://qbz.gov.al" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Qendra e Botimeve Zyrtare (QBZ)</a> —
            Arkivi Elektronik i Akteve (46,625+ akte). Përdor standardin ELI (European Legislation Identifier).
          </p>
        </div>
      </div>
    </div>
  );
}
