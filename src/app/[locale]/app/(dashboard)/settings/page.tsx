'use client';

import { useEffect, useState } from 'react';
import AppHeader from '@/components/app/AppHeader';

interface ProfileData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  licenseNumber: string | null;
  barAssociation: string | null;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [barAssociation, setBarAssociation] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name || '');
          setPhone(data.phone || '');
          setLicenseNumber(data.licenseNumber || '');
          setBarAssociation(data.barAssociation || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, licenseNumber, barAssociation }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => (prev ? { ...prev, ...data } : prev));
        setMessage({ type: 'success', text: 'Profili u përditësua me sukses!' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Gabim gjatë ruajtjes' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gabim gjatë lidhjes me serverin' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Fjalëkalimet nuk përputhen' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere' });
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Fjalëkalimi u ndryshua me sukses!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        setPasswordMessage({ type: 'error', text: err.error || 'Gabim gjatë ndryshimit' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Gabim gjatë lidhjes me serverin' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AppHeader title="Cilësimet" subtitle="Menaxho profilin dhe llogarinë" />
        <div className="p-6 text-center text-sm text-gray-500">Duke ngarkuar...</div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader title="Cilësimet" subtitle="Menaxho profilin dhe llogarinë" />

      <div className="mx-auto max-w-2xl p-6 space-y-8">
        {/* Profile Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profili</h2>

          {message && (
            <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Emri i plotë *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Telefoni</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+355..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nr. Licencës së Avokatit</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dhoma e Avokatisë</label>
              <input
                type="text"
                value={barAssociation}
                onChange={(e) => setBarAssociation(e.target.value)}
                placeholder="p.sh. Dhoma e Avokatisë Tiranë"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ndrysho fjalëkalimin</h2>

          {passwordMessage && (
            <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fjalëkalimi aktual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fjalëkalimi i ri</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Konfirmo fjalëkalimin e ri</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {passwordSaving ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Informacion i llogarisë</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Roli: <span className="font-medium text-gray-900">{profile?.role === 'LAWYER' ? 'Avokat' : profile?.role === 'ADMIN' ? 'Administrator' : profile?.role}</span></p>
            {profile?.createdAt && (
              <p>Regjistruar më: <span className="font-medium text-gray-900">{new Date(profile.createdAt).toLocaleDateString('sq-AL')}</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
