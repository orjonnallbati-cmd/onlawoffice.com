'use client';

import { useEffect, useState } from 'react';
import {
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AppHeader from '@/components/app/AppHeader';
import StatsCard from '@/components/app/StatsCard';

interface CaseClient {
  client: { firstName: string; lastName: string };
}

interface CaseData {
  id: string;
  title: string;
  caseNumber: string;
  status: string;
  caseType: string;
  nextHearing: string | null;
  clients: CaseClient[];
}

interface EventData {
  id: string;
  title: string;
  startDate: string;
  eventType: string;
  location: string | null;
  case: { title: string; caseNumber: string } | null;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'E hapur', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'Në progres', color: 'bg-yellow-100 text-yellow-700' },
  HEARING_SCHEDULED: { label: 'Seancë e caktuar', color: 'bg-purple-100 text-purple-700' },
  AWAITING_DECISION: { label: 'Në pritje vendimi', color: 'bg-orange-100 text-orange-700' },
  CLOSED_WON: { label: 'Fituar', color: 'bg-green-100 text-green-700' },
  CLOSED_LOST: { label: 'Humbur', color: 'bg-red-100 text-red-700' },
};

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  HEARING: { label: 'Seancë', color: 'bg-red-100 text-red-700' },
  MEETING: { label: 'Takim', color: 'bg-blue-100 text-blue-700' },
  DEADLINE: { label: 'Afat', color: 'bg-orange-100 text-orange-700' },
  OTHER: { label: 'Tjetër', color: 'bg-gray-100 text-gray-700' },
};

export default function DashboardPage() {
  const [recentCases, setRecentCases] = useState<CaseData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [stats, setStats] = useState({ activeCases: 0, totalClients: 0, weekEvents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [casesRes, clientsRes, eventsRes] = await Promise.all([
          fetch('/api/cases?limit=4'),
          fetch('/api/clients'),
          fetch('/api/events?from=' + new Date().toISOString()),
        ]);

        if (casesRes.ok) {
          const casesData = await casesRes.json();
          setRecentCases(casesData.cases || []);
          setStats((prev) => ({ ...prev, activeCases: casesData.pagination?.total || 0 }));
        }

        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          setStats((prev) => ({ ...prev, totalClients: Array.isArray(clientsData) ? clientsData.length : 0 }));
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const events = Array.isArray(eventsData) ? eventsData : [];
          setUpcomingEvents(events.slice(0, 5));
          // Count events this week
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          const weekEvents = events.filter(
            (e: EventData) => new Date(e.startDate) <= weekFromNow
          ).length;
          setStats((prev) => ({ ...prev, weekEvents }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getClientName = (c: CaseData) => {
    if (c.clients?.length > 0) {
      const client = c.clients[0].client;
      return `${client.firstName} ${client.lastName}`;
    }
    return '—';
  };

  return (
    <div>
      <AppHeader
        title="Dashboard"
        subtitle="Pamje e përgjithshme e aktivitetit"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Çështje aktive"
            value={loading ? '...' : stats.activeCases}
            icon={BriefcaseIcon}
          />
          <StatsCard
            title="Klientë"
            value={loading ? '...' : stats.totalClients}
            icon={UsersIcon}
          />
          <StatsCard
            title="Ngjarje këtë javë"
            value={loading ? '...' : stats.weekEvents}
            icon={CalendarIcon}
          />
          <StatsCard
            title="Orë të faturueshme"
            value="—"
            change="Së shpejti"
            icon={ClockIcon}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Cases */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Çështjet e fundit</h2>
              <Link
                href="/app/cases/new"
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                Çështje e re
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="px-6 py-8 text-center text-sm text-gray-500">
                  Duke ngarkuar...
                </div>
              ) : recentCases.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <BriefcaseIcon className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Nuk keni çështje ende. Krijoni çështjen e parë!</p>
                </div>
              ) : (
                recentCases.map((c) => {
                  const status = statusLabels[c.status] || statusLabels.OPEN;
                  return (
                    <div key={c.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{c.title}</p>
                          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                            <span>{c.caseNumber}</span>
                            <span>·</span>
                            <span>{getClientName(c)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {c.nextHearing && (
                            <span className="text-sm text-gray-500">
                              Seanca: {new Date(c.nextHearing).toLocaleDateString('sq-AL')}
                            </span>
                          )}
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {recentCases.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-3">
                <Link href="/app/cases" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Shiko të gjitha çështjet →
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Ngjarjet e ardhshme</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="px-6 py-8 text-center text-sm text-gray-500">
                  Duke ngarkuar...
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <CalendarIcon className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Nuk keni ngjarje të ardhshme</p>
                </div>
              ) : (
                upcomingEvents.map((event) => {
                  const type = eventTypeLabels[event.eventType] || eventTypeLabels.OTHER;
                  return (
                    <div key={event.id} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${type.color}`}>
                            {type.label}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(event.startDate).toLocaleDateString('sq-AL')}{' '}
                            në {new Date(event.startDate).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {event.location && (
                            <p className="mt-0.5 text-xs text-gray-400">{event.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-gray-200 px-6 py-3">
              <Link href="/app/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Shiko kalendarin →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/app/vendime"
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="rounded-lg bg-purple-100 p-3">
              <ScaleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Kërko Vendime</p>
              <p className="text-sm text-gray-500">Gjykata e Lartë & Kushtetuese</p>
            </div>
          </Link>

          <Link
            href="/app/clients"
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="rounded-lg bg-green-100 p-3">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Klient i ri</p>
              <p className="text-sm text-gray-500">Shto klient në regjistër</p>
            </div>
          </Link>

          <Link
            href="/app/cases"
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="rounded-lg bg-amber-100 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Raporte</p>
              <p className="text-sm text-gray-500">Statistika & performancë</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
