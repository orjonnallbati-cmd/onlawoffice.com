import Link from "next/link";
import Container from "@/components/ui/Container";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Hero({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const h = dict.hero;
  const practiceAreas = Object.values(h.features as Record<string, string>);
  const appHref = locale === "sq" ? "/app/login" : `/${locale}/app/login`;

  return (
    <section className="relative bg-navy pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
      {/* Filigranë "ON" — jehonë e stemës */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <span className="font-display text-[26rem] leading-none text-white/[0.035]">ON</span>
      </div>

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-300 mb-10">
            <span className="inline-block w-10 h-px bg-gold-300" aria-hidden="true" />
            {h.badge}
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] text-white leading-[1.02]">
            {OFFICE.lawyer}
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
            {h.description}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href={getLocalizedPath(locale, "contact")}
              className="inline-flex justify-center px-8 py-4 bg-white text-navy text-xs font-semibold uppercase tracking-[0.16em] hover:bg-gray-200 transition-colors"
            >
              {h.ctaPrimary}
            </Link>
            <Link
              href={getLocalizedPath(locale, "services")}
              className="inline-flex justify-center px-8 py-4 border border-white/40 text-white text-xs font-semibold uppercase tracking-[0.16em] hover:border-white transition-colors"
            >
              {h.ctaSecondary}
            </Link>
          </div>

          <div className="mt-8">
            <Link href={appHref} className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
              {dict.nav.appCta} →
            </Link>
          </div>
        </div>

        {/* Fushat e praktikës */}
        <ul className="mt-20 border-t border-white/10 pt-6 flex flex-wrap gap-y-2 text-xs uppercase tracking-[0.2em] text-gray-400">
          {practiceAreas.map((area, i) => (
            <li key={area} className="flex items-center">
              {i > 0 && (
                <span aria-hidden="true" className="mx-6 text-white/20">
                  /
                </span>
              )}
              {area}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
