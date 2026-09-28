import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { getBlogPostBySlug } from "@/lib/blog";

const post = getBlogPostBySlug("how-to-crop-or-trim-a-pdfs-margins")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
};

const faqs = [
  {
    q: "Is cropping a PDF the same as trimming it?",
    a: "Yes — \"crop\" and \"trim\" describe the exact same operation on a PDF: cutting down the visible margin around the content. Different people just default to different words for it, the same way some say \"resize\" and others say \"scale.\"",
  },
  {
    q: "Does cropping delete anything permanently?",
    a: "No. Cropping a PDF changes its crop box — the visible boundary of the page — not the actual content underneath. The full page is technically still there; a viewer just displays a smaller window of it. This is different from cutting or deleting content, and it's reversible if you keep the original file.",
  },
  {
    q: "Will the crop show up correctly everywhere I open the file?",
    a: "In effectively every modern PDF viewer, yes — the crop box is a standard part of the PDF format, not a proprietary trick. Very old or unusual viewers can occasionally ignore it and show the full uncropped page, but that's rare.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.date,
  author: { "@type": "Organization", name: "Doclyn" },
};

export default function CropTrimPdfGuidePage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-ink">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">How to Crop or Trim a PDF's Margins</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">Published {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-8 space-y-6 leading-relaxed text-ink">
          <p>
            "Crop" and "trim" get used interchangeably for PDFs, and that's not a mistake — they're
            the same operation. Whichever word you searched to get here, what you actually want is
            almost always the same thing: less white space around the edge of every page, without
            touching what's printed on them.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">What's actually happening when you crop a PDF</h2>
          <p>
            Every PDF page has a defined boundary — the area a viewer displays. Cropping (or
            trimming) moves that boundary inward from all four sides. The underlying content
            doesn't move and isn't deleted; the visible window onto it just gets smaller. That's
            why it's a safe, reversible-feeling operation: the original page is still there, just
            framed differently.
          </p>
          <p>
            This is different from something like deleting a column of a spreadsheet or cutting a
            paragraph out of a document — nothing is removed from the file's content. It's purely a
            display boundary change, which is also why it doesn't affect image quality or text
            sharpness at all.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">When you'd actually want this</h2>
          <p>
            The most common case is a scanned document with wide, uneven margins — scanners often
            capture more white space than the original page needed, especially around the edges of
            a scanner bed. Cropping it down makes the page look tighter and more intentional. It's
            also useful for PDFs exported from software that adds extra padding by default, or for
            trimming a printed page down before combining it with others that use a tighter margin.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">How to do it</h2>
          <p>
            Open the file in <Link href="/tools/crop-pdf" className="text-signal underline">Crop PDF</Link>,
            and drag a single slider to trim margin evenly from all four sides of every page. A
            preview of your first page updates live as you drag it, so you can see exactly how much
            is being trimmed before you save — no guessing, and nothing is uploaded to a server to
            do it.
          </p>
          <p>
            If you only want to trim one side, or a different amount per side, that's a more
            specific edit than an even, all-sides margin trim — worth knowing going in, so you pick
            the right tool for what you actually need.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">One thing worth knowing</h2>
          <p>
            Because the underlying content isn't deleted, a heavily-cropped PDF's file size barely
            changes — cropping isn't a compression technique, even though a page visually looking
            smaller can make it feel like it should be. If your actual goal is a smaller file size,{" "}
            <Link href="/tools/compress-pdf" className="text-signal underline">Compress PDF</Link>{" "}
            is the tool for that; cropping and compressing solve two different problems and can be
            used together.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink">FAQ</h2>
          <div className="mt-4 space-y-5">
            {faqs.map((item) => (
              <div key={item.q}>
                <h3 className="font-medium text-ink">{item.q}</h3>
                <p className="mt-1 text-sm text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/tools/crop-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Crop PDF</Link>
            <Link href="/tools/compress-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress PDF</Link>
            <Link href="/tools/rotate-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Rotate PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
