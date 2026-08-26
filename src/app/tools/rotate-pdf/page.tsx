import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RotatePdfClient } from "./RotatePdfClient";

export const metadata: Metadata = {
  title: "Rotate PDF Online Free — Fix Sideways Pages",
  description: "Rotate every page of a PDF 90, 180, or 270 degrees, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/rotate-pdf" },
};

export default function RotatePdfPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Rotate PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Rotate PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Fix pages that scanned in sideways or upside down. Pick a direction, and every page in
          the file rotates together.
        </p>

        <div className="mt-8">
          <RotatePdfClient />
        </div>

        <section className="mt-16">
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
