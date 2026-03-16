import Link from "next/link";
import Container from "@/components/ui/Container";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import {
  ScaleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Hero({ dict, locale }: { dict: Record<string, any>; locale: Locale }) {
  const h = dict.hero;

  return (
    <section className="relative bg-navy pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, rgba(196, 163, 90, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(196, 163, 90, 0.2) 0%, transparent 50%)",
          }}
        />
      </div>

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-8">
            <div className="w-2 h-2 bg-gold rounded-full" />
            <span className="text-gold text-sm font-medium">
              {h.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-white">On</span>
            <span className="text-gold">Law</span>{" "}
            <span className="text-white">Office</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-gray-300">
            {h.subtitle}
          </p>

          <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {h.description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={getLocalizedPath(locale, "contact")}
              className="px-8 py-3.5 bg-gold text-navy font-semibold rounded-md hover:bg-gold-300 transition-colors text-base"
            >
              {h.ctaPrimary}
            </Link>
            <Link
              href={getLocalizedPath(locale, "services")}
              className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-md hover:bg-white/10 transition-colors text-base"
            >
              {h.ctaSecondary}
            </Link>
          </div>

          {/* Quick features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: ScaleIcon, label: h.features.civil },
              { icon: ShieldCheckIcon, label: h.features.constitutional },
              { icon: DocumentTextIcon, label: h.features.data },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 justify-center text-gray-300"
              >
                <item.icon className="w-5 h-5 text-gold shrink-0" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
