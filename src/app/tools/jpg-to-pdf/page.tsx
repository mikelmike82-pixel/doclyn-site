import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { JpgToPdfClient } from "./JpgToPdfClient";

export const metadata: Metadata = {
  title: "JPG to PDF Converter — Free, No Signup",
  description: "Convert JPG, PNG, or WebP images to PDF free online — one page per image, no signup, no watermark. Runs right in your browser.",
  alternates: { canonical: "/tools/jpg-to-pdf" },
};

const faqs = [
  {
    q: "Can I combine multiple images into one PDF?",
    a: "Yes — add as many JPG, PNG, or WebP images as you like and they'll become one PDF, one image per page, in the order you add them.",
  },
  {
    q: "Does the image quality change when it becomes a PDF?",
    a: "No — each image is placed into the PDF at its original resolution and quality; nothing is recompressed.",
  },
  {
    q: "Can I reorder the images before converting?",
    a: "Yes — arrange them in whatever order you want before you convert; the page order in the final PDF follows exactly.",
  },
];

export default function JpgToPdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">JPG to PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">JPG to PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Add one or more images — JPG, PNG, or WebP — and get back a single PDF, one image per page.
          Great for turning phone photos of receipts into a PDF for an expense report, or combining
          scanned pages into one document.
        </p>

        <div className="mt-8">
          <JpgToPdfClient />
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
