import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { ImageEnhancerClient } from "./ImageEnhancerClient";

export const metadata: Metadata = {
  title: "Image Enhancer Online Free — Brightness, Contrast & Sharpen",
  description: "Adjust brightness, contrast, saturation, and sharpness with a live preview, free and online. No signup, runs entirely in your browser.",
  alternates: { canonical: "/tools/image-enhancer" },
};

const faqs = [
  {
    q: "Can this fix a blurry or low-resolution photo?",
    a: "No — it adjusts existing pixel values (brightness, contrast, saturation, sharpness), it doesn't invent new detail. A genuinely blurry or low-res photo will still look blurry or low-res, just possibly punchier.",
  },
  {
    q: "Does it work on any image format?",
    a: "JPG, PNG, and WebP all work — adjust with the live preview, then download the result in the same format you uploaded.",
  },
];

export default function ImageEnhancerPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Image Enhancer</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Image Enhancer</h1>
        <p className="mt-2 max-w-xl text-muted">
          Fine-tune brightness, contrast, saturation, and sharpness with a live preview, then
          download the result. Useful for brightening a dark photo or fixing washed-out colors
          before printing or sharing — not a fix for a genuinely blurry shot.
        </p>

        <div className="mt-8">
          <ImageEnhancerClient />
        </div>

        <section className="mt-16 space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">Good to know</h2>
          <div className="space-y-3 text-sm text-muted">
            <p>
              This is a real adjustment tool, not an AI upscaler — it works by shifting existing
              pixel values (like a camera app&apos;s edit screen), so it can make a photo look
              brighter, punchier, or crisper, but it can&apos;t add detail that isn&apos;t in the
              original file or fix a genuinely blurry or low-resolution photo.
            </p>
            <p>Because everything runs in your browser, nothing is uploaded anywhere.</p>
          </div>
        </section>

        <section className="mt-12">
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
            <Link href="/tools/compress-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress Image</Link>
            <Link href="/tools/remove-image-metadata" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Remove Image Metadata</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
