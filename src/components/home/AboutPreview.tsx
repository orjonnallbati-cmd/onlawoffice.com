import Link from "next/link";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AboutPreview({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const ap = dict.aboutPreview;

  const desc1 = ap.description1
    .replace("{name}", OFFICE.name)
    .replace("{lawyer}", OFFICE.lawyer)
    .replace("{chamber}", OFFICE.chamber);

  const features = [
    ap.features.experience,
    ap.features.expertise,
    ap.features.personal,
    ap.features.international,
  ];

  return (
    <section className="py-16 lg:py-24 bg-alt">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="text-gold text-xs font-medium uppercase tracking-[0.25em] mb-4">
              {ap.label}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-navy mb-4">
              {ap.title}
            </h2>
            <GoldDivider short className="!mx-0 mb-6" />
            <p className="text-gray-600 leading-relaxed mb-6">{desc1}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{ap.description2}</p>
            <Link
              href={getLocalizedPath(locale, "about")}
              className="inline-flex items-center gap-2 text-navy font-semibold border-b border-gold pb-1 hover:text-gold transition-colors"
            >
              {ap.readMore}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Qualities as a typographic list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {features.map((item) => (
              <div key={item.title} className="border-t border-gray-300 pt-4">
                <h3 className="text-xl text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
