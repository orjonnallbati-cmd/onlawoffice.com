import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import CTABanner from "@/components/home/CTABanner";
import { SERVICES } from "@/lib/constants";
import {
  ScaleIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Shërbimet Juridike",
  description:
    "Shërbime juridike profesionale: e drejta civile, tregtare, administrative, kushtetuese, mbrojtja e të dhënave dhe hartim kontratash.",
};

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  civile: ScaleIcon,
  tregtare: BuildingOffice2Icon,
  administrative: DocumentTextIcon,
  kushtetuese: ShieldCheckIcon,
  gdpr: LockClosedIcon,
  kontrata: PencilSquareIcon,
};

export default function SherbimePage() {
  return (
    <>
      <PageHeader
        title="Shërbimet Juridike"
        subtitle="Ofrojmë asistencë ligjore të plotë në gjashtë fusha kryesore të praktikës"
      />

      <div className="py-16 lg:py-24">
        {SERVICES.map((service, idx) => {
          const Icon = ICONS[service.id];
          const isAlt = idx % 2 === 1;
          return (
            <section
              key={service.id}
              id={service.id}
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
                    {service.details.map((detail) => (
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

      <CTABanner />
    </>
  );
}
