import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { ResizeImageClient } from "./ResizeImageClient";

export const metadata: Metadata = {
  title: "Resize Image Online Free — Change Dimensions",
  description: "Resize a JPG, PNG, or WebP to an exact width and height, free online. No signup, no watermark — runs in your browser.",
  alternates: { canonical: "/tools/resize-image" },
};

const faqs = [
  {
    q: "Will resizing stretch or distort my image?",
    a: "Only if you unlock the aspect ratio and set a width/height that doesn't match the original proportions. Leave the aspect ratio locked and the image scales cleanly with no distortion.",
  },
  {
    q: "Can I make an image bigger, not just smaller?",
    a: "Yes, but keep in mind enlarging an image doesn't add real detail — it stretches the existing pixels, so very large increases can look soft. It's best for modest size changes in either direction.",
  },
  {
    q: "Does resizing reduce file size too?",
    a: "Usually yes, since a smaller image has fewer pixels to store — but if you want to shrink file size without changing the dimensions, Compress Image is the better tool for that.",
  },
];

export default function ResizeImagePage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Resize Image</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Resize Image</h1>
        <p className="mt-2 max-w-xl text-muted">
          Set an exact width and height, or lock the aspect ratio and adjust just one. Useful for
          getting a photo to the exact dimensions Instagram, a passport application, or LinkedIn
          expects.
        </p>

        <div className="mt-8">
          <ResizeImageClient />
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
            <Link href="/tools/compress-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress Image</Link>
            <Link href="/tools/remove-image-metadata" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Remove Image Metadata</Link>
            <Link href="/tools/image-enhancer" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Image Enhancer</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
