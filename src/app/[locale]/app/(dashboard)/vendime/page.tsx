'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ScaleIcon,
  BookmarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import AppHeader from '@/components/app/AppHeader';

// Demo data representing scraped court decisions
const demoDecisions = [
  {
    id: '1',
    decisionNumber: 'Nr. 00-2026-234',
    caseNumber: '11243-00834-00-2025',
    court: 'GJYKATA_LARTE',
    college: 'Kolegji Civil',
    decisionType: 'Vendim Përfundimtar',
    decisionDate: '2026-03-15',
    subject: 'Pavlefshmëri e kontratës së shitblerjes. Kthim i sendit. Shpërblim dëmi.',
    summary:
      'Kolegji Civil i Gjykatës së Lartë vendosi të lërë në fuqi vendimin e Gjykatës së Apelit Tiranë, duke konfirmuar pavlefshmërinë e kontratës së shitblerjes për mungesë të formës së kërkuar me ligj. Pala paditëse ka të drejtë për kthimin e sendit dhe shpërblimin e dëmit të shkaktuar.',
    sourceUrl: 'https://www.gjykataelarte.gov.al/sq/vendime-perfundimtare/',
    pdfUrl: null,
    saved: false,
  },
  {
    id: '2',
    decisionNumber: 'Nr. 00-2026-198',
    caseNumber: '11243-00756-00-2025',
    court: 'GJYKATA_LARTE',
    college: 'Kolegji Administrativ',
    decisionType: 'Vendim Përfundimtar',
    decisionDate: '2026-03-10',
    subject: 'Shfuqizim i aktit administrativ. Leje ndërtimi. Kompetenca territoriale.',
    summary:
      'Kolegji Administrativ vendosi shfuqizimin e aktit administrativ të lëshuar nga ASHK-ja, duke konstatuar se leja e ndërtimit ishte lëshuar në kundërshtim me planin e përgjithshëm vendor.',
    sourceUrl: 'https://www.gjykataelarte.gov.al/sq/vendime-perfundimtare/',
    pdfUrl: 'https://example.com/decision.pdf',
    saved: true,
  },
  {
    id: '3',
    decisionNumber: 'Nr. 00-2026-167',
    caseNumber: '11243-00689-00-2025',
    court: 'GJYKATA_LARTE',
    college: 'Kolegji Penal',
    decisionType: 'Vendim Përfundimtar',
    decisionDate: '2026-03-05',
    subject: 'Vjedhje e kualifikuar. Masë sigurimi. Arrest në burg.',
    summary:
      'Kolegji Penal i Gjykatës së Lartë vendosi rrëzimin e rekursit, duke lënë në fuqi vendimin e Gjykatës së Apelit për dënimin e të pandehurit me 5 vjet burgim për veprën penale të vjedhjes së kualifikuar.',
    sourceUrl: 'https://www.gjykataelarte.gov.al/sq/vendime-perfundimtare/',
    pdfUrl: null,
    saved: false,
  },
  {
    id: '4',
    decisionNumber: 'Nr. 5/2026',
    caseNumber: null,
    court: 'GJYKATA_KUSHTETUESE',
    college: 'Gjykata Kushtetuese',
    decisionType: 'Vendim Përfundimtar',
    decisionDate: '2026-02-28',
    subject: 'Shfuqizim i nenit 45/3 të Ligjit "Për Tatimin mbi Vlerën e Shtuar". Antikushtetutshmëri.',
    summary:
      'Gjykata Kushtetuese vendosi shfuqizimin e nenit 45/3 të Ligjit Nr. 92/2014 "Për Tatimin mbi Vlerën e Shtuar", duke e gjetur në kundërshtim me nenin 17 dhe 131 të Kushtetutës, për shkak të shkeljes së parimit të proporcionalitetit.',
    sourceUrl: 'https://www.gjykatakushtetuese.gov.al/vendime-perfundimtare-2026/',
    pdfUrl: 'https://example.com/gjk-decision.pdf',
    saved: false,
  },
  {
    id: '5',
    decisionNumber: 'Nr. 00-2026-145',
    caseNumber: '21001-00432-00-2024',
    court: 'GJYKATA_LARTE',
    college: 'Kolegjet e Bashkuara',
    decisionType: 'Vendim Njësues',
    decisionDate: '2026-02-20',
    subject: 'Njësim i praktikës gjyqësore. Afati i parashkrimit për paditë e kundërshtimit të akteve administrative.',
    summary:
      'Kolegjet e Bashkuara të Gjykatës së Lartë vendosën njësimin e praktikës gjyqësore lidhur me afatin e parashkrimit për paditë e kundërshtimit të akteve administrative, duke vendosur se afati 45-ditor fillon nga dita e njoftimit të aktit, jo nga dita e nxjerrjes.',
    sourceUrl: 'https://www.gjykataelarte.gov.al/sq/vendime-per-njesiminndryshimin-e-praktikes-gjyqesore/',
    pdfUrl: null,
    saved: true,
  },
];

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
  const [search, setSearch] = useState('');
  const [courtFilter, setCourtFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [savedDecisions, setSavedDecisions] = useState<Set<string>>(
    new Set(demoDecisions.filter((d) => d.saved).map((d) => d.id))
  );

  const toggleSave = (id: string) => {
    setSavedDecisions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredDecisions = demoDecisions.filter((d) => {
    const matchesSearch =
      !search ||
      d.subject.toLowerCase().includes(search.toLowerCase()) ||
      d.summary?.toLowerCase().includes(search.toLowerCase()) ||
      d.decisionNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesCourt = !courtFilter || d.court === courtFilter;
    const matchesCollege = !collegeFilter || d.college === collegeFilter;
    return matchesSearch && matchesCourt && matchesCollege;
  });

  return (
    <div>
      <AppHeader
        title="Vendime Gjyqësore"
        subtitle="Kërko vendime nga Gjykata e Lartë dhe Gjykata Kushtetuese"
      />

      <div className="p-6">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          {/* Main search */}
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Të gjitha gjykatat</option>
              <option value="GJYKATA_LARTE">Gjykata e Lartë</option>
              <option value="GJYKATA_KUSHTETUESE">Gjykata Kushtetuese</option>
            </select>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Të gjitha kolegjet</option>
              <option value="Kolegji Civil">Kolegji Civil</option>
              <option value="Kolegji Penal">Kolegji Penal</option>
              <option value="Kolegji Administrativ">Kolegji Administrativ</option>
              <option value="Kolegjet e Bashkuara">Kolegjet e Bashkuara</option>
              <option value="Gjykata Kushtetuese">Gjykata Kushtetuese</option>
            </select>

            <span className="text-sm text-gray-500">
              {filteredDecisions.length} vendime të gjetura
            </span>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <ScaleIcon className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Burimet e të dhënave</p>
              <p className="mt-1 text-sm text-blue-600">
                Vendimet merren automatikisht nga{' '}
                <a
                  href="https://www.gjykataelarte.gov.al/sq/vendimet-e-gjykates/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  gjykataelarte.gov.al
                </a>{' '}
                dhe{' '}
                <a
                  href="https://www.gjykatakushtetuese.gov.al/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  gjykatakushtetuese.gov.al
                </a>
                . Përditësimi i fundit: sot.
              </p>
            </div>
          </div>
        </div>

        {/* Decision Cards */}
        <div className="space-y-4">
          {filteredDecisions.map((decision) => {
            const isSaved = savedDecisions.has(decision.id);
            const collegeColor = collegeColors[decision.college || ''] || 'bg-gray-100 text-gray-700';

            return (
              <div
                key={decision.id}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${collegeColor}`}>
                      {decision.college}
                    </span>
                    <span className="text-sm text-gray-500">
                      {courtLabels[decision.court] || decision.court}
                    </span>
                    <span className="text-sm text-gray-400">·</span>
                    <span className="text-sm text-gray-500">
                      {decision.decisionDate &&
                        new Date(decision.decisionDate).toLocaleDateString('sq-AL')}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSave(decision.id)}
                    className="rounded-lg p-1.5 hover:bg-gray-100"
                    title={isSaved ? 'Hiq nga të ruajturat' : 'Ruaj vendimin'}
                  >
                    {isSaved ? (
                      <BookmarkSolidIcon className="h-5 w-5 text-amber-500" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Decision Number */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {decision.decisionNumber}
                  </span>
                  {decision.caseNumber && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-500">
                        Çështja: {decision.caseNumber}
                      </span>
                    </>
                  )}
                </div>

                {/* Subject */}
                <h3 className="mt-2 text-base font-semibold text-gray-900">
                  {decision.subject}
                </h3>

                {/* Summary */}
                {decision.summary && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {decision.summary}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={decision.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Shiko origjinalin
                  </a>
                  {decision.pdfUrl && (
                    <a
                      href={decision.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      Shkarko PDF
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredDecisions.length === 0 && (
            <div className="py-16 text-center">
              <ScaleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">Nuk u gjet asnjë vendim me këto kritere</p>
              <p className="mt-1 text-sm text-gray-400">
                Provoni të ndryshoni filtrat ose fjalët kyçe
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
