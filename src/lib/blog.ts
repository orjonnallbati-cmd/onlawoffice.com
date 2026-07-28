import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPostMeta } from "@/types";
import { LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const BLOG_BASE = path.join(process.cwd(), "src/content/blog");

const READING_TIME_LABELS: Record<Locale, { read: string }> = {
  sq: { read: "lexim" },
  en: { read: "read" },
  it: { read: "lettura" },
};

function getBlogDir(locale: Locale): string {
  return path.join(BLOG_BASE, locale);
}

export function getAllPosts(locale: Locale): BlogPostMeta[] {
  const blogDir = getBlogDir(locale);
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(blogDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const stats = readingTime(content);
      const label = READING_TIME_LABELS[locale];
      const readTimeText = locale === "en"
        ? stats.text
        : stats.text.replace("read", label.read);

      return {
        title: data.title || "",
        slug: data.slug || filename.replace(".mdx", ""),
        date: data.date || "",
        excerpt: data.excerpt || "",
        author: data.author || "Av. Orjon Nallbati",
        category: data.category || "",
        readingTime: readTimeText,
        published: data.published !== false,
      } satisfies BlogPostMeta;
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string, locale: Locale) {
  const blogDir = getBlogDir(locale);
  if (!fs.existsSync(blogDir)) return null;

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const postSlug = data.slug || filename.replace(".mdx", "");

    if (postSlug === slug) {
      const stats = readingTime(content);
      const label = READING_TIME_LABELS[locale];
      const readTimeText = locale === "en"
        ? stats.text
        : stats.text.replace("read", label.read);

      return {
        meta: {
          title: data.title || "",
          slug: postSlug,
          date: data.date || "",
          excerpt: data.excerpt || "",
          author: data.author || "Av. Orjon Nallbati",
          category: data.category || "",
          readingTime: readTimeText,
          published: data.published !== false,
        } satisfies BlogPostMeta,
        content,
      };
    }
  }

  return null;
}

export function getAllSlugs(locale: Locale): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}

/**
 * Resolve the slug of the same article in every locale that has a
 * translation, via the `translationKey` frontmatter field. Used to emit
 * correct hreflang alternates — slugs are localized, so reusing the same
 * slug across locales produces 404 URLs.
 */
export function getAlternateSlugs(
  slug: string,
  locale: Locale,
): Partial<Record<Locale, string>> {
  const readKeyAndSlug = (dir: string, filename: string) => {
    const { data } = matter(fs.readFileSync(path.join(dir, filename), "utf-8"));
    return {
      key: data.translationKey as string | undefined,
      slug: (data.slug as string | undefined) || filename.replace(".mdx", ""),
      published: data.published !== false,
    };
  };

  const ownDir = getBlogDir(locale);
  if (!fs.existsSync(ownDir)) return {};

  let translationKey: string | undefined;
  for (const filename of fs.readdirSync(ownDir).filter((f) => f.endsWith(".mdx"))) {
    const entry = readKeyAndSlug(ownDir, filename);
    if (entry.slug === slug) {
      translationKey = entry.key;
      break;
    }
  }

  const alternates: Partial<Record<Locale, string>> = { [locale]: slug };
  if (!translationKey) return alternates;

  for (const l of LOCALES) {
    if (l === locale) continue;
    const dir = getBlogDir(l);
    if (!fs.existsSync(dir)) continue;
    for (const filename of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const entry = readKeyAndSlug(dir, filename);
      if (entry.key === translationKey && entry.published) {
        alternates[l] = entry.slug;
        break;
      }
    }
  }
  return alternates;
}
