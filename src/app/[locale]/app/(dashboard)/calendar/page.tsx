'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import AppHeader from '@/components/app/AppHeader';

interface EventData {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  eventType: string;
  location: string | null;
  case: { id: string; title: string; caseNumber: string } | null;
}

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('list');
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    startTime: '09:00',
    endTime: '',
    eventType: 'MEETING',
    location: '',
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const fetchEvents = useCallback(async () => {
    try {
      const from = new Date(currentYear, currentMonth, 1).toISOString();
      const to = new Date(currentYear, currentMonth + 2, 0).toISOString();
      const res = await fetch(`/api/events?from=${from}&to=${to}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [fetchEvents]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDate = new Date(`${newEvent.startDate}T${newEvent.startTime || '09:00'}`);
      const endDate = newEvent.endTime ? new Date(`${newEvent.startDate}T${newEvent.endTime}`) : null;

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title,
          startDate: startDate.toISOString(),
          endDate: endDate?.toISOString() || null,
          eventType: newEvent.eventType,
          location: newEvent.location || null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setNewEvent({ title: '', startDate: '', startTime: '09:00', endTime: '', eventType: 'MEETING', location: '' });
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Jeni të sigurt që dëshironi të fshini "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Sort and group events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const eventsByDate: Record<string, EventData[]> = {};
  sortedEvents.forEach((event) => {
    const dateKey = new Date(event.startDate).toISOString().split('T')[0];
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  const todayStr = new Date().toISOString().split('T')[0];

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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              Ngjarje e re
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Duke ngarkuar ngjarjet...</div>
        ) : view === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {Object.keys(eventsByDate).length === 0 ? (
              <div className="py-16 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">Nuk ka ngjarje për këtë periudhë</p>
                <p className="mt-1 text-sm text-gray-400">Klikoni &quot;Ngjarje e re&quot; për të shtuar një ngjarje</p>
              </div>
            ) : (
              Object.entries(eventsByDate).map(([date, dayEvents]) => {
                const d = new Date(date + 'T12:00:00');
                const dayOfWeek = dayNames[(d.getDay() + 6) % 7];
                const isToday = date === todayStr;

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
                      {dayEvents.map((event) => {
                        const style = eventTypeStyles[event.eventType] || eventTypeStyles.OTHER;
                        const startTime = new Date(event.startDate).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' });
                        const endTime = event.endDate
                          ? new Date(event.endDate).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })
                          : null;

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
                                    {startTime}
                                    {endTime && ` - ${endTime}`}
                                  </span>
                                  {event.location && (
                                    <>
                                      <span>·</span>
                                      <span>{event.location}</span>
                                    </>
                                  )}
                                  {event.case && (
                                    <>
                                      <span>·</span>
                                      <span className="text-blue-600">{event.case.caseNumber}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteEvent(event.id, event.title)}
                                className="rounded-lg p-1.5 hover:bg-white/50"
                                title="Fshi ngjarjen"
                              >
                                <TrashIcon className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Month View */
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
                const isToday = dateStr === todayStr;

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
                          const style = eventTypeStyles[event.eventType] || eventTypeStyles.OTHER;
                          const time = new Date(event.startDate).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div
                              key={event.id}
                              className={`mt-0.5 truncate rounded px-1 py-0.5 text-xs ${style.bg} ${style.text}`}
                            >
                              {time} {event.title.substring(0, 20)}
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

      {/* New Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Ngjarje e re</h2>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Titulli *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="p.sh. Seancë gjyqësore, Takim me klient..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Data *</label>
                  <input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Ora fillimit</label>
                  <div className="flex gap-1">
                    <select
                      value={newEvent.startTime.split(':')[0] || '09'}
                      onChange={(e) => {
                        const mins = newEvent.startTime.split(':')[1] || '00';
                        setNewEvent({ ...newEvent, startTime: `${e.target.value}:${mins}` });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="flex items-center text-gray-500">:</span>
                    <select
                      value={newEvent.startTime.split(':')[1] || '00'}
                      onChange={(e) => {
                        const hrs = newEvent.startTime.split(':')[0] || '09';
                        setNewEvent({ ...newEvent, startTime: `${hrs}:${e.target.value}` });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {['00', '15', '30', '45'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Ora mbarimit</label>
                  <div className="flex gap-1">
                    <select
                      value={newEvent.endTime.split(':')[0] || '10'}
                      onChange={(e) => {
                        const mins = newEvent.endTime.split(':')[1] || '00';
                        setNewEvent({ ...newEvent, endTime: `${e.target.value}:${mins}` });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">—</option>
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="flex items-center text-gray-500">:</span>
                    <select
                      value={newEvent.endTime.split(':')[1] || '00'}
                      onChange={(e) => {
                        const hrs = newEvent.endTime.split(':')[0] || '';
                        if (hrs) setNewEvent({ ...newEvent, endTime: `${hrs}:${e.target.value}` });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {['00', '15', '30', '45'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Lloji</label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="HEARING">Seancë</option>
                    <option value="MEETING">Takim</option>
                    <option value="DEADLINE">Afat</option>
                    <option value="CONSULTATION">Konsultë</option>
                    <option value="FILING">Dorëzim</option>
                    <option value="OTHER">Tjetër</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Vendndodhja</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="p.sh. Gjykata Tiranë, Salla 4"
                  />
                </div>
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
                  Ruaj ngjarjen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
