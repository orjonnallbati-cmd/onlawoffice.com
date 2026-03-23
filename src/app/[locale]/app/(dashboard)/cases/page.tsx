'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

// Demo data - will be replaced with API calls
const demoCases = [
  {
    id: '1',
    caseNumber: 'CIV-2026-0142',
    title: 'Çështja e pronës - Rruga Myslym Shyri',
    status: 'IN_PROGRESS',
    caseType: 'CIVIL',
    client: 'Arben Hoxha',
    courtName: 'Gjykata e Rrethit Gjyqësor Tiranë',
    nextHearing: '2026-04-02',
    priority: 'HIGH',
    openedAt: '2026-01-15',
  },
  {
    id: '2',
    caseNumber: 'ADM-2026-0088',
    title: 'Ankimim vendimi administrativ - ASHK',
    status: 'HEARING_SCHEDULED',
    caseType: 'ADMINISTRATIVE',
    client: 'Fatmir Kaci',
    courtName: 'Gjykata Administrative Tiranë',
    nextHearing: '2026-03-28',
    priority: 'MEDIUM',
    openedAt: '2026-02-10',
  },
  {
    id: '3',
    caseNumber: 'COM-2026-0203',
    title: 'Kontratë punësimi - ABC Shpk',
    status: 'OPEN',
    caseType: 'COMMERCIAL',
    client: 'ABC Shpk',
    courtName: null,
    nextHearing: null,
    priority: 'LOW',
    openedAt: '2026-03-01',
  },
  {
    id: '4',
    caseNumber: 'FAM-2026-0067',
    title: 'Divorc me pëlqim - Çifti Muka',
    status: 'AWAITING_DECISION',
    caseType: 'FAMILY',
    client: 'Elena Muka',
    courtName: 'Gjykata e Rrethit Gjyqësor Tiranë',
    nextHearing: null,
    priority: 'MEDIUM',
    openedAt: '2026-02-20',
  },
  {
    id: '5',
    caseNumber: 'PEN-2025-0891',
    title: 'Mbrojtje penale - Çështja Dema',
    status: 'CLOSED_WON',
    caseType: 'CRIMINAL',
    client: 'Blerim Dema',
    courtName: 'Gjykata e Rrethit Gjyqësor Tiranë',
    nextHearing: null,
    priority: 'URGENT',
    openedAt: '2025-11-05',
  },
  {
    id: '6',
    caseNumber: 'LAB-2026-0034',
    title: 'Largim nga puna pa shkaqe - Nexhipi',
    status: 'IN_PROGRESS',
    caseType: 'LABOR',
    client: 'Dritan Nexhipi',
    courtName: 'Gjykata e Rrethit Gjyqësor Tiranë',
    nextHearing: '2026-04-10',
    priority: 'HIGH',
    openedAt: '2026-01-22',
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'E hapur', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'Në progres', color: 'bg-yellow-100 text-yellow-700' },
  HEARING_SCHEDULED: { label: 'Seancë e caktuar', color: 'bg-purple-100 text-purple-700' },
  AWAITING_DECISION: { label: 'Në pritje vendimi', color: 'bg-orange-100 text-orange-700' },
  CLOSED_WON: { label: 'Fituar', color: 'bg-green-100 text-green-700' },
  CLOSED_LOST: { label: 'Humbur', color: 'bg-red-100 text-red-700' },
  CLOSED_SETTLED: { label: 'Marrëveshje', color: 'bg-teal-100 text-teal-700' },
  APPEALED: { label: 'Ankimuar', color: 'bg-indigo-100 text-indigo-700' },
};

const caseTypeLabels: Record<string, string> = {
  CIVIL: 'Civile',
  CRIMINAL: 'Penale',
  ADMINISTRATIVE: 'Administrative',
  COMMERCIAL: 'Tregtare',
  FAMILY: 'Familjare',
  LABOR: 'Punës',
  PROPERTY: 'Pronësie',
  CONSTITUTIONAL: 'Kushtetuese',
};

const priorityLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Ulët', color: 'text-gray-500' },
  MEDIUM: { label: 'Mesatare', color: 'text-blue-500' },
  HIGH: { label: 'Lartë', color: 'text-orange-500' },
  URGENT: { label: 'Urgjente', color: 'text-red-500' },
};

export default function CasesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredCases = demoCases.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesType = !typeFilter || c.caseType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <AppHeader
        title="Çështjet"
        subtitle={`${demoCases.length} çështje totale`}
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko çështje, nr., klient..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Të gjitha statuset</option>
                {Object.entries(statusLabels).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Të gjitha llojet</option>
                {Object.entries(caseTypeLabels).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Link
            href="/app/cases/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Çështje e re
          </Link>
        </div>

        {/* Cases Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Çështja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Klienti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Lloji
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Prioriteti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Seanca
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((c) => {
                const status = statusLabels[c.status] || statusLabels.OPEN;
                const priority = priorityLabels[c.priority] || priorityLabels.MEDIUM;
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{c.title}</p>
                          <p className="text-sm text-gray-500">{c.caseNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{c.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {caseTypeLabels[c.caseType] || c.caseType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {c.nextHearing
                        ? new Date(c.nextHearing).toLocaleDateString('sq-AL')
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredCases.length === 0 && (
            <div className="px-6 py-12 text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">Nuk u gjet asnjë çështje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
