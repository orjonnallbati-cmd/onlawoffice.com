'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface BreachData {
  id: string;
  title: string;
  description: string | null;
  occurredAt: string | null;
  discoveredAt: string;
  notifiedAuthorityAt: string | null;
  notifiedSubjectsAt: string | null;
  severity: string;
  status: string;
  affectedSubjects: number | null;
  dataCategories: string | null;
  client: ClientOption | null;
}

const severityLabels: Record<string, string> = {
  LOW: 'I ulët',
  MEDIUM: 'I mesëm',
  HIGH: 'I lartë',
  CRITICAL: 'Kritik',
};

const severityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  DETECTED: 'I zbuluar',
  INVESTIGATING: 'Në hetim',
  CONTAINED: 'I izoluar',
  NOTIFIED: 'Autoriteti i njoftuar',
  CLOSED: 'I mbyllur',
};

const BREACH_NOTIFY_HOURS = 72;

const emptyForm = {
  title: '',
  description: '',
  occurredAt: '',
  discoveredAt: '',
  severity: 'MEDIUM',
  affectedSubjects: '',
  dataCategories: '',
  measures: '',
  notes: '',
  clientId: '',
};

export default function BreachesPage() {
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchBreaches = useCallback(async (q?: string) => {
    try {
      const url = q
        ? `/api/dpo/breaches?q=${encodeURIComponent(q)}`
        : '/api/dpo/breaches';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBreaches(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching breaches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreaches();
    fetch('/api/clients')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [fetchBreaches]);

  useEffect(() => {
    const timer = setTimeout(() => fetchBreaches(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search, fetchBreaches]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dpo/breaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        fetchBreaches(search || undefined);
      }
    } catch (error) {
      console.error('Error creating breach:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const body: Record<string, unknown> = { status };
      // Kur shënohet si i njoftuar, regjistro automatikisht datën e njoftimit
      if (status === 'NOTIFIED') {
        body.notifiedAuthorityAt = new Date().toISOString();
      }
      const res = await fetch(`/api/dpo/breaches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchBreaches(search || undefined);
    } catch (error) {
      console.error('Error updating breach:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini incidentin "${title}"?`)) return;
    try {
      const res = await fetch(`/api/dpo/breaches/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBreaches(search || undefined);
    } catch (error) {
      console.error('Error deleting breach:', error);
    }
  };

  function notifyBadge(b: BreachData) {
    if (b.notifiedAuthorityAt) {
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          Njoftuar: {new Date(b.notifiedAuthorityAt).toLocaleDateString('sq-AL')}
        </span>
      );
    }
    if (b.status === 'CLOSED') {
      return <span className="text-xs text-gray-400">—</span>;
    }
    const deadline =
      new Date(b.discoveredAt).getTime() + BREACH_NOTIFY_HOURS * 60 * 60 * 1000;
    const hoursLeft = Math.round((deadline - Date.now()) / (60 * 60 * 1000));
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
          hoursLeft < 0
            ? 'bg-red-100 text-red-700'
            : hoursLeft < 24
            ? 'bg-amber-100 text-amber-700'
            : 'bg-blue-100 text-blue-700'
        }`}
      >
        <BellAlertIcon className="h-3 w-3" />
        {hoursLeft < 0
          ? `${Math.abs(hoursLeft)} orë vonesë`
          : `${hoursLeft} orë të mbetura`}
      </span>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';

  return (
    <div>
      <AppHeader
        title="Incidente Sigurie"
        subtitle={
          loading
            ? 'Duke ngarkuar...'
            : `${breaches.length} incidente të regjistruara · Afati i njoftimit: 72 orë`
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
              placeholder="Kërko incident..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <PlusIcon className="h-4 w-4" />
            Raporto incident
          </button>
        </div>

        {/* Breaches */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Duke ngarkuar incidentet...
          </div>
        ) : breaches.length === 0 ? (
          <div className="py-16 text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search ? 'Nuk u gjet asnjë incident' : 'Asnjë incident i regjistruar.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {breaches.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{b.title}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          severityColors[b.severity] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {severityLabels[b.severity] || b.severity}
                      </span>
                    </div>
                    {b.description && (
                      <p className="mt-1 text-sm text-gray-600">{b.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        Zbuluar: {new Date(b.discoveredAt).toLocaleString('sq-AL')}
                      </span>
                      {b.affectedSubjects != null && (
                        <span>{b.affectedSubjects} subjekte të prekur</span>
                      )}
                      {b.dataCategories && <span>Të dhëna: {b.dataCategories}</span>}
                      {b.client && (
                        <span>
                          Kontrolluesi: {b.client.firstName} {b.client.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {notifyBadge(b)}
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium focus:border-blue-500 focus:outline-none"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="text-red-500 hover:text-red-700"
                      title="Fshi"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Raporto incident sigurie
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
                  placeholder="p.sh. Akses i paautorizuar në serverin e emaileve"
                  required
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
                    Kur ka ndodhur
                  </label>
                  <input
                    type="datetime-local"
                    value={form.occurredAt}
                    onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kur është zbuluar * (fillon afati 72h)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.discoveredAt}
                    onChange={(e) => setForm({ ...form, discoveredAt: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Rëndësia
                  </label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    className={inputClass}
                  >
                    {Object.entries(severityLabels).map(([value, label]) => (
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
                    Subjekte të prekur (numri)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.affectedSubjects}
                    onChange={(e) =>
                      setForm({ ...form, affectedSubjects: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kategoritë e të dhënave të prekura
                  </label>
                  <input
                    type="text"
                    value={form.dataCategories}
                    onChange={(e) => setForm({ ...form, dataCategories: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Masat e marra
                </label>
                <textarea
                  value={form.measures}
                  onChange={(e) => setForm({ ...form, measures: e.target.value })}
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
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Regjistro incidentin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
