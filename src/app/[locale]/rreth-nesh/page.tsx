import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import CTABanner from "@/components/home/CTABanner";
import { OFFICE } from "@/lib/constants";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import {
  ShieldCheckIcon,
  HandRaisedIcon,
  TrophyIcon,
  AcademicCapIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.metadata.about.title,
    description: dict.metadata.about.description,
  };
}

export default async function RrethNeshPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);
  const ap = dict.aboutPage;

  const firmDesc1 = ap.firmOverview.description1
    .replace("{name}", OFFICE.name)
    .replace("{name}", OFFICE.name);
  const firmDesc2 = ap.firmOverview.description2;
  const founderTitle = ap.lawyerProfile.founderTitle.replace("{name}", OFFICE.name);
  const licLabel = ap.lawyerProfile.licenseLabel.replace("{license}", OFFICE.license);
  const nuisLabel = ap.lawyerProfile.nuisLabel.replace("{nuis}", OFFICE.nuis);

  const values = [
    { icon: ShieldCheckIcon, ...ap.values.professionalism },
    { icon: HandRaisedIcon, ...ap.values.integrity },
    { icon: TrophyIcon, ...ap.values.results },
  ];

  return (
    <>
      <PageHeader title={ap.title} subtitle={ap.subtitle} />

      {/* Firm Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
              {OFFICE.name}
            </h2>
            <p className="text-gold font-medium mb-6">{OFFICE.full}</p>
            <GoldDivider short className="mb-8" />
            <p className="text-gray-600 leading-relaxed mb-6">{firmDesc1}</p>
            <p className="text-gray-600 leading-relaxed">{firmDesc2}</p>
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
                  <p className="text-gold font-medium mb-4">{founderTitle}</p>
                  <GoldDivider short className="!mx-0 mb-4" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: BriefcaseIcon, label: licLabel },
                      { icon: MapPinIcon, label: OFFICE.chamber },
                      { icon: AcademicCapIcon, label: nuisLabel },
                      { icon: MapPinIcon, label: OFFICE.city },
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
                    {ap.lawyerProfile.bio}
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
              {ap.values.title}
            </h2>
            <GoldDivider short />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner dict={dict} locale={lang} />
    </>
  );
}
