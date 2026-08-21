import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplitPdfClient } from "./SplitPdfClient";

export const metadata: Metadata = {
  title: "Split PDF — Extract or Delete Pages From a PDF Online",
  description: "Keep specific pages, or delete specific pages — either way, out in your browser. No upload, no signup.",
  alternates: { canonical: "/tools/split-pdf" },
};

export default function SplitPdfPage() {
  return (
    <>
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
          whichever is faster for what you&apos;re doing.
        </p>

        <div className="mt-8">
          <SplitPdfClient />
        </div>

        <section className="mt-16">
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
