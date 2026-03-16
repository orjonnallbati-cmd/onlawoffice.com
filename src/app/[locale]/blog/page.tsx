import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.metadata.blog.title,
    description: dict.metadata.blog.description,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale as Locale;
  const dict = await getDictionary(lang);
  const posts = getAllPosts(lang);

  return (
    <>
      <PageHeader
        title={dict.blogPage.title}
        subtitle={dict.blogPage.subtitle}
      />

      <section className="py-16 lg:py-24 bg-white">
        <Container>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} locale={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {dict.blogPage.emptyTitle}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {dict.blogPage.emptySubtitle}
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
