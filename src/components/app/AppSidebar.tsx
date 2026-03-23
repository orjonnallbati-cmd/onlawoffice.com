'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  ScaleIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
  { name: 'Çështjet', href: '/app/cases', icon: BriefcaseIcon },
  { name: 'Klientët', href: '/app/clients', icon: UsersIcon },
  { name: 'Kalendari', href: '/app/calendar', icon: CalendarIcon },
  { name: 'Vendime Gjyqësore', href: '/app/vendime', icon: ScaleIcon },
  { name: 'Dokumente', href: '/app/documents', icon: DocumentTextIcon },
];

export default function AppSidebar() {
  const pathname = usePathname();

  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = ['en', 'it', 'sq'].includes(segments[1]) ? segments[1] : 'sq';

  function getHref(href: string) {
    return locale === 'sq' ? href : `/${locale}${href}`;
  }

  function isActive(href: string) {
    const fullHref = getHref(href);
    return pathname === fullHref || pathname.startsWith(fullHref + '/');
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href={getHref('/')} className="flex items-center gap-2">
          <ScaleIcon className="h-8 w-8 text-amber-600" />
          <div>
            <span className="text-lg font-bold text-gray-900">OnLaw</span>
            <span className="block text-xs text-gray-500">Legal Management</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1 px-3">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={getHref(item.href)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3">
        <Link
          href={getHref('/app/settings')}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
          Cilësimet
        </Link>
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
          onClick={() => {
            // Will be connected to signOut
            window.location.href = '/api/auth/signout';
          }}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Dil
        </button>
      </div>
    </aside>
  );
}
