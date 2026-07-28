'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  InboxArrowDownIcon,
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface BreachData {
  id: string;
  title: string;
  discoveredAt: string;
  notifiedAuthorityAt: string | null;
  status: string;
  severity: string;
}

interface DsarData {
  id: string;
  subjectName: string;
  type: string;
  dueDate: string;
  status: string;
}

interface DpiaData {
  id: string;
  title: string;
  status: string;
  riskLevel: string;
}

interface RopaData {
  id: string;
  status: string;
}

const dsarTypeLabels: Record<string, string> = {
  ACCESS: 'Akses',
  RECTIFICATION: 'Korrigjim',
  ERASURE: 'Fshirje',
  RESTRICTION: 'Kufizim',
  PORTABILITY: 'Portabilitet',
  OBJECTION: 'Kundërshtim',
};

const BREACH_NOTIFY_HOURS = 72;

export default function DpoOverviewPage() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const locale = ['en', 'it', 'sq'].includes(segments[1]) ? segments[1] : 'sq';
  const getHref = (href: string) => (locale === 'sq' ? href : `/${locale}${href}`);

  const [ropa, setRopa] = useState<RopaData[]>([]);
  const [breaches, setBreaches] = useState<BreachData[]>([]);
  const [dsars, setDsars] = useState<DsarData[]>([]);
  const [dpias, setDpias] = useState<DpiaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [ropaRes, breachRes, dsarRes, dpiaRes] = await Promise.all([
          fetch('/api/dpo/ropa'),
          fetch('/api/dpo/breaches'),
          fetch('/api/dpo/dsar'),
          fetch('/api/dpo/dpia'),
        ]);
        if (ropaRes.ok) setRopa(await ropaRes.json());
        if (breachRes.ok) setBreaches(await breachRes.json());
        if (dsarRes.ok) setDsars(await dsarRes.json());
        if (dpiaRes.ok) setDpias(await dpiaRes.json());
      } catch (error) {
        console.error('Error fetching DPO data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const now = Date.now();

  // Incidente pa njoftim autoriteti, brenda ose përtej afatit 72-orësh
  const urgentBreaches = breaches.filter(
    (b) => !b.notifiedAuthorityAt && b.status !== 'CLOSED'
  );

  // DSAR të hapura me afat brenda 7 ditësh ose të tejkaluar
  const openDsars = dsars.filter(
    (d) => d.status !== 'COMPLETED' && d.status !== 'REJECTED'
  );
  const urgentDsars = openDsars.filter(
    (d) => new Date(d.dueDate).getTime() - now < 7 * 24 * 60 * 60 * 1000
  );

  const activeDpias = dpias.filter(
    (d) => d.status === 'IN_PROGRESS' || d.status === 'REVIEW_NEEDED'
  );

  const stats = [
    {
      name: 'Regjistrime RoPA',
      value: ropa.filter((r) => r.status === 'ACTIVE').length,
      total: ropa.length,
      href: '/app/dpo/ropa',
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      name: 'Incidente të hapura',
      value: breaches.filter((b) => b.status !== 'CLOSED').length,
      total: breaches.length,
      href: '/app/dpo/breaches',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-100 text-red-700',
    },
    {
      name: 'Kërkesa DSAR të hapura',
      value: openDsars.length,
      total: dsars.length,
      href: '/app/dpo/dsar',
      icon: InboxArrowDownIcon,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      name: 'DPIA aktive',
      value: activeDpias.length,
      total: dpias.length,
      href: '/app/dpo/dpia',
      icon: DocumentMagnifyingGlassIcon,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  function breachDeadline(b: BreachData) {
    const deadline =
      new Date(b.discoveredAt).getTime() + BREACH_NOTIFY_HOURS * 60 * 60 * 1000;
    const hoursLeft = Math.round((deadline - now) / (60 * 60 * 1000));
    return hoursLeft;
  }

  function dsarDaysLeft(d: DsarData) {
    return Math.ceil((new Date(d.dueDate).getTime() - now) / (24 * 60 * 60 * 1000));
  }

  return (
    <div>
      <AppHeader
        title="Suite DPO"
        subtitle="Mbrojtja e të dhënave personale — Ligji 124/2024"
      />

      <div className="p-6">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Duke ngarkuar të dhënat...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Link
                  key={stat.name}
                  href={getHref(stat.href)}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">nga {stat.total} gjithsej</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700">{stat.name}</p>
                </Link>
              ))}
            </div>

            {/* Urgent deadlines */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Breach 72h */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                  <ClockIcon className="h-5 w-5 text-red-500" />
                  <h2 className="font-semibold text-gray-900">
                    Njoftim Komisioneri — afati 72 orë
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {urgentBreaches.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">
                      Asnjë incident në pritje të njoftimit
                    </p>
                  ) : (
                    urgentBreaches.map((b) => {
                      const hoursLeft = breachDeadline(b);
                      return (
                        <Link
                          key={b.id}
                          href={getHref('/app/dpo/breaches')}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{b.title}</p>
                            <p className="text-xs text-gray-500">
                              Zbuluar: {new Date(b.discoveredAt).toLocaleString('sq-AL')}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              hoursLeft < 0
                                ? 'bg-red-100 text-red-700'
                                : hoursLeft < 24
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {hoursLeft < 0
                              ? `${Math.abs(hoursLeft)} orë vonesë`
                              : `${hoursLeft} orë të mbetura`}
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              {/* DSAR deadlines */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                  <ClockIcon className="h-5 w-5 text-amber-500" />
                  <h2 className="font-semibold text-gray-900">
                    Kërkesa DSAR — afate të afërta
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {urgentDsars.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">
                      Asnjë kërkesë me afat të afërt
                    </p>
                  ) : (
                    urgentDsars.map((d) => {
                      const daysLeft = dsarDaysLeft(d);
                      return (
                        <Link
                          key={d.id}
                          href={getHref('/app/dpo/dsar')}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {d.subjectName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dsarTypeLabels[d.type] || d.type} · Afati:{' '}
                              {new Date(d.dueDate).toLocaleDateString('sq-AL')}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              daysLeft < 0
                                ? 'bg-red-100 text-red-700'
                                : daysLeft <= 3
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {daysLeft < 0
                              ? `${Math.abs(daysLeft)} ditë vonesë`
                              : `${daysLeft} ditë të mbetura`}
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="h-6 w-6 flex-shrink-0 text-blue-600" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Detyrimet kryesore të DPO-së</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-blue-800">
                    <li>Mbajtja e Regjistrit të Aktiviteteve të Përpunimit (RoPA)</li>
                    <li>
                      Njoftimi i Komisionerit brenda 72 orëve për incidente sigurie
                    </li>
                    <li>
                      Përgjigje ndaj kërkesave të subjekteve brenda 30 ditëve (DSAR)
                    </li>
                    <li>
                      Vlerësimi i ndikimit (DPIA) për përpunime me rrezik të lartë
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
