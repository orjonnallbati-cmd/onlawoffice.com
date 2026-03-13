import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPostMeta } from "@/types";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const stats = readingTime(content);

      return {
        title: data.title || "",
        slug: data.slug || filename.replace(".mdx", ""),
        date: data.date || "",
        excerpt: data.excerpt || "",
        author: data.author || "Av. Orjon Nallbati",
        category: data.category || "",
        readingTime: stats.text.replace("read", "lexim"),
        published: data.published !== false,
      } satisfies BlogPostMeta;
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string) {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const postSlug = data.slug || filename.replace(".mdx", "");

    if (postSlug === slug) {
      const stats = readingTime(content);
      return {
        meta: {
          title: data.title || "",
          slug: postSlug,
          date: data.date || "",
          excerpt: data.excerpt || "",
          author: data.author || "Av. Orjon Nallbati",
          category: data.category || "",
          readingTime: stats.text.replace("read", "lexim"),
          published: data.published !== false,
        } satisfies BlogPostMeta,
        content,
      };
    }
  }

  return null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
