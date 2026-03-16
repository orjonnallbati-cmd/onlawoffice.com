"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LOCALES, ROUTE_SLUGS, DEFAULT_LOCALE } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

/**
 * Given the current pathname and locale, determine the equivalent path for a target locale.
 */
function getEquivalentPath(pathname: string, currentLocale: Locale, targetLocale: Locale): string {
  // Strip locale prefix to get the internal slug
  const withoutLocale = pathname.replace(new RegExp(`^/${currentLocale}(/|$)`), "/");
  const slug = withoutLocale.replace(/^\/+/, "").split("/")[0] || "";

  // Find which route key matches the internal slug (Albanian slug = FS path)
  let routeKey: string | null = null;
  for (const [key, slugs] of Object.entries(ROUTE_SLUGS)) {
    // Internal slugs match the default locale (sq)
    if (slugs[DEFAULT_LOCALE] === slug) {
      routeKey = key;
      break;
    }
  }

  // Build target path
  const targetPrefix = targetLocale === DEFAULT_LOCALE ? "" : `/${targetLocale}`;

  if (routeKey) {
    const targetSlug = ROUTE_SLUGS[routeKey][targetLocale];
    if (!targetSlug) return targetPrefix || "/";
    return `${targetPrefix}/${targetSlug}`;
  }

  // For blog posts or unknown routes, keep the rest of the path
  const restOfPath = withoutLocale === "/" ? "" : withoutLocale;
  return `${targetPrefix}${restOfPath}` || "/";
}

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-gray-300 text-xs mx-0.5">|</span>}
          <Link
            href={getEquivalentPath(pathname, locale, l)}
            className={`px-1.5 py-0.5 text-xs font-semibold rounded transition-colors ${
              l === locale
                ? "text-gold bg-navy-50"
                : "text-gray-400 hover:text-navy"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
