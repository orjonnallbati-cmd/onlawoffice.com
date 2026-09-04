import Link from "next/link";
import Container from "@/components/ui/Container";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CTABanner({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const cta = dict.cta;

  return (
    <section className="bg-navy py-20 lg:py-28">
      <Container className="max-w-3xl text-center">
        <div className="gold-divider-short mb-10" />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
          {cta.title}
        </h2>
        <p className="mt-6 text-lg text-gray-300">{cta.description}</p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <Link
            href={getLocalizedPath(locale, "contact")}
            className="inline-flex justify-center px-8 py-4 bg-white text-navy text-xs font-semibold uppercase tracking-[0.16em] hover:bg-gray-200 transition-colors"
          >
            {cta.button}
          </Link>
          <a
            href={`tel:${OFFICE.phone}`}
            className="text-white font-medium border-b border-gold-300 pb-1 hover:text-gold-300 transition-colors"
          >
            {OFFICE.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
