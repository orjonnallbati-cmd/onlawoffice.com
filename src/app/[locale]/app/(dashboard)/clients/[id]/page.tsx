'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface CaseOnClient {
  case: { id: string; title: string; caseNumber: string; status: string };
}

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  nuis: string | null;
  type: string;
  notes: string | null;
  createdAt: string;
  cases: CaseOnClient[];
}

const typeLabels: Record<string, string> = {
  INDIVIDUAL: 'Individ',
  BUSINESS: 'Biznes',
  GOVERNMENT: 'Shtetëror',
};

const statusLabels: Record<string, string> = {
  OPEN: 'E hapur', IN_PROGRESS: 'Në progres', HEARING_SCHEDULED: 'Seancë e caktuar',
  AWAITING_DECISION: 'Në pritje vendimi', CLOSED_WON: 'Fituar', CLOSED_LOST: 'Humbur',
};

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', city: '', address: '',
    nuis: '', type: 'INDIVIDUAL', notes: '',
  });

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          city: data.city || '',
          address: data.address || '',
          nuis: data.nuis || '',
          type: data.type || 'INDIVIDUAL',
          notes: data.notes || '',
        });
      } else {
        setMessage({ type: 'error', text: 'Klienti nuk u gjet' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gabim gjatë ngarkimit' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Klienti u përditësua!' });
        setEditing(false);
        fetchClient();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Gabim gjatë ruajtjes' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gabim gjatë lidhjes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AppHeader title="Klienti" subtitle="Duke ngarkuar..." />
        <div className="p-6 text-center text-sm text-gray-500">Duke ngarkuar...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div>
        <AppHeader title="Klienti" subtitle="Nuk u gjet" />
        <div className="p-6 text-center">
          <p className="text-gray-500">Klienti nuk u gjet ose nuk keni akses.</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-blue-600 hover:text-blue-700">
            ← Kthehu mbrapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader
        title={`${client.firstName} ${client.lastName}`}
        subtitle={typeLabels[client.type] || client.type}
      />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/app/clients')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-4 w-4" /> Kthehu te klientët
          </button>
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <PencilIcon className="h-4 w-4" />
            {editing ? 'Anulo ndryshimin' : 'Ndrysho'}
          </button>
        </div>

        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>{message.text}</div>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Ndrysho klientin</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Emri *</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Mbiemri *</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Telefoni</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+355..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Lloji</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="INDIVIDUAL">Individ</option>
                    <option value="BUSINESS">Biznes</option>
                    <option value="GOVERNMENT">Shtetëror</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Qyteti</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Adresa</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              {form.type === 'BUSINESS' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">NUIS</label>
                  <input type="text" value={form.nuis} onChange={(e) => setForm({ ...form, nuis: e.target.value })}
                    placeholder="LXXXXXXXXX" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Shënime</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <button type="submit" disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Client Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informacione</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Emri:</span> <span className="font-medium">{client.firstName} {client.lastName}</span></div>
                  <div><span className="text-gray-500">Lloji:</span> <span className="font-medium">{typeLabels[client.type] || client.type}</span></div>
                  {client.email && <div><span className="text-gray-500">Email:</span> <span className="font-medium">{client.email}</span></div>}
                  {client.phone && <div><span className="text-gray-500">Telefoni:</span> <span className="font-medium">{client.phone}</span></div>}
                  {client.city && <div><span className="text-gray-500">Qyteti:</span> <span className="font-medium">{client.city}</span></div>}
                  {client.address && <div><span className="text-gray-500">Adresa:</span> <span className="font-medium">{client.address}</span></div>}
                  {client.nuis && <div><span className="text-gray-500">NUIS:</span> <span className="font-medium">{client.nuis}</span></div>}
                </div>
                {client.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Shënime:</span>
                    <p className="mt-1 text-sm text-gray-700">{client.notes}</p>
                  </div>
                )}
              </div>

              {/* Client Cases */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Çështjet</h3>
                {client.cases.length === 0 ? (
                  <p className="text-sm text-gray-500">Ky klient nuk ka çështje ende.</p>
                ) : (
                  <div className="space-y-2">
                    {client.cases.map((cc) => (
                      <a key={cc.case.id} href={`/app/cases/${cc.case.id}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                        <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-blue-600">{cc.case.title}</p>
                          <p className="text-xs text-gray-500">{cc.case.caseNumber} · {statusLabels[cc.case.status] || cc.case.status}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Regjistruar më</p>
                <p className="text-sm font-medium">{new Date(client.createdAt).toLocaleDateString('sq-AL')}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-500">Çështje</p>
                <p className="text-sm font-medium">{client.cases.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
