import Link from "next/link";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import { OFFICE } from "@/lib/constants";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function AboutPreview() {
  return (
    <section className="py-16 lg:py-24 bg-alt">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              Rreth Nesh
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
              Përvojë dhe Profesionalizëm në Shërbim të Drejtësisë
            </h2>
            <GoldDivider short className="!mx-0 mb-6" />
            <p className="text-gray-600 leading-relaxed mb-6">
              {OFFICE.name} është studio ligjore e themeluar nga {OFFICE.lawyer},
              anëtar i {OFFICE.chamber}. Me përvojë të gjerë në fushat e së
              drejtës civile, tregtare, administrative, kushtetuese, si dhe në
              mbrojtjen e të dhënave personale, zyra jonë ofron shërbime juridike
              të standardit më të lartë.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Besojmë se çdo klient meriton përfaqësim cilësor, strategji të
              personalizuar dhe përkushtim profesional për arritjen e rezultatit
              më të mirë të mundshëm.
            </p>
            <Link
              href="/rreth-nesh"
              className="inline-flex items-center text-navy font-semibold hover:text-gold transition-colors"
            >
              Lexo Më Shumë
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Stats / Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: BriefcaseIcon,
                title: "Përvojë e Gjerë",
                desc: "Përfaqësim profesional në të gjitha nivelet e gjykatave shqiptare",
              },
              {
                icon: AcademicCapIcon,
                title: "Ekspertizë e Thelluar",
                desc: "Specializim në fusha specifike të së drejtës civile dhe tregtare",
              },
              {
                icon: UserGroupIcon,
                title: "Qasje Personale",
                desc: "Strategji e personalizuar për çdo çështje dhe klient",
              },
              {
                icon: AcademicCapIcon,
                title: "Standardet Ndërkombëtare",
                desc: "Përputhshmëri me GJEDNJ, GDPR dhe praktikat më të mira",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <item.icon className="w-8 h-8 text-gold mb-3" />
                <h3 className="font-bold text-navy text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
