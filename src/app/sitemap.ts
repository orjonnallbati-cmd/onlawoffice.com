import type { MetadataRoute } from "next";
import { LOCALES, ROUTE_SLUGS, getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.onlawoffice.com";
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticRoutes: { key: string; changeFrequency: "monthly" | "weekly" | "yearly"; priority: number }[] = [
    { key: "home", changeFrequency: "monthly", priority: 1 },
    { key: "services", changeFrequency: "monthly", priority: 0.9 },
    { key: "about", changeFrequency: "monthly", priority: 0.8 },
    { key: "blog", changeFrequency: "weekly", priority: 0.8 },
    { key: "contact", changeFrequency: "yearly", priority: 0.7 },
    { key: "privacy", changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const route of staticRoutes) {
    for (const locale of LOCALES) {
      const path = getLocalizedPath(locale, route.key as keyof typeof ROUTE_SLUGS);
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  // Blog posts per locale
  for (const locale of LOCALES) {
    const posts = getAllPosts(locale as Locale);
    const blogPath = getLocalizedPath(locale as Locale, "blog");
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}${blogPath}/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
