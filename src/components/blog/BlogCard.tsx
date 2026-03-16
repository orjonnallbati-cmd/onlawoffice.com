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
      className="group block bg-white rounded-lg border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Category badge */}
      <div className="p-6">
        {post.category && (
          <span className="inline-block px-3 py-1 bg-navy-50 text-navy text-xs font-medium rounded-full mb-3">
            {post.category}
          </span>
        )}

        <h3 className="text-lg font-bold text-navy group-hover:text-gold transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
