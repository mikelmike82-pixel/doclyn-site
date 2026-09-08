import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { WatermarkPdfClient } from "./WatermarkPdfClient";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online Free",
  description: "Stamp a custom text watermark across every page of a PDF, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/watermark-pdf" },
};

const faqs = [
  {
    q: "Can I change the watermark text to anything I want?",
    a: "Yes — type whatever text you like, not just \"DRAFT\" or \"CONFIDENTIAL\"; a company name, a date, or a custom note all work the same way.",
  },
  {
    q: "Does the watermark cover up my content?",
    a: "You control the opacity, so you can make it as subtle or as bold as you need — light enough to stay in the background, or dark enough to be unmissable.",
  },
  {
    q: "Is the watermark added to every page automatically?",
    a: "Yes — it's stamped diagonally across every page of the PDF in one pass; there's no need to repeat it page by page.",
  },
];

export default function WatermarkPdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Watermark PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Watermark PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Add a text watermark — like &ldquo;DRAFT&rdquo; or &ldquo;CONFIDENTIAL&rdquo; — diagonally
          across every page. Adjust the size and how see-through it is. Useful for marking up a
          contract draft before a client sees the final version, or protecting a portfolio PDF
          you&apos;re sharing publicly.
        </p>

        <div className="mt-8">
          <WatermarkPdfClient />
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
            <Link href="/tools/add-page-numbers" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Add Page Numbers</Link>
            <Link href="/tools/rotate-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Rotate PDF</Link>
            <Link href="/tools/merge-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Merge PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
