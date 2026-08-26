import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageNumbersClient } from "./PageNumbersClient";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online Free",
  description: "Number every page of a PDF, free and online. Choose the position and starting number. Runs entirely in your browser.",
  alternates: { canonical: "/tools/add-page-numbers" },
};

export default function PageNumbersPage() {
  return (
    <>
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
          should start on.
        </p>

        <div className="mt-8">
          <PageNumbersClient />
        </div>

        <section className="mt-16">
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
