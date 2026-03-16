import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import CTABanner from "@/components/home/CTABanner";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import {
  ScaleIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.metadata.services.title,
    description: dict.metadata.services.description,
  };
}

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  civile: ScaleIcon,
  tregtare: BuildingOffice2Icon,
  administrative: DocumentTextIcon,
  kushtetuese: ShieldCheckIcon,
  gdpr: LockClosedIcon,
  kontrata: PencilSquareIcon,
};

const SERVICE_IDS = ["civile", "tregtare", "administrative", "kushtetuese", "gdpr", "kontrata"] as const;

export default async function SherbimePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader
        title={dict.servicesPage.title}
        subtitle={dict.servicesPage.subtitle}
      />

      <div className="py-16 lg:py-24">
        {SERVICE_IDS.map((serviceId, idx) => {
          const Icon = ICONS[serviceId];
          const service = dict.services[serviceId];
          const isAlt = idx % 2 === 1;
          return (
            <section
              key={serviceId}
              id={serviceId}
              className={`py-12 lg:py-16 ${isAlt ? "bg-alt" : "bg-white"}`}
            >
              <Container>
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    {Icon && (
                      <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                    )}
                    <h2 className="text-2xl lg:text-3xl font-bold text-navy">
                      {service.title}
                    </h2>
                  </div>
                  <GoldDivider short className="!mx-0 mb-6" />
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.details.map((detail: string) => (
                      <li
                        key={detail}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-gold shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <CTABanner dict={dict} locale={lang} />
    </>
  );
}
