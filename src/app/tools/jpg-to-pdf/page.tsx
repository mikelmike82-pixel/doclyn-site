import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JpgToPdfClient } from "./JpgToPdfClient";

export const metadata: Metadata = {
  title: "JPG to PDF — Convert Images to a PDF Online",
  description: "Turn one or more JPG, PNG, or WebP images into a single PDF, one page per image. Runs entirely in your browser.",
  alternates: { canonical: "/tools/jpg-to-pdf" },
};

export default function JpgToPdfPage() {
  return (
    <>
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
        </p>

        <div className="mt-8">
          <JpgToPdfClient />
        </div>

        <section className="mt-16">
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
