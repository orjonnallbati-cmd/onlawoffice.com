import type { NextConfig } from "next";
import path from "node:path";

// Content-Security-Policy. Skriptet inline të Next.js (hidratimi) kërkojnë
// 'unsafe-inline' pa nonce; pjesa tjetër është e mbyllur në burimet reale:
// Google Fonts, harta e Google, Formspree (formulari i kontaktit), Supabase.
const IS_DEV = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${IS_DEV ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://formspree.io https://*.supabase.co${IS_DEV ? " ws://localhost:* http://localhost:*" : ""}`,
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "form-action 'self' https://formspree.io",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    // 404 globale me <html> të vetin: lejon që layout-i rrënjë të jetë
    // `[locale]/layout.tsx` dhe `lang` të dalë i saktë për çdo gjuhë.
    globalNotFound: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
  async redirects() {
    // Legacy 404s reported by Search Console: blog slugs are localized, but
    // hreflang alternates used to reuse the same slug across locales. Point
    // each dead cross-locale URL at the article that actually exists.
    return [
      // Kontaktet pa prefiks gjuhe (linke të vjetra në artikuj) → faqja e saktë
      { source: "/contact", destination: "/en/contact", permanent: true },
      { source: "/contatto", destination: "/it/contatto", permanent: true },
      {
        source: "/blog/legge-124-2024-cosa-rischia-la-tua-azienda",
        destination: "/it/blog/legge-124-2024-cosa-rischia-la-tua-azienda",
        permanent: true,
      },
      {
        source: "/en/blog/legge-124-2024-cosa-rischia-la-tua-azienda",
        destination: "/en/blog/law-124-2024-what-your-business-risks",
        permanent: true,
      },
      {
        source: "/blog/how-to-choose-the-right-lawyer",
        destination: "/en/blog/how-to-choose-the-right-lawyer",
        permanent: true,
      },
      {
        source: "/it/blog/how-to-choose-the-right-lawyer",
        destination: "/it/blog/come-scegliere-avvocato-giusto",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
