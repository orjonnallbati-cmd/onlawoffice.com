'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface CaseClient {
  client: { firstName: string; lastName: string };
}

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  caseType: string;
  courtName: string | null;
  nextHearing: string | null;
  priority: string;
  openedAt: string;
  clients: CaseClient[];
}

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
  const [cases, setCases] = useState<CaseData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchCases = useCallback(async (q?: string, status?: string, type?: string) => {
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (status) params.set('status', status);
      if (type) params.set('type', type);
      const url = `/api/cases${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Debounced search & filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchCases(search || undefined, statusFilter || undefined, typeFilter || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter, fetchCases]);

  const getClientName = (c: CaseData) => {
    if (c.clients?.length > 0) {
      const client = c.clients[0].client;
      return `${client.firstName} ${client.lastName}`;
    }
    return '—';
  };

  return (
    <div>
      <AppHeader
        title="Çështjet"
        subtitle={loading ? 'Duke ngarkuar...' : `${total} çështje totale`}
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
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">Duke ngarkuar çështjet...</div>
          ) : cases.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                {search || statusFilter || typeFilter
                  ? 'Nuk u gjet asnjë çështje me këto filtra'
                  : 'Nuk keni çështje ende. Krijoni çështjen e parë!'}
              </p>
            </div>
          ) : (
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
                {cases.map((c) => {
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
                      <td className="px-6 py-4 text-sm text-gray-700">{getClientName(c)}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}
