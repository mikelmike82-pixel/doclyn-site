import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://doclyn.me"),
  title: {
    default: "Doclyn — Your files. Simplified.",
    template: "%s | Doclyn",
  },
  description:
    "Compress, convert, and clean up PDFs and images in seconds. Fast, private tools that run in your browser — no signup, no watermarks.",
  openGraph: {
    title: "Doclyn — Your files. Simplified.",
    description:
      "Compress, convert, and clean up PDFs and images in seconds. Fast, private tools that run in your browser.",
    siteName: "Doclyn",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
