import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DocumentCompressorClient } from "./DocumentCompressorClient";

export const metadata: Metadata = {
  title: "Document Compressor Online Free — PDF, Word & Excel",
  description: "Reduce the file size of a PDF, Word (.docx), or Excel (.xlsx) document, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/document-compressor" },
};

const faqs = [
  {
    q: "How does this shrink a Word or Excel file?",
    a: "A .docx or .xlsx file is actually a zip archive full of XML plus any embedded photos. This tool recompresses those embedded photos — the same technique as Compress Image — and repacks the whole file more efficiently. It never touches your text, formatting, or formulas.",
  },
  {
    q: "How does this shrink a PDF?",
    a: "The same way the dedicated Compress PDF tool does: every page is rendered as an image and recompressed. That's the only way to meaningfully shrink a PDF without a server, and it means the text on those pages is no longer selectable afterward — the same honest tradeoff as Compress PDF.",
  },
  {
    q: "My Word or Excel file barely got smaller — why?",
    a: "If the document is mostly text with few or no embedded photos, there's simply not much to compress — the tool says so plainly instead of pretending it found savings that aren't there.",
  },
  {
    q: "What file types are supported?",
    a: "PDF (.pdf), Word (.docx), and Excel (.xlsx) today. Legacy .doc and .xls formats, and PowerPoint, aren't supported yet.",
  },
];

export default function DocumentCompressorPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Document Compressor</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Document Compressor</h1>
        <p className="mt-2 max-w-xl text-muted">
          Drop in a PDF, Word document, or Excel spreadsheet and shrink its file size — each
          format is compressed the right way for what it actually is, not with one fake
          one-size-fits-all trick.
        </p>

        <div className="mt-8">
          <DocumentCompressorClient />
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
            <Link href="/tools/compress-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress PDF</Link>
            <Link href="/tools/word-to-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Word to PDF</Link>
            <Link href="/tools/pdf-to-word" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">PDF to Word</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
