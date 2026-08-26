import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CropPdfClient } from "./CropPdfClient";

export const metadata: Metadata = {
  title: "Crop PDF Online Free — Trim Page Margins",
  description: "Trim the margins on every page of a PDF, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/crop-pdf" },
};

export default function CropPdfPage() {
  return (
    <>
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
        </p>

        <div className="mt-8">
          <CropPdfClient />
        </div>

        <section className="mt-16">
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
