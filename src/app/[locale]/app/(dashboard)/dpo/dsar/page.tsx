'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  InboxArrowDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface DsarData {
  id: string;
  subjectName: string;
  subjectEmail: string | null;
  type: string;
  receivedAt: string;
  dueDate: string;
  completedAt: string | null;
  status: string;
  description: string | null;
  client: ClientOption | null;
}

const typeLabels: Record<string, string> = {
  ACCESS: 'Akses',
  RECTIFICATION: 'Korrigjim',
  ERASURE: 'Fshirje',
  RESTRICTION: 'Kufizim',
  PORTABILITY: 'Portabilitet',
  OBJECTION: 'Kundërshtim',
};

const statusLabels: Record<string, string> = {
  RECEIVED: 'E marrë',
  IN_PROGRESS: 'Në trajtim',
  EXTENDED: 'Afat i zgjatur',
  COMPLETED: 'E përfunduar',
  REJECTED: 'E refuzuar',
};

const emptyForm = {
  subjectName: '',
  subjectEmail: '',
  type: 'ACCESS',
  receivedAt: '',
  description: '',
  notes: '',
  clientId: '',
};

export default function DsarPage() {
  const [requests, setRequests] = useState<DsarData[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchRequests = useCallback(async (q?: string) => {
    try {
      const url = q ? `/api/dpo/dsar?q=${encodeURIComponent(q)}` : '/api/dpo/dsar';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching DSAR requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetch('/api/clients')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [fetchRequests]);

  useEffect(() => {
    const timer = setTimeout(() => fetchRequests(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search, fetchRequests]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dpo/dsar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        fetchRequests(search || undefined);
      }
    } catch (error) {
      console.error('Error creating DSAR request:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const body: Record<string, unknown> = { status };
      // Kur përfundon, regjistro automatikisht datën e përfundimit
      if (status === 'COMPLETED') {
        body.completedAt = new Date().toISOString();
      }
      const res = await fetch(`/api/dpo/dsar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchRequests(search || undefined);
    } catch (error) {
      console.error('Error updating DSAR request:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini kërkesën e "${name}"?`)) return;
    try {
      const res = await fetch(`/api/dpo/dsar/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRequests(search || undefined);
    } catch (error) {
      console.error('Error deleting DSAR request:', error);
    }
  };

  function deadlineBadge(d: DsarData) {
    if (d.status === 'COMPLETED' || d.status === 'REJECTED') {
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          {statusLabels[d.status]}
          {d.completedAt
            ? `: ${new Date(d.completedAt).toLocaleDateString('sq-AL')}`
            : ''}
        </span>
      );
    }
    const daysLeft = Math.ceil(
      (new Date(d.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          daysLeft < 0
            ? 'bg-red-100 text-red-700'
            : daysLeft <= 7
            ? 'bg-amber-100 text-amber-700'
            : 'bg-blue-100 text-blue-700'
        }`}
      >
        {daysLeft < 0 ? `${Math.abs(daysLeft)} ditë vonesë` : `${daysLeft} ditë të mbetura`}
      </span>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';

  return (
    <div>
      <AppHeader
        title="Kërkesa DSAR"
        subtitle={
          loading
            ? 'Duke ngarkuar...'
            : `${requests.length} kërkesa subjektesh · Afati i përgjigjes: 30 ditë`
        }
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko sipas subjektit..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Kërkesë e re
          </button>
        </div>

        {/* Requests */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Duke ngarkuar kërkesat...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center">
            <InboxArrowDownIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search ? 'Nuk u gjet asnjë kërkesë' : 'Asnjë kërkesë e regjistruar.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Subjekti
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Lloji
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Marrë më
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Afati
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Statusi
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{d.subjectName}</p>
                      {d.subjectEmail && (
                        <p className="text-xs text-gray-500">{d.subjectEmail}</p>
                      )}
                      {d.client && (
                        <p className="text-xs text-gray-400">
                          Kontrolluesi: {d.client.firstName} {d.client.lastName}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {typeLabels[d.type] || d.type}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(d.receivedAt).toLocaleDateString('sq-AL')}
                    </td>
                    <td className="px-4 py-3">{deadlineBadge(d)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.id, e.target.value)}
                        className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(d.id, d.subjectName)}
                        className="text-red-500 hover:text-red-700"
                        title="Fshi"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Kërkesë e re subjekti
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Emri i subjektit *
                  </label>
                  <input
                    type="text"
                    value={form.subjectName}
                    onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.subjectEmail}
                    onChange={(e) => setForm({ ...form, subjectEmail: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Lloji i kërkesës
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputClass}
                  >
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Data e marrjes *
                  </label>
                  <input
                    type="date"
                    value={form.receivedAt}
                    onChange={(e) => setForm({ ...form, receivedAt: e.target.value })}
                    className={inputClass}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Afati 30-ditor llogaritet automatikisht
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Kontrolluesi (klienti)
                </label>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">— Studio (i brendshëm) —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Përshkrimi i kërkesës
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Regjistro kërkesën
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
