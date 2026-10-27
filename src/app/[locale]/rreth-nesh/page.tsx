import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import CTABanner from "@/components/home/CTABanner";
import { OFFICE } from "@/lib/constants";
import { PERSON_ID, PROFILES, SITE, personJsonLd } from "@/lib/entity";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { getLocalizedPath } from "@/lib/i18n";
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
  const lang = locale as Locale;
  const dict = await getDictionary(lang);
  return buildPageMetadata({
    locale: lang,
    routeKey: "about",
    title: dict.metadata.about.title,
    description: dict.metadata.about.description,
  });
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

  const [bio2Before, bio2After] = (ap.lawyerProfile.bio2 as string).split("{itaka7}");
  const roles: string[] = ap.lawyerProfile.roles ?? [];

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE}${getLocalizedPath(lang, "about")}#profile`,
    inLanguage: lang,
    dateModified: "2026-10-27",
    mainEntity: personJsonLd(lang),
  };

  const values = [
    { icon: ShieldCheckIcon, ...ap.values.professionalism },
    { icon: HandRaisedIcon, ...ap.values.integrity },
    { icon: TrophyIcon, ...ap.values.results },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <PageHeader title={ap.title} subtitle={ap.subtitle} />

      {/* Firm Overview */}
      <section className="py-16 lg:py-24 bg-light">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl text-navy mb-4">
              {OFFICE.name}
            </h2>
            <p className="text-gold text-xs font-medium uppercase tracking-[0.2em] mb-6">{dict.hero.subtitle}</p>
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
            <div className="bg-white border border-gray-200 p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Portreti */}
                <div className="shrink-0">
                  <div className="relative w-56 lg:w-64 aspect-[4/5] mx-auto lg:mx-0 bg-navy-50">
                    <Image
                      src="/images/orjon-nallbati-zyra.webp"
                      alt={OFFICE.lawyer}
                      fill
                      sizes="(min-width: 1024px) 256px, 224px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl text-navy mb-1">
                    {OFFICE.lawyer}
                  </h2>
                  <p className="text-gold text-xs font-medium uppercase tracking-[0.2em] mb-4">{founderTitle}</p>
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

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {ap.lawyerProfile.bio}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {bio2Before}
                    <a
                      href={PROFILES.itaka7}
                      target="_blank"
                      rel="noopener"
                      className="text-navy underline decoration-gold underline-offset-4 hover:text-gold transition-colors"
                    >
                      ITAKA7
                    </a>
                    {bio2After}
                  </p>

                  {roles.length > 0 && (
                    <>
                      <p className="text-gold text-xs font-medium uppercase tracking-[0.2em] mb-3">
                        {ap.lawyerProfile.rolesTitle}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {roles.map((role) => (
                          <li key={role} className="flex items-start gap-2 text-sm text-gray-600">
                            <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 bg-gold shrink-0" />
                            <span>{role}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <a
                    href={PROFILES.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-navy hover:text-gold transition-colors"
                    data-person={PERSON_ID}
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl text-navy mb-4">
              {ap.values.title}
            </h2>
            <GoldDivider short />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-14 h-14 border border-gray-300 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-lg text-navy mb-2">
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
