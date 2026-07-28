'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface DpiaData {
  id: string;
  title: string;
  processName: string | null;
  description: string | null;
  riskLevel: string;
  status: string;
  consultedAuthority: boolean;
  startedAt: string;
  completedAt: string | null;
  reviewDate: string | null;
  client: ClientOption | null;
}

const riskLabels: Record<string, string> = {
  LOW: 'I ulët',
  MEDIUM: 'I mesëm',
  HIGH: 'I lartë',
};

const riskColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'Në proces',
  COMPLETED: 'I përfunduar',
  REVIEW_NEEDED: 'Kërkon rishikim',
};

const emptyForm = {
  title: '',
  processName: '',
  description: '',
  riskLevel: 'MEDIUM',
  mitigations: '',
  consultedAuthority: false,
  reviewDate: '',
  notes: '',
  clientId: '',
};

export default function DpiaPage() {
  const [dpias, setDpias] = useState<DpiaData[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchDpias = useCallback(async (q?: string) => {
    try {
      const url = q ? `/api/dpo/dpia?q=${encodeURIComponent(q)}` : '/api/dpo/dpia';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDpias(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching DPIAs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDpias();
    fetch('/api/clients')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [fetchDpias]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDpias(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search, fetchDpias]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dpo/dpia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        fetchDpias(search || undefined);
      }
    } catch (error) {
      console.error('Error creating DPIA:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const body: Record<string, unknown> = { status };
      // Kur përfundon, regjistro automatikisht datën e përfundimit
      if (status === 'COMPLETED') {
        body.completedAt = new Date().toISOString();
      }
      const res = await fetch(`/api/dpo/dpia/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchDpias(search || undefined);
    } catch (error) {
      console.error('Error updating DPIA:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini vlerësimin "${title}"?`)) return;
    try {
      const res = await fetch(`/api/dpo/dpia/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDpias(search || undefined);
    } catch (error) {
      console.error('Error deleting DPIA:', error);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';

  return (
    <div>
      <AppHeader
        title="Vlerësime DPIA"
        subtitle={
          loading ? 'Duke ngarkuar...' : `${dpias.length} vlerësime ndikimi të regjistruara`
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
              placeholder="Kërko vlerësim..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            DPIA e re
          </button>
        </div>

        {/* DPIAs */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Duke ngarkuar vlerësimet...
          </div>
        ) : dpias.length === 0 ? (
          <div className="py-16 text-center">
            <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search ? 'Nuk u gjet asnjë vlerësim' : 'Asnjë vlerësim DPIA i regjistruar.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dpias.map((d) => (
              <div key={d.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{d.title}</p>
                    {d.processName && (
                      <p className="text-xs text-gray-500">{d.processName}</p>
                    )}
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      riskColors[d.riskLevel] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Rrezik {riskLabels[d.riskLevel]?.toLowerCase() || d.riskLevel}
                  </span>
                </div>

                {d.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {d.description}
                  </p>
                )}

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p>Filluar: {new Date(d.startedAt).toLocaleDateString('sq-AL')}</p>
                  {d.completedAt && (
                    <p>Përfunduar: {new Date(d.completedAt).toLocaleDateString('sq-AL')}</p>
                  )}
                  {d.reviewDate && (
                    <p>Rishikimi i radhës: {new Date(d.reviewDate).toLocaleDateString('sq-AL')}</p>
                  )}
                  {d.client && (
                    <p>
                      Kontrolluesi: {d.client.firstName} {d.client.lastName}
                    </p>
                  )}
                  {d.consultedAuthority && (
                    <p className="font-medium text-blue-600">
                      ✓ Konsultim paraprak me Komisionerin
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
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
                  <button
                    onClick={() => handleDelete(d.id, d.title)}
                    className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Fshi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Vlerësim i ri ndikimi (DPIA)
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Titulli *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="p.sh. DPIA — Sistemi i videovëzhgimit (CCTV)"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Përpunimi që vlerësohet
                </label>
                <input
                  type="text"
                  value={form.processName}
                  onChange={(e) => setForm({ ...form, processName: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Përshkrimi
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Niveli i rrezikut
                  </label>
                  <select
                    value={form.riskLevel}
                    onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}
                    className={inputClass}
                  >
                    {Object.entries(riskLabels).map(([value, label]) => (
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

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Masat zbutëse
                </label>
                <textarea
                  value={form.mitigations}
                  onChange={(e) => setForm({ ...form, mitigations: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 items-end gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Data e rishikimit të radhës
                  </label>
                  <input
                    type="date"
                    value={form.reviewDate}
                    onChange={(e) => setForm({ ...form, reviewDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.consultedAuthority}
                    onChange={(e) =>
                      setForm({ ...form, consultedAuthority: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Konsultim paraprak me Komisionerin
                </label>
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
                  Ruaj vlerësimin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
