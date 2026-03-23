import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, ROUTE_SLUGS } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getToken } from "next-auth/jwt";

/**
 * Build a reverse map: { "en/services" => "sherbime", "it/servizi" => "sherbime", ... }
 * Maps translated slugs to the Albanian (internal) slug for URL rewrites.
 */
function buildSlugRewriteMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [, slugsByLocale] of Object.entries(ROUTE_SLUGS)) {
    const internalSlug = slugsByLocale[DEFAULT_LOCALE]; // Albanian slug is our FS path
    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) continue; // sq slugs match the FS already
      const translatedSlug = slugsByLocale[locale];
      if (translatedSlug && translatedSlug !== internalSlug) {
        map.set(`${locale}/${translatedSlug}`, internalSlug);
      }
    }
  }
  return map;
}

const slugRewriteMap = buildSlugRewriteMap();

/** Paths that should never be intercepted by the locale middleware. */
const SKIP_PREFIXES = [
  "/_next",
  "/api",
  "/favicon",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/sitemap",
  "/robots.txt",
];

const STATIC_EXT = /\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|css|js|map|json|xml|txt)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal routes
  if (
    SKIP_PREFIXES.some((p) => pathname.startsWith(p)) ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Protect /app routes (except login and register) - require authentication
  const appRouteMatch = pathname.match(/^(?:\/(?:sq|en|it))?\/app\//);
  if (appRouteMatch) {
    const isAuthPage = pathname.includes('/app/login') || pathname.includes('/app/register');
    if (!isAuthPage) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/app/login';
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Check if pathname already starts with a locale
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] as Locale | undefined;

  const hasLocalePrefix = firstSegment
    ? (LOCALES as readonly string[]).includes(firstSegment)
    : false;

  // No locale prefix -> redirect to /sq/...
  if (!hasLocalePrefix) {
    const url = request.nextUrl.clone();
    // For "/" -> "/sq", for "/sherbime" -> "/sq/sherbime"
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Has locale prefix — check if the slug needs rewriting to internal (Albanian) slug
  const locale = firstSegment as Locale;
  const restSegments = segments.slice(1);
  const restPath = restSegments.join("/");

  if (locale !== DEFAULT_LOCALE && restPath) {
    // Try to find a rewrite match: e.g. "en/services" -> "sherbime"
    const lookupKey = `${locale}/${restPath}`;
    const internalSlug = slugRewriteMap.get(lookupKey);

    if (internalSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/${internalSlug}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static, _next/image (Next.js internals)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
