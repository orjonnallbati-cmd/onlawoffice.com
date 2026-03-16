import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.onlawoffice.com"),
  title: {
    default: "OnLaw Office — Studio Ligjore, Av. Orjon Nallbati",
    template: "%s | OnLaw Office",
  },
  description:
    "Studio Ligjore profesionale në Tiranë. Shërbime juridike në fushën civile, tregtare, administrative, kushtetuese dhe mbrojtjen e të dhënave personale.",
  keywords: [
    "avokat",
    "tiranë",
    "studio ligjore",
    "OnLaw Office",
    "Orjon Nallbati",
    "shërbime juridike",
    "avokat tirane",
  ],
  authors: [{ name: "Av. Orjon Nallbati" }],
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "https://www.onlawoffice.com",
    siteName: "OnLaw Office",
    title: "OnLaw Office — Studio Ligjore, Av. Orjon Nallbati",
    description:
      "Studio Ligjore profesionale në Tiranë. E drejta civile, tregtare, administrative dhe kushtetuese.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnLaw Office — Studio Ligjore, Av. Orjon Nallbati",
    description:
      "Studio Ligjore profesionale në Tiranë. Shërbime juridike në fushën civile, tregtare, administrative dhe kushtetuese.",
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
    canonical: "https://www.onlawoffice.com",
  },
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "OnLaw Office",
    alternateName: "Studio Ligjore — Av. Orjon Nallbati",
    url: "https://www.onlawoffice.com",
    telephone: "+355693314640",
    email: "orjon.nallbati@onlawoffice.com",
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
    <html lang="sq">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
