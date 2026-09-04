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

const STATIC_EXT =
  /\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|css|js|map|json|xml|txt|webmanifest)$/;

function isAppPath(p: string) {
  return p === "app" || p.startsWith("app/");
}

function isAuthPage(p: string) {
  return p.startsWith("app/login") || p.startsWith("app/register");
}

async function checkAppAuth(
  request: NextRequest,
  locale: Locale,
  restPath: string,
): Promise<NextResponse | null> {
  if (isAuthPage(restPath)) return null;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (token) return null;
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${locale}/app/login`;
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal routes
  if (
    SKIP_PREFIXES.some((p) => pathname.startsWith(p)) ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] as Locale | undefined;
  const hasLocalePrefix = firstSegment
    ? (LOCALES as readonly string[]).includes(firstSegment)
    : false;

  // No locale prefix → REWRITE internally to /sq/... so the canonical URL
  // stays prefix-free (e.g. /sherbime) and Google does not see a 307 chain.
  if (!hasLocalePrefix) {
    const restWithoutLocale = segments.join("/");
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;

    // Dashboard routes need auth even when accessed without /sq prefix
    if (isAppPath(restWithoutLocale)) {
      const redirect = await checkAppAuth(request, DEFAULT_LOCALE, restWithoutLocale);
      if (redirect) return redirect;
    }
    return NextResponse.rewrite(url);
  }

  const locale = firstSegment as Locale;
  const restSegments = segments.slice(1);
  const restPath = restSegments.join("/");

  // Protect /app/* routes (dashboard) under any locale
  if (isAppPath(restPath)) {
    const redirect = await checkAppAuth(request, locale, restPath);
    if (redirect) return redirect;
    // Dashboard keeps the locale prefix in the URL (no SEO redirect for /sq/app/*)
    return NextResponse.next();
  }

  // Marketing pages under /sq/* → redirect 308 to prefix-free URL so we never
  // serve duplicate content at both /sq/X and /X.
  if (locale === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = restPath ? `/${restPath}` : "/";
    return NextResponse.redirect(url, 308);
  }

  // Non-default locale → check if the slug needs rewriting to internal (sq) slug
  if (restPath) {
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
