import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RemoveMetadataClient } from "./RemoveMetadataClient";

export const metadata: Metadata = {
  title: "Remove EXIF Data From Photos — Free Online",
  description: "Strip EXIF, GPS location, and camera data from a photo online free, before you share it. No signup — runs in your browser.",
  alternates: { canonical: "/tools/remove-image-metadata" },
};

export default function RemoveMetadataPage() {
  return (
    <>
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
          Strip it before you post or send the file.
        </p>

        <div className="mt-8">
          <RemoveMetadataClient />
        </div>

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href="/tools/compress-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Compress Image</Link>
            <Link href="/tools/resize-image" className="rounded-full border border-line px-3 py-1.5 text-muted hover:border-signal hover:text-ink">Resize Image</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
