import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";
import {
  ScaleIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  civile: ScaleIcon,
  tregtare: BuildingOffice2Icon,
  administrative: DocumentTextIcon,
  kushtetuese: ShieldCheckIcon,
  gdpr: LockClosedIcon,
  kontrata: PencilSquareIcon,
};

export default function ServicesOverview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <Container>
        <SectionHeading
          title="Fushat e Praktikës"
          subtitle="Ofrojmë shërbime juridike të specializuara në gjashtë fusha kryesore"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.id];
            return (
              <Link
                key={service.id}
                href={`/sherbime#${service.id}`}
                className="group p-6 lg:p-8 rounded-lg border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-50 transition-colors">
                  {Icon && (
                    <Icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
