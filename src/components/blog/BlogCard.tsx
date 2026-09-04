import Link from "next/link";
import type { BlogPostMeta } from "@/types";
import { getLocalizedPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

const LOCALE_DATE_MAP: Record<string, string> = {
  sq: "sq-AL",
  en: "en-US",
  it: "it-IT",
};

export default function BlogCard({ post, locale }: { post: BlogPostMeta; locale: Locale }) {
  const dateLocale = LOCALE_DATE_MAP[locale] || "sq-AL";
  const formattedDate = new Date(post.date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blogPath = getLocalizedPath(locale, "blog");

  return (
    <Link
      href={`${blogPath}/${post.slug}`}
      className="group flex flex-col bg-white border border-gray-200 hover:border-gold transition-colors p-7 lg:p-8"
    >
      {post.category && (
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold mb-4">
          {post.category}
        </span>
      )}

      <h3 className="text-xl lg:text-2xl text-navy group-hover:text-gold transition-colors leading-snug mb-3">
        {post.title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="mt-auto flex items-center gap-5 text-xs text-gray-400 pt-4 border-t border-gray-100">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon className="w-3.5 h-3.5" />
          {post.readingTime}
        </span>
      </div>
    </Link>
  );
}
