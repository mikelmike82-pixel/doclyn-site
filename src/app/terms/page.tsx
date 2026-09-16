import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Doclyn's tools.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: this is a starting draft — have a lawyer review it before launch.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-lg font-semibold">Using Doclyn</h2>
            <p className="mt-2 text-muted">
              Doclyn provides file conversion, compression, and AI-assisted document tools.
              Free tools are provided as-is, without warranty, for personal and business use.
              You are responsible for having the rights to any file you process.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold">Acceptable use</h2>
            <p className="mt-2 text-muted">
              Don&apos;t use Doclyn to process illegal content, to attempt to overload or abuse
              the service, or to attempt to extract or reverse engineer the underlying tools.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold">No guarantees</h2>
            <p className="mt-2 text-muted">
              File conversion and compression can occasionally produce unexpected results.
              Always keep a copy of your original file until you&apos;ve confirmed the output
              works for you.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
