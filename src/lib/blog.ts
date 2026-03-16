import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPostMeta } from "@/types";
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
