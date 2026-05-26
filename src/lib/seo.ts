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
  ogType = "website",
  ogExtra,
}: BuildOptions): Metadata {
  const suffix = subPath ? `/${subPath.replace(/^\/+/, "")}` : "";
  const canonicalPath = `${getLocalizedPath(locale, routeKey)}${suffix}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}${getLocalizedPath(l, routeKey)}${suffix}`;
  }
  languages["x-default"] = `${SITE_URL}${getLocalizedPath("sq", routeKey)}${suffix}`;

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
      ...ogExtra,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
