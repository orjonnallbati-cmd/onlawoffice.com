'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface RopaEntryData {
  id: string;
  name: string;
  department: string | null;
  purpose: string;
  legalBasis: string;
  dataCategories: string | null;
  dataSubjects: string | null;
  retention: string | null;
  status: string;
  client: ClientOption | null;
  updatedAt: string;
}

const legalBasisLabels: Record<string, string> = {
  CONSENT: 'Pëlqimi',
  CONTRACT: 'Kontrata',
  LEGAL_OBLIGATION: 'Detyrim ligjor',
  VITAL_INTEREST: 'Interes jetik',
  PUBLIC_INTEREST: 'Interes publik',
  LEGITIMATE_INTEREST: 'Interes legjitim',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Aktiv',
  ARCHIVED: 'Arkivuar',
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-amber-100 text-amber-700',
};

const emptyForm = {
  name: '',
  department: '',
  purpose: '',
  legalBasis: 'CONTRACT',
  dataCategories: '',
  dataSubjects: '',
  recipients: '',
  transfers: '',
  retention: '',
  securityMeasures: '',
  status: 'ACTIVE',
  notes: '',
  clientId: '',
};

export default function RopaPage() {
  const [entries, setEntries] = useState<RopaEntryData[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchEntries = useCallback(async (q?: string) => {
    try {
      const url = q ? `/api/dpo/ropa?q=${encodeURIComponent(q)}` : '/api/dpo/ropa';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching RoPA entries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetch('/api/clients')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [fetchEntries]);

  useEffect(() => {
    const timer = setTimeout(() => fetchEntries(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search, fetchEntries]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dpo/ropa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        fetchEntries(search || undefined);
      }
    } catch (error) {
      console.error('Error creating RoPA entry:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/dpo/ropa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchEntries(search || undefined);
    } catch (error) {
      console.error('Error updating RoPA entry:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini regjistrimin "${name}"?`)) return;
    try {
      const res = await fetch(`/api/dpo/ropa/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEntries(search || undefined);
    } catch (error) {
      console.error('Error deleting RoPA entry:', error);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';

  return (
    <div>
      <AppHeader
        title="Regjistri RoPA"
        subtitle={
          loading
            ? 'Duke ngarkuar...'
            : `${entries.length} aktivitete përpunimi të regjistruara`
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
              placeholder="Kërko aktivitet përpunimi..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Aktivitet i ri
          </button>
        </div>

        {/* Entries */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Duke ngarkuar regjistrin...
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search
                ? 'Nuk u gjet asnjë regjistrim'
                : 'Regjistri është bosh. Shtoni aktivitetin e parë të përpunimit!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Aktiviteti
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Qëllimi
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Baza ligjore
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Kontrolluesi
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Statusi
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{entry.name}</p>
                      {entry.department && (
                        <p className="text-xs text-gray-500">{entry.department}</p>
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-600">
                      <p className="truncate">{entry.purpose}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {legalBasisLabels[entry.legalBasis] || entry.legalBasis}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {entry.client
                        ? `${entry.client.firstName} ${entry.client.lastName}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={entry.status}
                        onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${
                          statusColors[entry.status] || 'bg-gray-100 text-gray-700'
                        }`}
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
                        onClick={() => handleDelete(entry.id, entry.name)}
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
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Aktivitet i ri përpunimi
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Emri i aktivitetit *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="p.sh. Menaxhimi i burimeve njerëzore"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Departamenti
                  </label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Qëllimi i përpunimit *
                </label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  rows={2}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Baza ligjore
                  </label>
                  <select
                    value={form.legalBasis}
                    onChange={(e) => setForm({ ...form, legalBasis: e.target.value })}
                    className={inputClass}
                  >
                    {Object.entries(legalBasisLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kategoritë e të dhënave
                  </label>
                  <input
                    type="text"
                    value={form.dataCategories}
                    onChange={(e) => setForm({ ...form, dataCategories: e.target.value })}
                    className={inputClass}
                    placeholder="p.sh. identifikuese, kontakti, financiare"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kategoritë e subjekteve
                  </label>
                  <input
                    type="text"
                    value={form.dataSubjects}
                    onChange={(e) => setForm({ ...form, dataSubjects: e.target.value })}
                    className={inputClass}
                    placeholder="p.sh. punonjës, klientë, furnitorë"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Marrësit
                  </label>
                  <input
                    type="text"
                    value={form.recipients}
                    onChange={(e) => setForm({ ...form, recipients: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Transferime ndërkombëtare
                  </label>
                  <input
                    type="text"
                    value={form.transfers}
                    onChange={(e) => setForm({ ...form, transfers: e.target.value })}
                    className={inputClass}
                    placeholder="vende të treta / garanci"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Afati i ruajtjes
                  </label>
                  <input
                    type="text"
                    value={form.retention}
                    onChange={(e) => setForm({ ...form, retention: e.target.value })}
                    className={inputClass}
                    placeholder="p.sh. 5 vjet pas përfundimit"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Masat e sigurisë
                  </label>
                  <input
                    type="text"
                    value={form.securityMeasures}
                    onChange={(e) =>
                      setForm({ ...form, securityMeasures: e.target.value })
                    }
                    className={inputClass}
                    placeholder="p.sh. enkriptim, kontroll aksesi"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Shënime
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
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
                  Ruaj aktivitetin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
