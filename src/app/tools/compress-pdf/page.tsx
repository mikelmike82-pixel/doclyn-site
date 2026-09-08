import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { CompressPdfClient } from "./CompressPdfClient";

export const metadata: Metadata = {
  title: "Compress PDF Online Free — Reduce File Size",
  description: "Compress PDF files online free by recompressing each page — best for scans and image-heavy PDFs. No signup, runs in your browser.",
  alternates: { canonical: "/tools/compress-pdf" },
};

const faqs = [
  {
    q: "How does this actually shrink the file?",
    a: "Each page is rendered as an image and recompressed at your chosen quality, then rebuilt into a new PDF. That's what makes scanned documents and photo-heavy PDFs shrink a lot — most of their size is images to begin with.",
  },
  {
    q: "Will my text still be selectable and searchable?",
    a: "No — after this tool, every page is an image, including any text on it. If you need to keep text selectable, this isn't the right tool for that file; use it for scans and image-heavy documents instead.",
  },
  {
    q: "What if the result is bigger than the original?",
    a: "That happens with PDFs that were already mostly text and small to begin with — flattening them to images can add size instead of removing it. The tool tells you plainly when that happens instead of pretending it worked.",
  },
];

export default function CompressPdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Compress PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Compress PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Best for scanned documents and PDFs full of photos. Each page is recompressed as an
          image — real savings, with one honest tradeoff below. Built for the common case of
          needing a PDF under an email attachment limit or an online form&apos;s upload cap.
        </p>

        <div className="mt-8">
          <CompressPdfClient />
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
            <Link href="/tools/pdf-to-jpg" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">PDF to JPG</Link>
            <Link href="/tools/merge-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Merge PDF</Link>
            <Link href="/tools/crop-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Crop PDF</Link>
            <Link href="/tools/document-compressor" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Document Compressor</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
