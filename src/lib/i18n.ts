/* ─── i18n infrastructure ─── */

export const LOCALES = ["sq", "en", "it"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "sq";

/* ─── Route slug mappings ─── */

/**
 * Each key is a logical route identifier.
 * The value per locale is the URL slug used in that language.
 */
export const ROUTE_SLUGS: Record<string, Record<Locale, string>> = {
  home:     { sq: "",           en: "",           it: ""           },
  services: { sq: "sherbime",   en: "services",   it: "servizi"   },
  about:    { sq: "rreth-nesh", en: "about",      it: "chi-siamo" },
  contact:  { sq: "kontakt",    en: "contact",    it: "contatto"  },
  blog:     { sq: "blog",       en: "blog",       it: "blog"      },
  privacy:  { sq: "privatesia", en: "privacy",    it: "privacy"   },
};

/** All known route keys */
export type RouteKey = keyof typeof ROUTE_SLUGS;

/* ─── Helpers ─── */

/**
 * Build the localised path for a given route key.
 *
 * Examples:
 *   getLocalizedPath("sq", "services") => "/sherbime"
 *   getLocalizedPath("en", "services") => "/en/services"
 *   getLocalizedPath("sq", "home")     => "/"
 *   getLocalizedPath("it", "home")     => "/it"
 */
export function getLocalizedPath(locale: Locale, routeKey: RouteKey): string {
  const slug = ROUTE_SLUGS[routeKey]?.[locale] ?? "";
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  if (!slug) return prefix || "/";
  return `${prefix}/${slug}`;
}

/**
 * Reverse-lookup: given a locale and a URL slug, return the route key.
 * Returns undefined if no match is found.
 *
 * Examples:
 *   getRouteKey("sq", "sherbime")  => "services"
 *   getRouteKey("en", "about")     => "about"
 *   getRouteKey("sq", "")          => "home"
 */
export function getRouteKey(locale: Locale, slug: string): RouteKey | undefined {
  const normalised = slug.replace(/^\/+|\/+$/g, "");
  for (const [key, slugs] of Object.entries(ROUTE_SLUGS)) {
    if (slugs[locale] === normalised) return key as RouteKey;
  }
  return undefined;
}

/**
 * Build alternate URLs for hreflang tags.
 * Returns an object mapping each locale to its absolute path.
 *
 * Example:
 *   getAlternateUrls("services")
 *   => { sq: "/sherbime", en: "/en/services", it: "/it/servizi" }
 */
export function getAlternateUrls(routeKey: RouteKey): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, getLocalizedPath(locale, routeKey)])
  ) as Record<Locale, string>;
}
