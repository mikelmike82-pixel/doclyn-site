import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { SplitPdfClient } from "./SplitPdfClient";

export const metadata: Metadata = {
  title: "Split PDF Online Free — Extract or Delete Pages",
  description: "Split a PDF online free — keep the pages you need or delete the ones you don't. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/split-pdf" },
};

const faqs = [
  {
    q: "What's the difference between \"keep\" and \"delete\" pages?",
    a: "\"Keep\" lets you pick exactly the pages you want in the result and discards everything else; \"delete\" does the opposite — you pick the pages to remove and keep the rest. Same outcome, whichever is faster to select for your file.",
  },
  {
    q: "Can I split one PDF into several separate files?",
    a: "Yes — select different page ranges and download each as its own PDF, repeating as many times as you need.",
  },
  {
    q: "Will splitting affect the quality of my pages?",
    a: "No — pages are copied exactly as they are in the original file; nothing is re-rendered or recompressed.",
  },
  {
    q: "Is this the same as \"unmerge PDF\"?",
    a: "Yes — splitting a PDF back into separate files is often called unmerging it, especially when the pages were combined with a merge tool in the first place. This tool does that: pick the pages you want and save them out as their own PDF.",
  },
];

export default function SplitPdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Split PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Split PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Upload a PDF, then either keep only the pages you pick or delete the pages you pick —
          whichever is faster for what you&apos;re doing. Useful for pulling one page out of a long
          PDF to send separately, unmerging pages that were previously combined, or splitting a
          scanned document by chapter.
        </p>

        <div className="mt-8">
          <SplitPdfClient />
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
            <Link href="/tools/merge-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Merge PDF</Link>
            <Link href="/tools/pdf-to-jpg" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">PDF to JPG</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
