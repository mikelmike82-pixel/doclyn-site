import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { WordToPdfClient } from "./WordToPdfClient";

export const metadata: Metadata = {
  title: "Word to PDF Online Free — Convert .docx to PDF",
  description: "Convert a Word document to PDF, free online. No signup, no upload — the file is rendered and converted entirely in your browser.",
  alternates: { canonical: "/tools/word-to-pdf" },
};

const faqs = [
  {
    q: "Will the text in the PDF be selectable and searchable?",
    a: "No — the same honest tradeoff as Compress PDF. Your document is rendered to look right, then captured as an image and placed into the PDF, so every page is a picture of your document rather than real text. It looks correct and prints correctly, but you can't select or search the text afterward.",
  },
  {
    q: "Does it support .doc files (the older Word format)?",
    a: "No, only .docx — the modern Word format. If you have an older .doc file, open and re-save it as .docx in Word first.",
  },
  {
    q: "What formatting does it keep?",
    a: "Headings, bold/italic, lists, and basic images generally come through fine. Complex layouts — precise columns, tables with unusual formatting, headers and footers — may not look exactly like the original.",
  },
];

export default function WordToPdfPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Word to PDF</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Word to PDF</h1>
        <p className="mt-2 max-w-xl text-muted">
          Converts a .docx file to PDF, right in your browser. Looks and prints like the
          original — one honest tradeoff below. The usual case: turning a finished resume or
          cover letter into PDF before you email or upload it.
        </p>

        <div className="mt-8">
          <WordToPdfClient />
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
            <Link href="/tools/pdf-to-word" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">PDF to Word</Link>
            <Link href="/tools/merge-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Merge PDF</Link>
            <Link href="/tools/document-compressor" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Document Compressor</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
