import type { Metadata } from "next";
import { LOCALES, getLocalizedPath } from "@/lib/i18n";
import type { Locale, RouteKey } from "@/lib/i18n";

export const SITE_URL = "https://www.onlawoffice.com";

const OG_LOCALE_MAP: Record<Locale, string> = {
  sq: "sq_AL",
  en: "en_US",
  it: "it_IT",
};

type BuildOptions = {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description: string;
  /** Optional sub-path appended after the route slug (e.g. blog post slug). */
  subPath?: string;
  /**
   * Per-locale sub-paths for pages whose slug is localized (e.g. blog posts).
   * When set, hreflang alternates are emitted only for the locales present in
   * this map, each with its own slug — never the current locale's slug, which
   * would point to a 404 on the other locales.
   */
  subPathByLocale?: Partial<Record<Locale, string>>;
  /** Override the OpenGraph type. Defaults to "website". */
  ogType?: "website" | "article";
  ogExtra?: Record<string, unknown>;
};

/**
 * Build per-page Metadata with canonical + hreflang alternates resolved to
 * absolute URLs. Use this in every page.tsx instead of returning raw title/
 * description objects — otherwise pages inherit the layout canonical and get
 * deduplicated by Google as alternates of the home page.
 */
export function buildPageMetadata({
  locale,
  routeKey,
  title,
  description,
  subPath,
  subPathByLocale,
  ogType = "website",
  ogExtra,
}: BuildOptions): Metadata {
  const toSuffix = (p?: string) => (p ? `/${p.replace(/^\/+/, "")}` : "");
  const suffix = toSuffix(subPathByLocale?.[locale] ?? subPath);
  const canonicalPath = `${getLocalizedPath(locale, routeKey)}${suffix}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    if (subPathByLocale && !(l in subPathByLocale)) continue;
    const localeSuffix = subPathByLocale ? toSuffix(subPathByLocale[l]) : suffix;
    languages[l] = `${SITE_URL}${getLocalizedPath(l, routeKey)}${localeSuffix}`;
  }
  if (languages["sq"]) {
    languages["x-default"] = languages["sq"];
  } else {
    languages["x-default"] = `${SITE_URL}${canonicalPath}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages,
    },
    openGraph: {
      type: ogType,
      locale: OG_LOCALE_MAP[locale],
      url: `${SITE_URL}${canonicalPath}`,
      siteName: "OnLaw Office",
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "OnLaw Office — Studio Ligjore, Av. Orjon Nallbati",
        },
      ],
      ...ogExtra,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}
