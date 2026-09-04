"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ locale, dict }: { locale: Locale; dict: Record<string, any> }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: getLocalizedPath(locale, "home"), label: dict.nav.home },
    { href: getLocalizedPath(locale, "services"), label: dict.nav.services },
    { href: getLocalizedPath(locale, "about"), label: dict.nav.about },
    { href: getLocalizedPath(locale, "blog"), label: dict.nav.blog },
    { href: getLocalizedPath(locale, "contact"), label: dict.nav.contact },
  ];

  const contactHref = getLocalizedPath(locale, "contact");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-light/95 backdrop-blur-sm shadow-sm"
          : "bg-light"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={getLocalizedPath(locale, "home")}
            className="text-navy leading-none"
            aria-label={OFFICE.name}
          >
            <Logo className="block h-9 w-auto lg:h-11" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-navy underline decoration-gold decoration-2 underline-offset-8"
                    : "text-gray-500 hover:text-navy"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={contactHref}
              className="ml-4 px-5 py-3 bg-navy text-white text-xs font-semibold uppercase tracking-[0.14em] hover:bg-navy-700 transition-colors"
            >
              {dict.nav.contactCta}
            </Link>
            <Link
              href={locale === "sq" ? "/app/login" : `/${locale}/app/login`}
              className="ml-2 px-5 py-3 border border-navy text-navy text-xs font-semibold uppercase tracking-[0.14em] hover:bg-navy hover:text-white transition-colors"
            >
              {dict.nav.appCta}
            </Link>
            <div className="ml-3">
              <LanguageSwitcher locale={locale} />
            </div>
          </nav>

          {/* Mobile: language + menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-navy"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-0.5 bg-gold" />

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-light border-t border-gray-200">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-base font-medium ${
                  pathname === link.href
                    ? "text-navy bg-navy-50"
                    : "text-gray-600 hover:text-navy hover:bg-navy-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Link
                href={contactHref}
                className="block text-center px-4 py-3.5 bg-navy text-white text-xs font-semibold uppercase tracking-[0.14em]"
              >
                {dict.nav.contactCta}
              </Link>
              <Link
                href={locale === "sq" ? "/app/login" : `/${locale}/app/login`}
                className="block text-center px-4 py-3.5 border border-navy text-navy text-xs font-semibold uppercase tracking-[0.14em]"
              >
                {dict.nav.appCta}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
