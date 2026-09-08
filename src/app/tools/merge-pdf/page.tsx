import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { MergePdfClient } from "./MergePdfClient";

export const metadata: Metadata = {
  title: "Merge PDF Online Free — Combine PDF Files",
  description: "Merge PDF files online free, in any order you choose. No signup, no upload, no watermark — combines your PDFs right in your browser.",
  alternates: { canonical: "/tools/merge-pdf" },
};

const faqs = [
  {
    q: "Is there a limit to how many PDFs I can merge?",
    a: "No hard limit from the tool itself — it's limited by what your browser's memory can handle, which in practice is plenty for merging dozens of typical PDFs at once.",
  },
  {
    q: "Can I control the order of the merged pages?",
    a: "Yes — arrange your uploaded PDFs in whatever order you want before merging; the final file follows that exact order, page for page.",
  },
  {
    q: "Does merging PDFs upload my files anywhere?",
    a: "No — everything happens in your browser using the same technique as every other tool on Doclyn; your files never leave your device.",
  },
];

export default function MergePdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Merge PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Merge PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Add two or more PDFs, arrange them in upload order, and combine them into a single file.
          Handy for combining scanned pages, merging PDF invoices for accounting, or putting
          together a multi-file report before you submit it.
        </p>

        <div className="mt-8">
          <MergePdfClient />
        </div>

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink">How it works</h2>
          <p className="mt-2 text-sm text-muted">
            Your browser reads each PDF&apos;s pages directly and rebuilds a new PDF containing all
            of them, in order — the files never leave your device.
          </p>
        </section>

        <section className="mt-10">
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
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
            <Link href="/tools/jpg-to-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">JPG to PDF</Link>
            <Link href="/tools/rotate-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Rotate PDF</Link>
            <Link href="/tools/add-page-numbers" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Add Page Numbers</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
