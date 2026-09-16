import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Doclyn handles your files and data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: this is a starting draft — have a lawyer review it before launch.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-lg font-semibold">Tools marked &ldquo;Processes on your device&rdquo;</h2>
            <p className="mt-2 text-muted">
              For these tools (including Compress Image today), your file is never uploaded to
              Doclyn or any third party. All processing happens locally in your browser using
              standard web technology. We have no copy of your file at any point and cannot
              access it, because it never reaches our servers.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold">Tools that require a server</h2>
            <p className="mt-2 text-muted">
              Some tools — such as PDF-to-Word conversion or the AI features — genuinely require
              sending your file or its text to a server for processing. When that&apos;s the
              case, the tool page says so explicitly before you use it. Files sent for
              processing are automatically deleted from our servers within a short, defined
              window (target: 1 hour) and are never used to train any AI model.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold">Analytics</h2>
            <p className="mt-2 text-muted">
              We use lightweight, privacy-respecting analytics to understand which tools are
              useful and where things break. This does not include the contents of your files.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold">Contact</h2>
            <p className="mt-2 text-muted">
              Questions about this policy can be sent through the <a href="/contact" className="text-signal underline">contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
