import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { getBlogPostBySlug } from "@/lib/blog";

const post = getBlogPostBySlug("how-to-rotate-a-pdf-online")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
};

const faqs = [
  {
    q: "Why do PDFs end up sideways in the first place?",
    a: "Almost always a scanner or a document feeder. Feeders that flip paper automatically to scan both sides often flip every other page, so a stack of 10 pages can come out with half of them upside down or turned 90 degrees. It's a scanning quirk, not a problem with the PDF itself.",
  },
  {
    q: "Is rotating a PDF the same as flipping it?",
    a: "In everyday speech, yes — most people say \"flip the PDF\" when they mean turn a sideways or upside-down page the right way up, which is what rotating does. A true mirror-image flip (left-right reversed, like a reflection) is a different, much rarer thing to actually need.",
  },
  {
    q: "Do I need Adobe Acrobat to rotate a PDF?",
    a: "No — rotation just changes the page's orientation metadata, not the actual content, so any free browser-based tool can do it without installing anything or paying for a subscription.",
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

export default function RotatePdfGuidePage() {
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
          <span className="text-ink">How to Rotate a PDF Online</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">Published {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-8 space-y-6 leading-relaxed text-ink">
          <p>
            A sideways PDF is one of the most common small annoyances with scanned paperwork —
            and one of the least understood. It looks like something went wrong with the file.
            In reality, the file is fine; only the page's orientation flag is wrong, which is a
            one-second fix once you know what tool actually does it.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">Why this happens</h2>
          <p>
            Most sideways or upside-down PDFs come from a scanner, not from how the document was
            created. Document feeders that scan both sides of a page automatically often flip
            every other sheet to do it, so a stack of paper that looked perfectly normal on the
            table comes out of the scanner with alternating pages rotated 180 degrees. Phone
            scanning apps cause the same thing when a page is photographed at a slight angle and
            the app guesses the orientation wrong.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">What "rotating" actually changes</h2>
          <p>
            Rotating a PDF page doesn't touch the actual content — the text, images, and layout
            stay exactly as they were recorded. What changes is a small piece of metadata on each
            page that tells a viewer which way is "up." Because nothing is being re-rendered or
            recompressed, rotating a PDF doesn't cost you any quality or increase the file size —
            it's a metadata change, not a content change.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">How to fix it online</h2>
          <p>
            Open the file in{" "}
            <Link href="/tools/rotate-pdf" className="text-signal underline">Rotate PDF</Link>,
            pick the direction (90, 180, or 270 degrees), and every page in the file turns
            together. The whole thing runs in your browser tab — the file never gets uploaded to
            a server, so it works for private documents too, and there's nothing to install.
          </p>
          <p>
            If only some pages are sideways and others aren't, the fastest fix is usually to
            rotate the whole document to fix the majority, then treat the odd ones out as a
            separate small batch — mixed per-page rotation in a single pass is a feature some
            tools don't yet support, so it's worth checking the FAQ on the tool page for exactly
            what's supported today.
          </p>

          <h2 className="font-display text-xl font-semibold text-ink">"Flip" vs. "rotate"</h2>
          <p>
            A lot of people search for "flip a PDF" when what they actually want is to turn a
            sideways or upside-down page the right way up — that's rotation, and it's what most
            people mean by "flip" in everyday conversation. A true flip, in the strict sense, is
            a mirror-image reversal (left and right swapped, like a reflection), which is a
            different and much less common thing to need. If a page just looks sideways or
            upside down, rotating is almost always the fix you're actually looking for.
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
            <Link href="/tools/rotate-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Rotate PDF</Link>
            <Link href="/tools/crop-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Crop PDF</Link>
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
