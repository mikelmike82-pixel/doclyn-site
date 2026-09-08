import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { PageNumbersClient } from "./PageNumbersClient";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online Free",
  description: "Number every page of a PDF, free and online. Choose the position and starting number. Runs entirely in your browser.",
  alternates: { canonical: "/tools/add-page-numbers" },
};

const faqs = [
  {
    q: "Can I start numbering from something other than 1?",
    a: "Yes — set any starting number, which is useful if this document continues from another one, like an appendix.",
  },
  {
    q: "Where can the page number go?",
    a: "Bottom-center, bottom-right, bottom-left, or top-center — pick whichever position fits your document's existing layout.",
  },
  {
    q: "Will it number pages that already have a header or footer?",
    a: "Yes — the number is stamped on top of the existing page content in the position you choose, so check the preview if your page already has something in that corner.",
  },
];

export default function PageNumbersPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Add Page Numbers</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Add Page Numbers</h1>
        <p className="mt-2 max-w-xl text-muted">
          Stamp a page number on every page. Pick where it sits and what number the first page
          should start on. Commonly needed for a thesis, manuscript, or any report a school or
          publisher expects to be numbered.
        </p>

        <div className="mt-8">
          <PageNumbersClient />
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
            <Link href="/tools/watermark-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Watermark PDF</Link>
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
            <Link href="/tools/merge-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Merge PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
