import Link from "next/link";
import Container from "@/components/ui/Container";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CTABanner({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const cta = dict.cta;

  return (
    <section className="bg-navy py-16 lg:py-20">
      <Container className="text-center">
        <div className="gold-divider-short mb-8" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4">
          {cta.title}
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          {cta.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href={getLocalizedPath(locale, "contact")}
            className="px-8 py-3.5 bg-white text-navy font-semibold hover:bg-gray-100 transition-colors"
          >
            {cta.button}
          </Link>
          <a
            href={`tel:${OFFICE.phone}`}
            className="text-white font-medium border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            {OFFICE.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
