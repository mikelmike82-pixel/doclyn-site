import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WatermarkPdfClient } from "./WatermarkPdfClient";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online Free",
  description: "Stamp a custom text watermark across every page of a PDF, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/watermark-pdf" },
};

export default function WatermarkPdfPage() {
  return (
    <>
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
          across every page. Adjust the size and how see-through it is.
        </p>

        <div className="mt-8">
          <WatermarkPdfClient />
        </div>

        <section className="mt-16">
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
