import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PdfToJpgClient } from "./PdfToJpgClient";

export const metadata: Metadata = {
  title: "PDF to JPG — Export PDF Pages as Images",
  description: "Turn every page of a PDF into its own JPG image, right in your browser.",
  alternates: { canonical: "/tools/pdf-to-jpg" },
};

export default function PdfToJpgPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">PDF to JPG</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">PDF to JPG</h1>
        <p className="mt-2 max-w-xl text-muted">
          Upload a PDF and get back a JPG of every page, ready to download individually.
        </p>

        <div className="mt-8">
          <PdfToJpgClient />
        </div>

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/tools/jpg-to-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">JPG to PDF</Link>
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
