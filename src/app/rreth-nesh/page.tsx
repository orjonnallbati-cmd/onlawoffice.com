import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import CTABanner from "@/components/home/CTABanner";
import { OFFICE } from "@/lib/constants";
import {
  ShieldCheckIcon,
  HandRaisedIcon,
  TrophyIcon,
  AcademicCapIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Rreth Nesh",
  description:
    "Mësoni më shumë rreth OnLaw Office dhe Av. Orjon Nallbati — studio ligjore profesionale në Tiranë.",
};

export default function RrethNeshPage() {
  return (
    <>
      <PageHeader
        title="Rreth Nesh"
        subtitle="Studio Ligjore profesionale me përkushtim ndaj drejtësisë"
      />

      {/* Firm Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
              {OFFICE.name}
            </h2>
            <p className="text-gold font-medium mb-6">{OFFICE.full}</p>
            <GoldDivider short className="mb-8" />
            <p className="text-gray-600 leading-relaxed mb-6">
              {OFFICE.name} është studio ligjore e themeluar me qëllim ofrimin e
              shërbimeve juridike profesionale të standardit më të lartë. E
              angazhuar në përfaqësimin e klientëve në çdo nivel të sistemit
              gjyqësor shqiptar, zyra jonë kombinon njohuritë akademike me
              përvojën praktike.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Jemi të specializuar në fushën e së drejtës civile, tregtare,
              administrative dhe kushtetuese, si edhe në fushën e mbrojtjes së të
              dhënave personale dhe përputhshmërisë me legjislacionin GDPR.
            </p>
          </div>
        </Container>
      </section>

      {/* Lawyer Profile */}
      <section className="py-16 lg:py-24 bg-alt">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Photo placeholder */}
                <div className="shrink-0">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 bg-navy-50 rounded-xl flex items-center justify-center mx-auto lg:mx-0">
                    <AcademicCapIcon className="w-16 h-16 text-navy/30" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-navy mb-1">
                    {OFFICE.lawyer}
                  </h2>
                  <p className="text-gold font-medium mb-4">
                    Themelues & Drejtor i {OFFICE.name}
                  </p>
                  <GoldDivider short className="!mx-0 mb-4" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      {
                        icon: BriefcaseIcon,
                        label: `Liçensë: ${OFFICE.license}`,
                      },
                      {
                        icon: MapPinIcon,
                        label: OFFICE.chamber,
                      },
                      {
                        icon: AcademicCapIcon,
                        label: `NUIS: ${OFFICE.nuis}`,
                      },
                      {
                        icon: MapPinIcon,
                        label: OFFICE.city,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <item.icon className="w-4 h-4 text-gold shrink-0" />
                        {item.label}
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    Av. Orjon Nallbati ka përvojë të gjerë në përfaqësimin e
                    klientëve para të gjitha niveleve të gjykatave shqiptare,
                    përfshirë Gjykatën e Lartë dhe Gjykatën Kushtetuese. I
                    specializuar në çështje civile komplekse, kontrata tregtare
                    ndërkombëtare, dhe mbrojtjen e të dhënave personale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
              Vlerat Tona
            </h2>
            <GoldDivider short />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Profesionalizëm",
                desc: "Çdo çështje trajtohet me kujdesin maksimal, njohuri të thella ligjore dhe standardet më të larta etike.",
              },
              {
                icon: HandRaisedIcon,
                title: "Integritet",
                desc: "Transparenca dhe ndershmëria janë baza e marrëdhënies tonë me klientët. Besimi ndërtohet me vepra.",
              },
              {
                icon: TrophyIcon,
                title: "Rezultate",
                desc: "Jemi të orientuar drejt arritjes së rezultatit më të mirë për klientët tanë, me strategji efektive.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
