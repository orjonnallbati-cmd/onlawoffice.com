import Link from "next/link";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import { OFFICE } from "@/lib/constants";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AboutPreview({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const ap = dict.aboutPreview;

  const desc1 = ap.description1
    .replace("{name}", OFFICE.name)
    .replace("{lawyer}", OFFICE.lawyer)
    .replace("{chamber}", OFFICE.chamber);

  const features = [
    { icon: BriefcaseIcon, ...ap.features.experience },
    { icon: AcademicCapIcon, ...ap.features.expertise },
    { icon: UserGroupIcon, ...ap.features.personal },
    { icon: AcademicCapIcon, ...ap.features.international },
  ];

  return (
    <section className="py-16 lg:py-24 bg-alt">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              {ap.label}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
              {ap.title}
            </h2>
            <GoldDivider short className="!mx-0 mb-6" />
            <p className="text-gray-600 leading-relaxed mb-6">{desc1}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{ap.description2}</p>
            <Link
              href={getLocalizedPath(locale, "about")}
              className="inline-flex items-center text-navy font-semibold hover:text-gold transition-colors"
            >
              {ap.readMore}
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
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <item.icon className="w-8 h-8 text-gold mb-3" />
                <h3 className="font-bold text-navy text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
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
