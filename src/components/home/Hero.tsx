import Link from "next/link";
import Container from "@/components/ui/Container";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Hero({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const h = dict.hero;
  const practiceAreas = Object.values(h.features as Record<string, string>);

  return (
    <section className="relative bg-navy pt-28 pb-16 lg:pt-40 lg:pb-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial text block */}
          <div className="lg:col-span-8">
            <p className="flex items-center gap-4 text-gold text-xs sm:text-sm font-medium uppercase tracking-[0.2em] mb-8">
              <span className="inline-block w-10 h-px bg-gold" aria-hidden="true" />
              {h.badge}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1]">
              {OFFICE.lawyer}
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
              {h.description}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <Link
                href={getLocalizedPath(locale, "contact")}
                className="inline-flex justify-center px-8 py-3.5 bg-white text-navy font-semibold hover:bg-gray-100 transition-colors text-base"
              >
                {h.ctaPrimary}
              </Link>
              <Link
                href={getLocalizedPath(locale, "services")}
                className="inline-flex items-center gap-2 text-white font-medium border-b border-gold pb-1 hover:text-gold transition-colors text-base w-fit"
              >
                {h.ctaSecondary}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-6">
              <Link
                href={locale === "sq" ? "/app/login" : `/${locale}/app/login`}
                className="text-sm text-gray-400 hover:text-gold transition-colors"
              >
                {dict.nav.appCta || "Hyr në Platformë"} →
              </Link>
            </div>
          </div>

          {/* Monogram */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <div className="border border-white/15 p-3">
              <div className="border border-gold/40 px-12 py-14 text-center">
                <span className="font-serif text-8xl text-gold leading-none">
                  ON
                </span>
                <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-gray-400 leading-relaxed">
                  {OFFICE.full}
                  <br />
                  {OFFICE.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Practice areas line */}
        <div className="mt-16 border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400 tracking-wide">
            {practiceAreas.join("  ·  ")}
          </p>
        </div>
      </Container>
    </section>
  );
}
