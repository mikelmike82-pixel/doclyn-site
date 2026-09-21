import Link from "next/link";
import { LogoMark } from "./LogoMark";

export function Header() {
  return (
    <header className="border-b border-line bg-canvas/80 backdrop-blur supports-[backdrop-filter]:bg-canvas/60 sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded text-ink">
          <LogoMark className="h-6 w-6 text-ink" />
          <span className="font-display text-xl font-semibold tracking-tight">Doclyn</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
          <Link href="/#pdf" className="focus-ring rounded hover:text-ink">
            PDF
          </Link>
          <Link href="/#image" className="focus-ring rounded hover:text-ink">
            Image
          </Link>
          <Link href="/#privacy" className="focus-ring rounded hover:text-ink">
            Privacy
          </Link>
          <Link href="/blog" className="focus-ring rounded hover:text-ink">
            Blog
          </Link>
        </nav>
        <Link
          href="/#pdf"
          className="focus-ring rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-signal"
        >
          Open a tool
        </Link>
      </div>
    </header>
  );
}
