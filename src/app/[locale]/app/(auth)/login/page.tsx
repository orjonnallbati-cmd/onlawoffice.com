'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ScaleIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'sq';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        router.push(locale === 'sq' ? '/app/dashboard' : `/${locale}/app/dashboard`);
      } else {
        setError('Email ose fjalëkalimi nuk është i saktë');
      }
    } catch {
      setError('Ndodhi një gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const registerHref = locale === 'sq' ? '/app/register' : `/${locale}/app/register`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <ScaleIcon className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">OnLaw Office</h1>
          <p className="mt-1 text-sm text-gray-400">Sistemi i Menaxhimit Ligjor</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-white">Hyni në llogarinë</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="avokat@shembull.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Fjalëkalimi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Duke hyrë...' : 'Hyr'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Nuk keni llogari?{' '}
            <Link href={registerHref} className="text-blue-400 hover:text-blue-300">
              Regjistrohuni
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
