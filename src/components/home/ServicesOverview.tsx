import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const SERVICE_IDS = ["civile", "tregtare", "administrative", "kushtetuese", "gdpr", "kontrata"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ServicesOverview({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const servicesPath = getLocalizedPath(locale, "services");

  return (
    <section className="py-16 lg:py-24 bg-light">
      <Container>
        <SectionHeading
          title={dict.servicesOverview.title}
          subtitle={dict.servicesOverview.subtitle}
        />

        {/* Typographic index of practice areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 max-w-5xl mx-auto">
          {SERVICE_IDS.map((serviceId, index) => {
            const service = dict.services[serviceId];
            const number = String(index + 1).padStart(2, "0");
            return (
              <Link
                key={serviceId}
                href={`${servicesPath}#${serviceId}`}
                className="group flex gap-6 border-t border-gray-200 py-7"
              >
                <span className="font-display text-gold text-lg leading-snug w-8 shrink-0">
                  {number}
                </span>
                <div>
                  <h3 className="text-2xl text-navy group-hover:text-gold transition-colors flex items-center gap-2">
                    {service.title}
                    <span
                      aria-hidden="true"
                      className="text-gold opacity-0 group-hover:opacity-100 transition-opacity text-base"
                    >
                      →
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
