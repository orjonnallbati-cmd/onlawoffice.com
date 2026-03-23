'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

// Demo events
const demoEvents = [
  {
    id: '1',
    title: 'Seancë - Hoxha vs. Bashkia Tiranë',
    date: '2026-03-25',
    time: '10:00',
    endTime: '12:00',
    type: 'HEARING',
    location: 'Gjykata e Rrethit Gjyqësor Tiranë, Salla 4',
    caseNumber: 'CIV-2026-0142',
  },
  {
    id: '2',
    title: 'Takim me Fatmir Kaci',
    date: '2026-03-26',
    time: '14:30',
    endTime: '15:30',
    type: 'MEETING',
    location: 'OnLaw Office',
    caseNumber: 'ADM-2026-0088',
  },
  {
    id: '3',
    title: 'Afat - Dorëzim ankimim Gjykata e Apelit',
    date: '2026-03-28',
    time: '16:00',
    endTime: null,
    type: 'DEADLINE',
    location: null,
    caseNumber: 'CIV-2026-0142',
  },
  {
    id: '4',
    title: 'Seancë - Çështja Nexhipi vs. XYZ Shpk',
    date: '2026-04-02',
    time: '09:30',
    endTime: '11:00',
    type: 'HEARING',
    location: 'Gjykata e Rrethit Gjyqësor Tiranë, Salla 2',
    caseNumber: 'LAB-2026-0034',
  },
  {
    id: '5',
    title: 'Konsultë - Klient i ri potencial',
    date: '2026-03-27',
    time: '11:00',
    endTime: '11:45',
    type: 'CONSULTATION',
    location: 'OnLaw Office',
    caseNumber: null,
  },
  {
    id: '6',
    title: 'Afat - Dorëzim dokumentash ASHK',
    date: '2026-03-30',
    time: '12:00',
    endTime: null,
    type: 'FILING',
    location: 'ASHK Tiranë',
    caseNumber: 'ADM-2026-0088',
  },
];

const eventTypeStyles: Record<string, { bg: string; text: string; label: string }> = {
  HEARING: { bg: 'bg-red-100 border-red-300', text: 'text-red-700', label: 'Seancë' },
  MEETING: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-700', label: 'Takim' },
  DEADLINE: { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-700', label: 'Afat' },
  CONSULTATION: { bg: 'bg-green-100 border-green-300', text: 'text-green-700', label: 'Konsultë' },
  FILING: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-700', label: 'Dorëzim' },
  OTHER: { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-700', label: 'Tjetër' },
};

const dayNames = ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'];
const monthNames = [
  'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
  'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor',
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 23)); // March 2026
  const [view, setView] = useState<'month' | 'list'>('list');

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

  // Sort events by date
  const sortedEvents = [...demoEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group events by date
  const eventsByDate: Record<string, typeof demoEvents> = {};
  sortedEvents.forEach((event) => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  return (
    <div>
      <AppHeader
        title="Kalendari"
        subtitle={`${monthNames[currentMonth]} ${currentYear}`}
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <h2 className="min-w-[180px] text-center text-lg font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-gray-300">
              <button
                onClick={() => setView('list')}
                className={`rounded-l-lg px-3 py-1.5 text-sm ${
                  view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Listë
              </button>
              <button
                onClick={() => setView('month')}
                className={`rounded-r-lg px-3 py-1.5 text-sm ${
                  view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Muaj
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <PlusIcon className="h-4 w-4" />
              Ngjarje e re
            </button>
          </div>
        </div>

        {view === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {Object.entries(eventsByDate).map(([date, events]) => {
              const d = new Date(date);
              const dayOfWeek = dayNames[(d.getDay() + 6) % 7]; // Monday = 0
              const isToday = date === '2026-03-23';

              return (
                <div key={date}>
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl ${
                        isToday ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="text-xs font-medium">{dayOfWeek}</span>
                      <span className="text-lg font-bold">{d.getDate()}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {d.getDate()} {monthNames[d.getMonth()]} {d.getFullYear()}
                      {isToday && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Sot
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-6">
                    {events.map((event) => {
                      const style = eventTypeStyles[event.type] || eventTypeStyles.OTHER;
                      return (
                        <div
                          key={event.id}
                          className={`rounded-lg border p-4 ${style.bg}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className={`text-xs font-medium ${style.text}`}>
                                {style.label}
                              </span>
                              <h4 className="mt-1 font-medium text-gray-900">
                                {event.title}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span>
                                  {event.time}
                                  {event.endTime && ` - ${event.endTime}`}
                                </span>
                                {event.location && (
                                  <>
                                    <span>·</span>
                                    <span>{event.location}</span>
                                  </>
                                )}
                                {event.caseNumber && (
                                  <>
                                    <span>·</span>
                                    <span className="text-blue-600">{event.caseNumber}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {Object.keys(eventsByDate).length === 0 && (
              <div className="py-16 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">Nuk ka ngjarje për këtë periudhë</p>
              </div>
            )}
          </div>
        ) : (
          /* Month View - Simple Grid */
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-7 border-b border-gray-200">
              {dayNames.map((day) => (
                <div key={day} className="px-2 py-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: 35 }, (_, i) => {
                const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
                const offset = (firstDayOfMonth + 6) % 7;
                const day = i - offset + 1;
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                const isValid = day >= 1 && day <= daysInMonth;
                const dateStr = isValid
                  ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : '';
                const dayEvents = isValid ? (eventsByDate[dateStr] || []) : [];
                const isToday = dateStr === '2026-03-23';

                return (
                  <div
                    key={i}
                    className={`min-h-[80px] border-b border-r border-gray-100 p-1 ${
                      !isValid ? 'bg-gray-50' : ''
                    }`}
                  >
                    {isValid && (
                      <>
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                            isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                          }`}
                        >
                          {day}
                        </span>
                        {dayEvents.map((event) => {
                          const style = eventTypeStyles[event.type] || eventTypeStyles.OTHER;
                          return (
                            <div
                              key={event.id}
                              className={`mt-0.5 truncate rounded px-1 py-0.5 text-xs ${style.bg} ${style.text}`}
                            >
                              {event.time} {event.title.substring(0, 20)}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
