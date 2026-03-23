'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface DocumentData {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  category: string;
  createdAt: string;
  case: { id: string; title: string; caseNumber: string } | null;
}

const categoryLabels: Record<string, string> = {
  CONTRACT: 'Kontratë',
  COURT_FILING: 'Dokument gjyqësor',
  EVIDENCE: 'Provë',
  CORRESPONDENCE: 'Korrespondencë',
  POWER_OF_ATTORNEY: 'Prokurë',
  DECISION: 'Vendim',
  APPEAL: 'Ankim',
  OTHER: 'Tjetër',
};

const categoryColors: Record<string, string> = {
  CONTRACT: 'bg-blue-100 text-blue-700',
  COURT_FILING: 'bg-purple-100 text-purple-700',
  EVIDENCE: 'bg-green-100 text-green-700',
  CORRESPONDENCE: 'bg-gray-100 text-gray-700',
  POWER_OF_ATTORNEY: 'bg-amber-100 text-amber-700',
  DECISION: 'bg-red-100 text-red-700',
  APPEAL: 'bg-indigo-100 text-indigo-700',
  OTHER: 'bg-gray-100 text-gray-600',
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchDocuments = useCallback(async (q?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category) params.set('category', category);
      const url = `/api/documents${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDocuments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchDocuments(search || undefined, categoryFilter || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, fetchDocuments]);

  return (
    <div>
      <AppHeader
        title="Dokumente"
        subtitle={loading ? 'Duke ngarkuar...' : `${documents.length} dokumente`}
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko dokument..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Të gjitha kategoritë</option>
                {Object.entries(categoryLabels).map(([key, val]) => (
                  <option key={key} value={key}>{val}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">Duke ngarkuar dokumentet...</div>
          ) : documents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                {search || categoryFilter
                  ? 'Nuk u gjet asnjë dokument me këto filtra'
                  : 'Nuk keni dokumente ende. Dokumentet shtohen nga çështjet.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Dokumenti</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Kategoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Çështja</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Madhësia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => {
                  const catColor = categoryColors[doc.category] || categoryColors.OTHER;
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.title}</p>
                            <p className="text-sm text-gray-500">{doc.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${catColor}`}>
                          {categoryLabels[doc.category] || doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {doc.case ? `${doc.case.caseNumber} - ${doc.case.title}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString('sq-AL')}
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
