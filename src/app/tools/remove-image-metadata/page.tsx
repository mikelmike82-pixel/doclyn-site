import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { RemoveMetadataClient } from "./RemoveMetadataClient";

export const metadata: Metadata = {
  title: "Remove EXIF Data From Photos — Free Online",
  description: "Strip EXIF, GPS location, and camera data from a photo online free, before you share it. No signup — runs in your browser.",
  alternates: { canonical: "/tools/remove-image-metadata" },
};

const faqs = [
  {
    q: "What exactly gets removed?",
    a: "EXIF data — things like the exact GPS location where the photo was taken, the camera or phone model, the date and time, and other technical details your camera embeds automatically without you seeing them.",
  },
  {
    q: "Does this change how the photo looks?",
    a: "No — only the hidden metadata is stripped; the visible image itself is untouched.",
  },
  {
    q: "Why would I need to do this before sharing a photo?",
    a: "Photos taken on a phone often carry your exact location baked in. Stripping that out before posting online or sending to someone you don't fully trust is a simple way to avoid sharing more than you meant to.",
  },
];

export default function RemoveMetadataPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Remove Image Metadata</span>
        </nav>

        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Remove Image Metadata</h1>
        <p className="mt-2 max-w-xl text-muted">
          Photos often carry the exact location, camera model, and timestamp they were taken with.
          Strip it before you post or send the file — worth doing before posting a photo publicly
          or selling one online, since that hidden data travels with the file by default.
        </p>

        <div className="mt-8">
          <RemoveMetadataClient />
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
            <Link href="/tools/resize-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Resize Image</Link>
            <Link href="/tools/image-enhancer" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Image Enhancer</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
