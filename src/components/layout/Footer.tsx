import Link from "next/link";
import Logo from "./Logo";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const LABEL = "text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-5";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ locale, dict }: { locale: Locale; dict: Record<string, any> }) {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: getLocalizedPath(locale, "home"), label: dict.nav.home },
    { href: getLocalizedPath(locale, "services"), label: dict.nav.services },
    { href: getLocalizedPath(locale, "about"), label: dict.nav.about },
    { href: getLocalizedPath(locale, "blog"), label: dict.nav.blog },
    { href: getLocalizedPath(locale, "contact"), label: dict.nav.contact },
  ];

  const copyright = dict.footer.copyright
    .replace("{year}", String(currentYear))
    .replace("{name}", OFFICE.name);

  return (
    <footer className="bg-navy text-white">
      {/* Vija jeshile — e njëjta që mbyll kokën e letrës zyrtare */}
      <div className="h-0.5 bg-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Stema + përshkrimi */}
          <div className="lg:col-span-5">
            <Logo variant="stacked" green="#2E9E6F" className="h-32 w-auto text-white" />
            <p className="mt-8 text-gray-300 text-sm leading-relaxed max-w-sm">
              {dict.footer.description}
            </p>
          </div>

          {/* Lidhjet */}
          <div className="lg:col-span-3">
            <p className={LABEL}>{dict.footer.quickLinks}</p>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontakti */}
          <div className="lg:col-span-4">
            <p className={LABEL}>{dict.footer.contact}</p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-4 h-4 text-gold-300 shrink-0 mt-0.5" />
                <span className="text-gray-300">{OFFICE.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-gold-300 shrink-0" />
                <a href={`tel:${OFFICE.phone}`} className="text-gray-300 hover:text-white transition-colors">
                  {OFFICE.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-4 h-4 text-gold-300 shrink-0" />
                <a href={`mailto:${OFFICE.email}`} className="text-gray-300 hover:text-white transition-colors">
                  {OFFICE.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shiriti i poshtëm */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <p>{copyright}</p>
            <div className="flex items-center gap-3">
              <Link href={getLocalizedPath(locale, "privacy")} className="hover:text-white transition-colors">
                {dict.footer.privacyLink}
              </Link>
              <span aria-hidden="true">·</span>
              <p>
                NUIS {OFFICE.nuis} · Lic. {OFFICE.license}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
