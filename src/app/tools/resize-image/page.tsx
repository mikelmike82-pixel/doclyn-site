import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResizeImageClient } from "./ResizeImageClient";

export const metadata: Metadata = {
  title: "Resize Image Online Free — Change Dimensions",
  description: "Resize a JPG, PNG, or WebP to an exact width and height, free online. No signup, no watermark — runs in your browser.",
  alternates: { canonical: "/tools/resize-image" },
};

export default function ResizeImagePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Resize Image</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Resize Image</h1>
        <p className="mt-2 max-w-xl text-muted">
          Set an exact width and height, or lock the aspect ratio and adjust just one.
        </p>

        <div className="mt-8">
          <ResizeImageClient />
        </div>

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/tools/compress-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress Image</Link>
            <Link href="/tools/remove-image-metadata" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Remove Image Metadata</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
