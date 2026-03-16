"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
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
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={getLocalizedPath(locale, "home")} className="flex flex-col">
            <span className="text-xl lg:text-2xl font-bold text-navy">
              OnLaw Office
            </span>
            <span className="text-xs text-gray-500 hidden sm:block">
              {OFFICE.full}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-navy bg-navy-50"
                    : "text-dark hover:text-navy hover:bg-navy-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={contactHref}
              className="ml-4 px-5 py-2.5 bg-navy text-white text-sm font-medium rounded-md hover:bg-navy-600 transition-colors"
            >
              {dict.nav.contactCta}
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
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-base font-medium rounded-md ${
                  pathname === link.href
                    ? "text-navy bg-navy-50"
                    : "text-dark hover:text-navy hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={contactHref}
                className="block text-center px-4 py-3 bg-navy text-white font-medium rounded-md"
              >
                {dict.nav.contactCta}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
