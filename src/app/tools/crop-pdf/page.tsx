import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { CropPdfClient } from "./CropPdfClient";

export const metadata: Metadata = {
  title: "Crop PDF Online Free — Trim Page Margins",
  description: "Trim the margins on every page of a PDF, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/crop-pdf" },
};

const faqs = [
  {
    q: "Does cropping delete part of my content, or just hide it?",
    a: "It genuinely trims the page — the cropped area is removed from the PDF's page boundaries, not just hidden behind a mask.",
  },
  {
    q: "Can I crop each page differently?",
    a: "This tool trims the same margin evenly across every page in one pass, which covers the common case of uniform margins or scan borders. Page-by-page cropping isn't available yet.",
  },
  {
    q: "Will cropping affect the file size?",
    a: "Usually only slightly — you're removing margin space, not recompressing the actual content, so don't expect a big size reduction from this tool specifically (Compress PDF is built for that).",
  },
];

export default function CropPdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Crop PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Crop PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Trim white space or unwanted margins evenly from every page of a PDF using a single slider.
          Useful for cleaning up the wide borders a scanner often leaves around a page before
          printing or sharing.
        </p>

        <div className="mt-8">
          <CropPdfClient />
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
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
            <Link href="/tools/compress-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
