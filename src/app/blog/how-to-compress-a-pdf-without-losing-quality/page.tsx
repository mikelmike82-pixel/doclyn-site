import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { getBlogPostBySlug } from "@/lib/blog";

const post = getBlogPostBySlug("how-to-compress-a-pdf-without-losing-quality")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
};

const faqs = [
  {
    q: "Is compressing at 90% quality really \"lossless\"?",
    a: "Not technically — but in practice, at 90% or higher, the difference is invisible to the eye even zoomed in. \"Lossless\" in the strict sense only applies to formats like PNG; for JPEG-based compression (what most PDF compression uses under the hood), the honest goal is visually identical, not byte-for-byte identical.",
  },
  {
    q: "Why did my PDF get bigger after I tried to compress it?",
    a: "This happens when a PDF is already mostly text with little to compress, and a tool flattens every page into an image anyway — a photo of text is almost always larger than the text itself. A good compressor tells you when this happens instead of quietly handing back a bigger file.",
  },
  {
    q: "Does compressing a PDF delete pages or content?",
    a: "No — compression changes how the existing content is stored, not what's on the page. If pages are missing after compressing, something went wrong with the tool, not with the concept of compression itself.",
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

export default function CompressPdfGuidePage() {
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
          <span className="text-ink">Compress a PDF Without Losing Quality</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">Published {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-8 space-y-6 leading-relaxed text-ink">
          <p>
            "Losing quality" is the thing everyone worries about before compressing a PDF, but it
            almost never means what people picture. You're not going to end up with blurry text or
            missing paragraphs. What actually happens — and what to do about it — comes down to one
            question: what's actually taking up space in your file in the first place?
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">What actually makes a PDF huge</h2>
          <p>
            A PDF full of real, typed text is almost never large — text is tiny to store, even
            across hundreds of pages. When a PDF is 20MB, 50MB, or bigger, it's nearly always
            because of images: scanned pages, embedded photos, or a document that was exported at a
            much higher resolution than it needed to be. Compressing a PDF, in practice, means
            recompressing those images — the same idea as saving a photo at 80% quality instead of
            100%, just applied to every image sitting inside the PDF.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">Check what kind of PDF you actually have first</h2>
          <p>
            Before compressing anything, it's worth knowing which of these you're dealing with,
            because the right approach is different for each:
          </p>
          <p>
            <strong>Scanned or photo-heavy PDFs</strong> — every page is essentially a picture (even
            if it looks like text, a scan has no real text layer). These compress dramatically well,
            because you're directly shrinking the images that make up nearly all of the file's size.
          </p>
          <p>
            <strong>Text-based PDFs</strong> — reports, contracts, anything exported from Word or
            Google Docs. These are usually already small. If one of these is unexpectedly large,
            the culprit is almost always a few embedded high-resolution images rather than the text
            itself, and compressing should target those specifically rather than flattening the
            whole document.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">The actual technique</h2>
          <p>
            For a scanned or image-heavy PDF, recompressing each page at a high quality setting
            (roughly 85–95%) cuts file size significantly while staying visually identical — the
            compression artifacts that would actually be visible only start showing up well below
            that range. <Link href="/tools/compress-pdf" className="text-signal underline">Compress PDF</Link>{" "}
            does exactly this, entirely in your browser, and lets you see the size difference before
            you commit to it.
          </p>
          <p>
            For a text-based document that's larger than expected — a Word file, an Excel sheet, or
            a PDF where only a few embedded photos are the problem — a general
            "flatten every page to an image" approach is the wrong tool, since it would make a
            small, sharp, selectable-text file into a much bigger, unselectable one.{" "}
            <Link href="/tools/document-compressor" className="text-signal underline">Document Compressor</Link>{" "}
            handles this case specifically: it recompresses embedded photos in a Word, Excel, or PDF
            file without touching the actual text, formatting, or formulas.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">How to actually confirm nothing was lost</h2>
          <p>
            Don't just trust a smaller file size — check it. Open the compressed PDF, zoom to
            150–200%, and compare a page against the original at the same zoom level. If text is
            still crisp and images still look sharp at that zoom, the compression genuinely didn't
            cost you anything visible. If you can see blockiness or blurring at normal reading zoom
            (100%), the quality setting was pushed too low.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">One thing to watch out for</h2>
          <p>
            Some tools compress silently and don't tell you what tradeoff you just made — including
            whether your text is still selectable afterward. A page that's been flattened to an
            image looks identical at a glance but can no longer be searched, copied, or read by a
            screen reader. If keeping selectable text matters for your file, that's worth checking
            before you assume compression "worked."
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
            <Link href="/tools/compress-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress PDF</Link>
            <Link href="/tools/document-compressor" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Document Compressor</Link>
            <Link href="/tools/compress-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress Image</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
