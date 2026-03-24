'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface BusinessInfo {
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

export default function QKBPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BusinessInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    setSearching(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/qkb?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        const data = await res.json();
        setError(data.error || 'Gabim gjatë kërkimit');
      }
    } catch {
      setError('Gabim gjatë lidhjes me serverin');
    } finally {
      setSearching(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    const lower = status.toLowerCase();
    if (lower.includes('aktiv') && !lower.includes('joaktiv') && !lower.includes('ç\'aktiv')) {
      return 'bg-green-100 text-green-700';
    }
    if (lower.includes('pezull') || lower.includes('suspenduar')) {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (lower.includes('mbyll') || lower.includes('çregjistruar') || lower.includes('joaktiv')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <AppHeader
        title="Regjistri i QKB"
        subtitle="Kërko biznese në Qendrën Kombëtare të Biznesit"
      />

      <div className="p-6">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="mx-auto max-w-2xl">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Kërko me NIPT ose emër biznesi
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="p.sh. L91807001S ose Vodafone Albania"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={searching || query.trim().length < 2}
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {searching ? 'Duke kërkuar...' : 'Kërko'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              NIPT format: një shkronjë + 8 numra + një shkronjë (p.sh. L91807001S)
            </p>
          </div>
        </form>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Results */}
        {searching ? (
          <div className="py-12 text-center text-gray-500">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            Duke kërkuar në regjistrin tregtar...
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              U gjetën <strong>{results.length}</strong> rezultate
            </p>
            {results.map((biz, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-100 p-2.5">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{biz.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {biz.nipt && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            NIPT: {biz.nipt}
                          </span>
                        )}
                        {biz.status && (
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(biz.status)}`}>
                            {biz.status}
                          </span>
                        )}
                        {biz.legalForm && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            {biz.legalForm}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <a
                    href={biz.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 whitespace-nowrap"
                  >
                    Shiko në QKB
                  </a>
                </div>

                {/* Details Grid */}
                {(biz.administrator || biz.address || biz.activity || biz.registrationDate) && (
                  <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                    {biz.administrator && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span><strong>Administrator:</strong> {biz.administrator}</span>
                      </div>
                    )}
                    {biz.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span><strong>Adresa:</strong> {biz.address}</span>
                      </div>
                    )}
                    {biz.activity && (
                      <div className="col-span-2 text-sm text-gray-600">
                        <strong>Aktiviteti:</strong> {biz.activity}
                      </div>
                    )}
                    {biz.registrationDate && (
                      <div className="text-sm text-gray-600">
                        <strong>Data e regjistrimit:</strong> {biz.registrationDate}
                      </div>
                    )}
                    {biz.capital && (
                      <div className="text-sm text-gray-600">
                        <strong>Kapitali:</strong> {biz.capital}
                      </div>
                    )}
                  </div>
                )}

                {biz.shareholders.length > 0 && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Aksionerët:</p>
                    <div className="flex flex-wrap gap-1">
                      {biz.shareholders.map((sh, i) => (
                        <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{sh}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : searched ? (
          <div className="py-12 text-center text-gray-500">
            Nuk u gjet asnjë biznes me këtë kërkim. Provoni me NIPT ose emër tjetër.
          </div>
        ) : (
          <div className="mx-auto max-w-lg py-12 text-center">
            <BuildingOfficeIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">Kërko në Regjistrin Tregtar</h3>
            <p className="mt-2 text-sm text-gray-500">
              Kërko informacion mbi bizneset e regjistruara në Shqipëri.
              Mund të kërkosh me NIPT (numri i identifikimit tatimor) ose emrin e biznesit.
            </p>
          </div>
        )}

        {/* Source Info */}
        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
          <p>
            Burimi: <a href="https://qkb.gov.al" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Qendra Kombëtare e Biznesit (QKB)</a> —
            Regjistri Tregtar me 252,000+ subjekte të regjistruara.
          </p>
        </div>
      </div>
    </div>
  );
}
