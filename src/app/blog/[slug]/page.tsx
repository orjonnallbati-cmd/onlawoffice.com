import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/ui/Container";
import GoldDivider from "@/components/ui/GoldDivider";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { OFFICE } from "@/lib/constants";
import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artikull i Panjohur" };

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: "article",
      publishedTime: post.meta.date,
      authors: [post.meta.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const formattedDate = new Date(post.meta.date).toLocaleDateString("sq-AL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.excerpt,
    datePublished: post.meta.date,
    author: {
      "@type": "Person",
      name: post.meta.author,
      url: "https://www.onlawoffice.com/rreth-nesh",
    },
    publisher: {
      "@type": "Organization",
      name: "OnLaw Office",
      url: "https://www.onlawoffice.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.onlawoffice.com/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Article Header */}
      <section className="bg-navy pt-28 pb-12 lg:pt-36 lg:pb-16">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-gold transition-colors text-sm mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kthehu te Blogu
          </Link>

          {post.meta.category && (
            <span className="inline-block px-3 py-1 bg-white/10 text-gold text-xs font-medium rounded-full mb-4">
              {post.meta.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {post.meta.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-gold" />
              {post.meta.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-gold" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-gold" />
              {post.meta.readingTime}
            </span>
          </div>
        </Container>
      </section>

      <GoldDivider />

      {/* Article Content */}
      <article className="py-12 lg:py-16 bg-white">
        <Container className="max-w-3xl">
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-navy prose-a:underline hover:prose-a:text-gold prose-strong:text-dark">
            <MDXRemote source={post.content} />
          </div>
        </Container>
      </article>

      {/* Author Box */}
      <section className="py-8 bg-alt">
        <Container className="max-w-3xl">
          <div className="flex items-center gap-4 p-6 bg-white rounded-lg">
            <div className="w-14 h-14 bg-navy-50 rounded-full flex items-center justify-center shrink-0">
              <UserIcon className="w-7 h-7 text-navy" />
            </div>
            <div>
              <p className="font-bold text-navy">{OFFICE.lawyer}</p>
              <p className="text-sm text-gray-500">{OFFICE.full}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
