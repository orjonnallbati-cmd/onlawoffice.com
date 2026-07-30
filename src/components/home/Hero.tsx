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
    <section className="relative bg-navy pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Ghost monogram watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <span className="font-display font-bold text-[22rem] leading-none text-white/[0.04]">
          ON
        </span>
      </div>

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="flex items-center gap-4 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-gray-400 mb-8">
            <span className="inline-block w-10 h-px bg-gold-300" aria-hidden="true" />
            {h.badge}
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.05]">
            {OFFICE.lawyer}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
            {h.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <Link
              href={getLocalizedPath(locale, "contact")}
              className="inline-flex justify-center px-8 py-4 bg-gold text-white font-semibold hover:bg-gold-500 transition-colors text-base"
            >
              {h.ctaPrimary}
            </Link>
            <Link
              href={getLocalizedPath(locale, "services")}
              className="inline-flex items-center gap-2 text-white font-medium border-b border-gold-300 pb-1 hover:text-gold-300 transition-colors text-base w-fit"
            >
              {h.ctaSecondary}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-6">
            <Link
              href={locale === "sq" ? "/app/login" : `/${locale}/app/login`}
              className="text-sm text-gray-500 hover:text-gold-300 transition-colors"
            >
              {dict.nav.appCta || "Hyr në Platformë"} →
            </Link>
          </div>
        </div>

        {/* Practice areas line */}
        <div className="mt-16 border-t border-white/10 pt-6">
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-[0.15em]">
            {practiceAreas.join("   /   ")}
          </p>
        </div>
      </Container>
    </section>
  );
}
