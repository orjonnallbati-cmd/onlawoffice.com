'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ScaleIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseNumber: '',
    barAssociation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'sq';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          licenseNumber: form.licenseNumber || undefined,
          barAssociation: form.barAssociation || undefined,
        }),
      });

      if (res.ok) {
        router.push(locale === 'sq' ? '/app/login' : `/${locale}/app/login`);
      } else {
        const data = await res.json();
        setError(data.error || 'Ndodhi një gabim gjatë regjistrimit');
      }
    } catch {
      setError('Ndodhi një gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const loginHref = locale === 'sq' ? '/app/login' : `/${locale}/app/login`;

  const barAssociations = [
    'Dhoma e Avokatisë Tiranë',
    'Dhoma e Avokatisë Durrës',
    'Dhoma e Avokatisë Elbasan',
    'Dhoma e Avokatisë Shkodër',
    'Dhoma e Avokatisë Vlorë',
    'Dhoma e Avokatisë Korçë',
    'Dhoma e Avokatisë Fier',
    'Dhoma e Avokatisë Gjirokastër',
    'Dhoma e Avokatisë Berat',
    'Dhoma e Avokatisë Lushnjë',
    'Dhoma e Avokatisë Sarandë',
    'Dhoma e Avokatisë Pogradec',
    'Dhoma e Avokatisë Kukës',
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <ScaleIcon className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">OnLaw Office</h1>
          <p className="mt-1 text-sm text-gray-400">Krijo llogarinë e re</p>
        </div>

        {/* Register Form */}
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-white">Regjistrimi</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Emri i plotë *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Av. Emri Mbiemri"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="avokat@shembull.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Fjalëkalimi *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Konfirmo fjalëkalimin *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Telefoni
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="+355 6X XXX XXXX"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Nr. Licence Avokati
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nr. XXXX"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Dhoma e Avokatisë
                </label>
                <select
                  name="barAssociation"
                  value={form.barAssociation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Zgjidhni dhomën...</option>
                  {barAssociations.map((ba) => (
                    <option key={ba} value={ba}>
                      {ba}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Keni tashmë llogari?{' '}
            <Link href={loginHref} className="text-blue-400 hover:text-blue-300">
              Hyni
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
