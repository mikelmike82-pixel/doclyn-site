// Central blog post registry — same pattern as src/lib/tools.ts. The blog
// index page reads from this list, and the sitemap includes every entry
// automatically, so adding a new post later means one entry here plus one
// page component, not touching multiple files.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string; // ISO date, e.g. "2026-09-21"
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-compress-a-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    description:
      "What actually makes a PDF lose quality when you compress it, and how to shrink the file size without it — free, no upload, no signup.",
    excerpt:
      "\"Losing quality\" almost never means what people assume it means. Here's what's actually happening inside a PDF when it shrinks — and how to keep it looking identical.",
    date: "2026-09-21",
  },
  {
    slug: "how-to-rotate-a-pdf-online",
    title: "How to Rotate a PDF Online (Without Installing Anything)",
    description:
      "A sideways or upside-down PDF is almost always a scanning problem, not a file problem. Here's how to fix it online, free, in a browser tab.",
    excerpt:
      "Sideways pages after a scan are one of the most common small annoyances with PDFs — and one of the fastest to fix, if you know what's actually going on.",
    date: "2026-09-25",
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
