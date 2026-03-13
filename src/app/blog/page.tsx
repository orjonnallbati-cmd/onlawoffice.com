import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Juridik",
  description:
    "Artikuj dhe analiza juridike mbi legjislacionin shqiptar, praktikën gjyqësore dhe mbrojtjen e të dhënave personale.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        title="Blog Juridik"
        subtitle="Artikuj, analiza dhe komente mbi legjislacionin shqiptar"
      />

      <section className="py-16 lg:py-24 bg-white">
        <Container>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Artikujt e blogut do të publikohen së shpejti.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Na ndiqni për përditësime mbi legjislacionin shqiptar.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
