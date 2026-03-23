'use client';

import {
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AppHeader from '@/components/app/AppHeader';
import StatsCard from '@/components/app/StatsCard';

// Demo data - will be replaced with real API calls
const recentCases = [
  {
    id: '1',
    title: 'Çështja e pronës - Rruga Myslym Shyri',
    caseNumber: 'CIV-2026-0142',
    status: 'IN_PROGRESS',
    client: 'Arben Hoxha',
    nextHearing: '2026-04-02',
    caseType: 'CIVIL',
  },
  {
    id: '2',
    title: 'Ankimim vendimi administrativ - ASHK',
    caseNumber: 'ADM-2026-0088',
    status: 'HEARING_SCHEDULED',
    client: 'Fatmir Kaci',
    nextHearing: '2026-03-28',
    caseType: 'ADMINISTRATIVE',
  },
  {
    id: '3',
    title: 'Kontratë punësimi - ABC Shpk',
    caseNumber: 'COM-2026-0203',
    status: 'OPEN',
    client: 'ABC Shpk',
    nextHearing: null,
    caseType: 'COMMERCIAL',
  },
  {
    id: '4',
    title: 'Divorc me pëlqim - Çifti Muka',
    caseNumber: 'FAM-2026-0067',
    status: 'AWAITING_DECISION',
    client: 'Elena Muka',
    nextHearing: null,
    caseType: 'FAMILY',
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Seancë gjyqësore - Hoxha vs. Bashkia Tiranë',
    date: '2026-03-25',
    time: '10:00',
    type: 'HEARING',
    court: 'Gjykata e Rrethit Gjyqësor Tiranë',
  },
  {
    id: '2',
    title: 'Takim me klientin - Fatmir Kaci',
    date: '2026-03-26',
    time: '14:30',
    type: 'MEETING',
    court: null,
  },
  {
    id: '3',
    title: 'Afat dorëzimi - Ankimim Gjykata e Apelit',
    date: '2026-03-28',
    time: '16:00',
    type: 'DEADLINE',
    court: 'Gjykata e Apelit Tiranë',
  },
];

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
};

export default function DashboardPage() {
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
            value={12}
            change="+3 këtë muaj"
            changeType="positive"
            icon={BriefcaseIcon}
          />
          <StatsCard
            title="Klientë"
            value={34}
            change="+5 këtë muaj"
            changeType="positive"
            icon={UsersIcon}
          />
          <StatsCard
            title="Seanca këtë javë"
            value={3}
            change="E hënë, e mërkurë, e premte"
            icon={CalendarIcon}
          />
          <StatsCard
            title="Orë të faturueshme"
            value="47.5"
            change="Këtë muaj"
            icon={ClockIcon}
          />
        </div>

        {/* Alerts */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">3 afate në 7 ditët e ardhshme</p>
              <p className="text-sm text-amber-600">
                Kontrolloni kalendarin për afatet e dorëzimit të dokumenteve
              </p>
            </div>
          </div>
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
              {recentCases.map((c) => {
                const status = statusLabels[c.status] || statusLabels.OPEN;
                return (
                  <div key={c.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{c.title}</p>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                          <span>{c.caseNumber}</span>
                          <span>·</span>
                          <span>{c.client}</span>
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
              })}
            </div>
            <div className="border-t border-gray-200 px-6 py-3">
              <Link href="/app/cases" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Shiko të gjitha çështjet →
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Ngjarjet e ardhshme</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingEvents.map((event) => {
                const type = eventTypeLabels[event.type] || eventTypeLabels.MEETING;
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
                          {new Date(event.date).toLocaleDateString('sq-AL')} në {event.time}
                        </p>
                        {event.court && (
                          <p className="mt-0.5 text-xs text-gray-400">{event.court}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
