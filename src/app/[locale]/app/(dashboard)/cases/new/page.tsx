'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/app/AppHeader';

const caseTypes = [
  { value: 'CIVIL', label: 'Civile' },
  { value: 'CRIMINAL', label: 'Penale' },
  { value: 'ADMINISTRATIVE', label: 'Administrative' },
  { value: 'COMMERCIAL', label: 'Tregtare' },
  { value: 'FAMILY', label: 'Familjare' },
  { value: 'LABOR', label: 'Punës' },
  { value: 'PROPERTY', label: 'Pronësie' },
  { value: 'CONSTITUTIONAL', label: 'Kushtetuese' },
];

const priorities = [
  { value: 'LOW', label: 'Ulët' },
  { value: 'MEDIUM', label: 'Mesatare' },
  { value: 'HIGH', label: 'Lartë' },
  { value: 'URGENT', label: 'Urgjente' },
];

const courts = [
  'Gjykata e Rrethit Gjyqësor Tiranë',
  'Gjykata e Rrethit Gjyqësor Durrës',
  'Gjykata e Rrethit Gjyqësor Elbasan',
  'Gjykata e Rrethit Gjyqësor Shkodër',
  'Gjykata e Rrethit Gjyqësor Vlorë',
  'Gjykata e Rrethit Gjyqësor Korçë',
  'Gjykata e Rrethit Gjyqësor Fier',
  'Gjykata e Rrethit Gjyqësor Gjirokastër',
  'Gjykata e Rrethit Gjyqësor Berat',
  'Gjykata Administrative e Shkallës së Parë Tiranë',
  'Gjykata Administrative e Apelit',
  'Gjykata e Apelit Tiranë',
  'Gjykata e Apelit Durrës',
  'Gjykata e Apelit Shkodër',
  'Gjykata e Apelit Vlorë',
  'Gjykata e Apelit Korçë',
  'Gjykata e Lartë',
  'Gjykata Kushtetuese',
  'GJKKO - Gjykata Kundër Korrupsionit',
];

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    caseType: 'CIVIL',
    caseNumber: '',
    courtName: '',
    courtCaseId: '',
    judge: '',
    opposingParty: '',
    opposingLawyer: '',
    priority: 'MEDIUM',
    nextHearing: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/app/cases');
      } else {
        const data = await res.json();
        setError(data.error || 'Ndodhi një gabim');
      }
    } catch {
      setError('Ndodhi një gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppHeader title="Çështje e re" subtitle="Krijo një çështje të re" />

      <div className="p-6">
        <div className="mx-auto max-w-3xl">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Informacione bazë
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Titulli i çështjes *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="p.sh. Çështja e pronës - Rruga Myslym Shyri"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Përshkrimi
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Përshkruani çështjen..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Lloji *
                    </label>
                    <select
                      name="caseType"
                      value={form.caseType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {caseTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Prioriteti
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {priorities.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nr. çështjes (interno)
                    </label>
                    <input
                      type="text"
                      name="caseNumber"
                      value={form.caseNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="CIV-2026-XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Court Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Informacione gjyqësore
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Gjykata
                    </label>
                    <select
                      name="courtName"
                      value={form.courtName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Zgjidhni gjykatën...</option>
                      {courts.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nr. çështjes në gjykatë
                    </label>
                    <input
                      type="text"
                      name="courtCaseId"
                      value={form.courtCaseId}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Nr. i regjistruar në gjykatë"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Gjyqtari
                    </label>
                    <input
                      type="text"
                      name="judge"
                      value={form.judge}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Pala kundërshtare
                    </label>
                    <input
                      type="text"
                      name="opposingParty"
                      value={form.opposingParty}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Avokati kundërshtar
                    </label>
                    <input
                      type="text"
                      name="opposingLawyer"
                      value={form.opposingLawyer}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Data e seancës së ardhshme
                  </label>
                  <input
                    type="datetime-local"
                    name="nextHearing"
                    value={form.nextHearing}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Anulo
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Duke ruajtur...' : 'Ruaj çështjen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
