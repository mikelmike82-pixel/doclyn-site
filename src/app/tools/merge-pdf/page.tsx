import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MergePdfClient } from "./MergePdfClient";

export const metadata: Metadata = {
  title: "Merge PDF — Combine PDF Files Online",
  description: "Combine multiple PDFs into one file, in the order you choose. Runs entirely in your browser — no upload, no signup.",
  alternates: { canonical: "/tools/merge-pdf" },
};

export default function MergePdfPage() {
  return (
    <>
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
          <h2 className="font-display text-xl font-semibold text-ink">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/tools/split-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Split PDF</Link>
            <Link href="/tools/jpg-to-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">JPG to PDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
