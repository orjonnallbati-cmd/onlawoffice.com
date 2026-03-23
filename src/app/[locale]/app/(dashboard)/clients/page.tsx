'use client';

import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

// Demo data
const demoClients = [
  {
    id: '1',
    firstName: 'Arben',
    lastName: 'Hoxha',
    email: 'arben.hoxha@email.com',
    phone: '+355 69 123 4567',
    type: 'INDIVIDUAL',
    city: 'Tiranë',
    casesCount: 2,
  },
  {
    id: '2',
    firstName: 'ABC',
    lastName: 'Shpk',
    email: 'info@abc-shpk.al',
    phone: '+355 4 234 5678',
    type: 'BUSINESS',
    city: 'Tiranë',
    nuis: 'L12345678A',
    casesCount: 3,
  },
  {
    id: '3',
    firstName: 'Elena',
    lastName: 'Muka',
    email: 'elena.muka@email.com',
    phone: '+355 68 987 6543',
    type: 'INDIVIDUAL',
    city: 'Durrës',
    casesCount: 1,
  },
  {
    id: '4',
    firstName: 'Fatmir',
    lastName: 'Kaci',
    email: null,
    phone: '+355 69 456 7890',
    type: 'INDIVIDUAL',
    city: 'Tiranë',
    casesCount: 1,
  },
  {
    id: '5',
    firstName: 'Dritan',
    lastName: 'Nexhipi',
    email: 'dritan.n@email.com',
    phone: '+355 67 321 0987',
    type: 'INDIVIDUAL',
    city: 'Elbasan',
    casesCount: 1,
  },
  {
    id: '6',
    firstName: 'Blerim',
    lastName: 'Dema',
    email: null,
    phone: '+355 69 111 2222',
    type: 'INDIVIDUAL',
    city: 'Tiranë',
    casesCount: 1,
  },
];

const typeLabels: Record<string, string> = {
  INDIVIDUAL: 'Individ',
  BUSINESS: 'Biznes',
  GOVERNMENT: 'Shtetëror',
};

export default function ClientsPage() {
  const [search, setSearch] = useState('');
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

  const filteredClients = demoClients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    // Will connect to API
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
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
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div>
      <AppHeader
        title="Klientët"
        subtitle={`${demoClients.length} klientë të regjistruar`}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
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
                      {typeLabels[client.type]} · {client.city}
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
                  {client.casesCount} çështje
                </span>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Shiko detajet
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="py-16 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">Nuk u gjet asnjë klient</p>
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
