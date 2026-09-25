import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { RotatePdfClient } from "./RotatePdfClient";

export const metadata: Metadata = {
  title: "Rotate PDF Online Free — Fix Sideways Pages",
  description: "Rotate every page of a PDF 90, 180, or 270 degrees, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/rotate-pdf" },
};

const faqs = [
  {
    q: "Can I rotate just one page instead of the whole document?",
    a: "Right now this tool rotates every page together, in one direction — it's built for the common case of a whole document that scanned in sideways. Mixed per-page rotation may come in a future update.",
  },
  {
    q: "Does rotating affect the file's quality or size?",
    a: "No — pages are rotated in place; nothing is re-rendered or recompressed, so quality and file size stay the same.",
  },
  {
    q: "Will the rotation stick when I open the file elsewhere?",
    a: "Yes — the rotation is written into the PDF itself, so it opens correctly in any PDF viewer, not just in a browser.",
  },
  {
    q: "Is this the same as \"flip PDF\"?",
    a: "Usually, yes — most people who search \"flip a PDF\" actually mean turning a sideways or upside-down page the right way up, which is exactly what this tool does. (A true mirror-image flip is a different effect and isn't what this tool does.)",
  },
];

export default function RotatePdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Rotate PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Rotate PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Fix pages that scanned in sideways or upside down — sometimes called flipping a PDF
          the right way up. Pick a direction, and every page in the file rotates together. Common
          after scanning a stack of paper through a document feeder that flips half the pages.
        </p>

        <div className="mt-8">
          <RotatePdfClient />
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
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
            <Link href="/tools/merge-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Merge PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
