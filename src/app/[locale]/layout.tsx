import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HtmlLangSetter from "@/components/layout/HtmlLangSetter";
import CookieConsent from "@/components/layout/CookieConsent";
import { LOCALES, DEFAULT_LOCALE, getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);
  const baseUrl = "https://www.onlawoffice.com";

  // Build hreflang alternates for the home page
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const path = getLocalizedPath(l, "home");
    languages[l] = `${baseUrl}${path}`;
  }

  const ogLocaleMap: Record<string, string> = {
    sq: "sq_AL",
    en: "en_US",
    it: "it_IT",
  };

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.metadata.home.title,
      template: "%s | OnLaw Office",
    },
    description: dict.metadata.home.description,
    keywords: [
      "avokat",
      "tiranë",
      "studio ligjore",
      "OnLaw Office",
      "Orjon Nallbati",
      "law firm",
      "tirana",
    ],
    authors: [{ name: "Av. Orjon Nallbati" }],
    openGraph: {
      type: "website",
      locale: ogLocaleMap[lang] || "sq_AL",
      url: `${baseUrl}${getLocalizedPath(lang, "home")}`,
      siteName: "OnLaw Office",
      title: dict.metadata.home.title,
      description: dict.metadata.home.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.home.title,
      description: dict.metadata.home.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}${getLocalizedPath(lang, "home")}`,
      languages,
    },
    verification: {
      google: "HqakyWy5o6kDcoMNEkd7_p3CsDZI5soRPV53eS29aic",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "OnLaw Office",
    alternateName: "Studio Ligjore — Av. Orjon Nallbati",
    url: "https://www.onlawoffice.com",
    telephone: "+355693314640",
    email: "orjon.nallbati@onlawoffice.com",
    inLanguage: lang,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        'Blv. "Gjergj Fishta", Pall. TeknoProjekt, Kulla III, Ap. 9',
      addressLocality: "Tiranë",
      addressCountry: "AL",
    },
    areaServed: { "@type": "Country", name: "Albania" },
    founder: {
      "@type": "Person",
      name: "Orjon Nallbati",
      jobTitle: "Avokat",
    },
  };

  return (
    <>
      <HtmlLangSetter lang={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header locale={lang} dict={dict} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={lang} dict={dict} />
      <CookieConsent locale={lang} dict={dict.cookieConsent} />
    </>
  );
}
