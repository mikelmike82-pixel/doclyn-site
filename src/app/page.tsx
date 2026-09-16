import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntentRouter } from "@/components/IntentRouter";
import { ToolCard } from "@/components/ToolCard";
import { HeroVisual } from "@/components/HeroVisual";
import { getToolsByCategory } from "@/lib/tools";

// Without this, the homepage had no canonical tag at all (it inherited
// nothing from the root layout) — a real gap, since every tool page has
// one but the homepage itself didn't.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Doclyn",
  url: "https://www.doclyn.me",
  description:
    "Free online tools to compress, merge, convert, and clean up PDFs and images in seconds. No signup, no uploads — everything runs right in your browser.",
};

export default function HomePage() {
  const pdfTools = getToolsByCategory("pdf");
  const imageTools = getToolsByCategory("image");
  const aiTools = getToolsByCategory("ai"); // empty today — the section below only renders once this isn't

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="text-center lg:text-left">
              <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Free PDF &amp; Image Tools — Simplified.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted lg:mx-0">
                Compress, merge, convert, and clean up PDFs and images in seconds — all of it free,
                with no signup, and without your file ever leaving your device.
              </p>
              <div className="mx-auto mt-8 max-w-xl lg:mx-0">
                <IntentRouter />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* PDF tools */}
        <section id="pdf" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">PDF</h2>
            <span className="text-sm text-muted">{pdfTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Image tools */}
        <section id="image" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Image</h2>
            <span className="text-sm text-muted">{imageTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imageTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* AI tools — hidden until at least one is actually live; see src/lib/tools.ts */}
        {aiTools.length > 0 && (
          <section id="ai" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-12">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">AI</h2>
              <span className="text-sm text-muted">{aiTools.length} tools</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aiTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Privacy */}
        <section id="privacy" className="border-y border-line bg-surface">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">Private by design</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Whenever you see &ldquo;Processes on your device,&rdquo; it means exactly that — your
              file is compressed, converted, or edited using your own browser&apos;s power. Nothing
              is uploaded, nothing is stored, and we can&apos;t see it even if we wanted to. Every
              tool on Doclyn works this way today — if a future tool ever needs a server instead,
              it will say so plainly before you use it.
            </p>
          </div>
        </section>

        {/* Why us */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            {[
              { title: "Fast", body: "Most tools finish before a page would even finish loading elsewhere." },
              { title: "Private", body: "Browser-side processing by default, clearly labeled when it isn't." },
              { title: "No signup", body: "The core tools just work. No account required to get a file done." },
              { title: "No watermarks", body: "Your file comes back exactly as you made it — nothing added." },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
