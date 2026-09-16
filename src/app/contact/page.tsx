import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Doclyn team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-ink">Contact</h1>
        <p className="mt-4 text-muted">
          Found a bug, or a tool that didn&apos;t work the way you expected? That&apos;s exactly
          the kind of thing worth telling us about.
        </p>
        <p className="mt-4 text-ink">
          Email: <a href="mailto:iaperma63@gmail.com" className="text-signal underline">iaperma63@gmail.com</a>
        </p>
      </main>
      <Footer />
    </>
  );
}
