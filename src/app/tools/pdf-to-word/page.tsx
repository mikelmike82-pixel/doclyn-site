import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PdfToWordClient } from "./PdfToWordClient";

export const metadata: Metadata = {
  title: "PDF to Word Online Free — Extract Text to .docx",
  description: "Pull the text out of a PDF into an editable Word document, free online. No signup, no upload — runs entirely in your browser.",
  alternates: { canonical: "/tools/pdf-to-word" },
};

const faqs = [
  {
    q: "Will this keep my original formatting, tables, and images?",
    a: "No, and it's important you know that before you use it. This tool pulls out the actual text and lays it out as plain paragraphs in a real, editable .docx file — it doesn't reconstruct tables, images, columns, or exact fonts. Tools that do that reliably run heavy layout-analysis software on a server; a free, private, browser-only tool can't replicate that.",
  },
  {
    q: "What does it work well for, then?",
    a: "Getting the words out of a PDF so you can edit, copy, or reflow them — reports, articles, contracts, anything where the text itself is what you need. If you need the exact original layout preserved, this isn't the right tool for that.",
  },
  {
    q: "Why did I get a page with almost no text?",
    a: "That page is probably a scanned image rather than real text — a photo of a document has no text layer for any tool to extract, ours included. The tool marks that page plainly instead of pretending it found something.",
  },
];

export default function PdfToWordPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">PDF to Word</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">PDF to Word</h1>
        <p className="mt-2 max-w-xl text-muted">
          Extracts the real text from your PDF into an editable Word document — plain paragraphs,
          not a pixel-perfect copy. One honest tradeoff below.
        </p>

        <div className="mt-8">
          <PdfToWordClient />
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
            <Link href="/tools/word-to-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Word to PDF</Link>
            <Link href="/tools/compress-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress PDF</Link>
            <Link href="/tools/document-compressor" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Document Compressor</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
