'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  type: string;
  city: string | null;
  nuis: string | null;
  _count: { cases: number };
}

const typeLabels: Record<string, string> = {
  INDIVIDUAL: 'Individ',
  BUSINESS: 'Biznes',
  GOVERNMENT: 'Shtetëror',
};

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    type: 'INDIVIDUAL',
    city: '',
    nuis: '',
    notes: '',
  });

  const fetchClients = useCallback(async (q?: string) => {
    try {
      const url = q ? `/api/clients?q=${encodeURIComponent(q)}` : '/api/clients';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients(search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchClients]);

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini klientin "${name}"?`)) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchClients(search || undefined);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        setShowModal(false);
        setNewClient({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          type: 'INDIVIDUAL',
          city: '',
          nuis: '',
          notes: '',
        });
        fetchClients(search || undefined);
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div>
      <AppHeader
        title="Klientët"
        subtitle={loading ? 'Duke ngarkuar...' : `${clients.length} klientë të regjistruar`}
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
              placeholder="Kërko klient..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Klient i ri
          </button>
        </div>

        {/* Client Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Duke ngarkuar klientët...</div>
        ) : clients.length === 0 ? (
          <div className="py-16 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search ? 'Nuk u gjet asnjë klient' : 'Nuk keni klientë ende. Shtoni klientin e parë!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = `/app/clients/${client.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-sm font-semibold text-blue-700">
                        {client.firstName[0]}{client.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {client.firstName} {client.lastName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {typeLabels[client.type] || client.type}{client.city ? ` · ${client.city}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      {client.phone}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-500">
                    {client._count?.cases || 0} çështje
                  </span>
                  <button
                    onClick={() => handleDeleteClient(client.id, `${client.firstName} ${client.lastName}`)}
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

      {/* New Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Klient i ri</h2>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Emri *</label>
                  <input
                    type="text"
                    value={newClient.firstName}
                    onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Mbiemri *</label>
                  <input
                    type="text"
                    value={newClient.lastName}
                    onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Telefoni</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="+355..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Lloji</label>
                  <select
                    value={newClient.type}
                    onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="INDIVIDUAL">Individ</option>
                    <option value="BUSINESS">Biznes</option>
                    <option value="GOVERNMENT">Shtetëror</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Qyteti</label>
                  <input
                    type="text"
                    value={newClient.city}
                    onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {newClient.type === 'BUSINESS' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">NUIS</label>
                  <input
                    type="text"
                    value={newClient.nuis}
                    onChange={(e) => setNewClient({ ...newClient, nuis: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="LXXXXXXXXX"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Shënime</label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
                  Ruaj klientin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
