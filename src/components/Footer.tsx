import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <LogoMark className="h-5 w-5 text-ink" />
              Doclyn
            </div>
            <p className="mt-1 max-w-xs">
              File tools that respect your time and your files. No signup for the basics, no watermarks, ever.
            </p>
            <a
              href="https://www.producthunt.com/products/doclyn?utm_source=other&utm_medium=social"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-signal hover:text-ink"
            >
              <svg viewBox="0 0 40 40" className="h-4 w-4 text-[#DA552F]" fill="currentColor" aria-hidden="true">
                <circle cx="20" cy="20" r="20" />
                <path
                  d="M21.4 19.2h-4.5v-4.8h4.5a2.4 2.4 0 0 1 0 4.8Zm0-8.4h-8.1v18h3.6v-6h4.5a6 6 0 1 0 0-12Z"
                  fill="#fff"
                />
              </svg>
              Featured on Product Hunt
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mb-2 font-medium text-ink">Product</div>
              <ul className="space-y-1.5">
                <li><Link href="/#pdf" className="hover:text-ink">PDF tools</Link></li>
                <li><Link href="/#image" className="hover:text-ink">Image tools</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-2 font-medium text-ink">Company</div>
              <ul className="space-y-1.5">
                <li><Link href="/privacy" className="hover:text-ink">Privacy policy</Link></li>
                <li><Link href="/terms" className="hover:text-ink">Terms</Link></li>
                <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-1 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Doclyn. Built in public.</span>
          <span>
            Tool designed by IA Perma. For more or upgrades, contact{" "}
            <a href="https://www.iaperma.com" target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">
              www.iaperma.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
