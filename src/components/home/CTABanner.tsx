import Link from "next/link";
import Container from "@/components/ui/Container";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { PhoneIcon } from "@heroicons/react/24/outline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CTABanner({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const cta = dict.cta;

  return (
    <section className="bg-navy py-16 lg:py-20">
      <Container className="text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
          {cta.title}
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          {cta.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={getLocalizedPath(locale, "contact")}
            className="px-8 py-3.5 bg-gold text-navy font-semibold rounded-md hover:bg-gold-300 transition-colors"
          >
            {cta.button}
          </Link>
          <a
            href={`tel:${OFFICE.phone}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
          >
            <PhoneIcon className="w-5 h-5" />
            {OFFICE.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
