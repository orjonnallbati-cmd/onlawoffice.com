'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ScaleIcon } from '@heroicons/react/24/outline';


const T = {
  sq: { tagline: 'Krijo llogarinë e re', title: 'Regjistrimi', name: 'Emri i plotë *', namePh: 'Av. Emri Mbiemri', email: 'Email *', password: 'Fjalëkalimi *', confirm: 'Konfirmo fjalëkalimin *', phone: 'Telefoni', license: 'Nr. Licence Avokati', licensePh: 'Nr. XXXX', bar: 'Dhoma e Avokatisë', barPh: 'Zgjidhni dhomën...', invite: 'Kodi i ftesës *', invitePh: 'E jep administratori i studios', inviteHint: 'Platforma është e brendshme: llogaritë hapen vetëm me ftesë nga OnLaw Office.', submit: 'Regjistrohu', submitting: 'Duke u regjistruar...', mismatch: 'Fjalëkalimet nuk përputhen', short: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere', error: 'Ndodhi një gabim. Provoni përsëri.', genericError: 'Ndodhi një gabim gjatë regjistrimit', have: 'Keni tashmë llogari?', login: 'Hyni' },
  en: { tagline: 'Create a new account', title: 'Registration', name: 'Full name *', namePh: 'Av. First Last', email: 'Email *', password: 'Password *', confirm: 'Confirm password *', phone: 'Phone', license: 'Lawyer licence no.', licensePh: 'No. XXXX', bar: 'Bar association', barPh: 'Select the bar association...', invite: 'Invitation code *', invitePh: 'Provided by the firm administrator', inviteHint: 'The platform is internal: accounts are opened only by invitation from OnLaw Office.', submit: 'Register', submitting: 'Registering...', mismatch: 'Passwords do not match', short: 'The password must be at least 8 characters', error: 'Something went wrong. Please try again.', genericError: 'An error occurred during registration', have: 'Already have an account?', login: 'Sign in' },
  it: { tagline: 'Crea un nuovo account', title: 'Registrazione', name: 'Nome completo *', namePh: 'Avv. Nome Cognome', email: 'Email *', password: 'Password *', confirm: 'Conferma password *', phone: 'Telefono', license: 'N. licenza avvocato', licensePh: 'N. XXXX', bar: 'Ordine degli avvocati', barPh: "Seleziona l'Ordine...", invite: 'Codice di invito *', invitePh: "Fornito dall'amministratore dello studio", inviteHint: 'La piattaforma è interna: gli account si aprono solo su invito di OnLaw Office.', submit: 'Registrati', submitting: 'Registrazione in corso...', mismatch: 'Le password non coincidono', short: 'La password deve avere almeno 8 caratteri', error: 'Si è verificato un errore. Riprova.', genericError: 'Errore durante la registrazione', have: 'Hai già un account?', login: 'Accedi' },
} as const;
type Lang = keyof typeof T;

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    licenseNumber: '',
    inviteCode: '',
    barAssociation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'sq';
  const t = T[(locale in T ? locale : 'sq') as Lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError(t.mismatch);
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError(t.short);
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
          inviteCode: form.inviteCode || undefined,
        }),
      });

      if (res.ok) {
        router.push(locale === 'sq' ? '/app/login' : `/${locale}/app/login`);
      } else {
        const data = await res.json();
        setError(data.error || t.genericError);
      }
    } catch {
      setError(t.error);
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
          <p className="mt-1 text-sm text-gray-400">{t.tagline}</p>
        </div>

        {/* Register Form */}
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-white">{t.title}</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} method="post" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-gray-300">
                    {t.name}
                </label>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={t.namePh}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-300">
                    {t.email}
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="avokat@shembull.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-300">
                    {t.password}
                </label>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="reg-confirmPassword" className="mb-1 block text-sm font-medium text-gray-300">
                    {t.confirm}
                </label>
                <input
                  id="reg-confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="reg-phone" className="mb-1 block text-sm font-medium text-gray-300">
                    {t.phone}
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="+355 6X XXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="reg-licenseNumber" className="mb-1 block text-sm font-medium text-gray-300">
                    {t.license}
                </label>
                <input
                  id="reg-licenseNumber"
                  type="text"
                  autoComplete="off"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={t.licensePh}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="reg-barAssociation" className="mb-1 block text-sm font-medium text-gray-300">
                  {t.bar}
                </label>
                <select
                  id="reg-barAssociation"
                  name="barAssociation"
                  value={form.barAssociation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{t.barPh}</option>
                  {barAssociations.map((ba) => (
                    <option key={ba} value={ba}>
                      {ba}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="reg-inviteCode" className="mb-1 block text-sm font-medium text-gray-300">
                {t.invite}
              </label>
              <input
                id="reg-inviteCode"
                type="text"
                autoComplete="off"
                name="inviteCode"
                value={form.inviteCode}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={t.invitePh}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                {t.inviteHint}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {t.have}{' '}
            <Link href={loginHref} className="text-blue-400 hover:text-blue-300">
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
