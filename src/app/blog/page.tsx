import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides on working with PDFs and images — written from actually building the tools.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Blog</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Blog</h1>
        <p className="mt-2 max-w-xl text-muted">
          Practical guides on working with PDFs and images, written from actually building the
          tools — not just re-explaining the obvious.
        </p>

        <div className="mt-10 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-line pb-8 last:border-b-0">
              <p className="text-xs uppercase tracking-wide text-muted">{formatDate(post.date)}</p>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-ink">
                <Link href={`/blog/${post.slug}`} className="hover:text-signal">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block text-sm font-medium text-signal hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
