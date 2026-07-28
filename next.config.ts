import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    // Legacy 404s reported by Search Console: blog slugs are localized, but
    // hreflang alternates used to reuse the same slug across locales. Point
    // each dead cross-locale URL at the article that actually exists.
    return [
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
