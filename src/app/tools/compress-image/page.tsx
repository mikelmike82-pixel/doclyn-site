import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompressImageClient } from "./CompressImageClient";

export const metadata: Metadata = {
  title: "Compress Image Online Free — Shrink JPG, PNG, WebP",
  description:
    "Compress a JPG, PNG, or WebP online free — no signup, no watermark, no upload. Runs in your browser and shrinks the file in seconds.",
  alternates: { canonical: "/tools/compress-image" },
};

const faqs = [
  {
    q: "Does my image get uploaded anywhere?",
    a: "No. This tool runs entirely in your browser using the Canvas API — the image is never sent to a server. You can disconnect from the internet after the page loads and it will still work.",
  },
  {
    q: "Will compressing reduce quality?",
    a: "Some quality loss is how compression saves space, but at the default setting it's rarely visible to the eye. Use the quality slider to trade off size against visual quality — higher quality keeps more detail at a larger file size.",
  },
  {
    q: "What file types are supported?",
    a: "JPG, PNG, and WebP as input. You can choose to keep the original format or convert to JPEG or WebP on the way out, since both usually compress better than PNG for photos.",
  },
];

export default function CompressImagePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Compress Image</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Compress Image</h1>
        <p className="mt-2 max-w-xl text-muted">
          Drop in a JPG, PNG, or WebP. We&apos;ll shrink it right here in your browser — nothing is
          uploaded.
        </p>

        <div className="mt-8">
          <CompressImageClient />
        </div>

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink">How it works</h2>
          <p className="mt-2 text-sm text-muted">
            Your browser decodes the image, redraws it at your chosen quality using the HTML
            Canvas API, and re-encodes it — the same underlying technique a desktop photo editor
            uses, just running locally on your device instead of on a server.
          </p>
        </section>

        <section className="mt-10">
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
            <Link href="/tools/resize-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Resize Image</Link>
            <Link href="/tools/jpg-to-pdf" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">JPG to PDF</Link>
            <Link href="/tools/remove-image-metadata" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Remove Image Metadata</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
