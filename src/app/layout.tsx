import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Google Analytics measurement ID for the doclyn.me property.
const GA_MEASUREMENT_ID = "G-T9M0KS9TVZ";

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
    default: "Doclyn — Free Online PDF & Image Tools, No Signup",
    template: "%s | Doclyn",
  },
  description:
    "Free online tools to compress, merge, convert, and clean up PDFs and images in seconds. No signup, no uploads — everything runs right in your browser.",
  openGraph: {
    title: "Doclyn — Free Online PDF & Image Tools, No Signup",
    description:
      "Free online tools to compress, merge, convert, and clean up PDFs and images in seconds — right in your browser, no signup required.",
    siteName: "Doclyn",
    type: "website",
  },
  verification: {
    // Confirms ownership of doclyn.me to Google Search Console — lets Google
    // know the sitemap exists and starts crawling. Next.js renders this into
    // a <meta name="google-site-verification" ...> tag in the page <head>
    // automatically; no need to hand-write the tag itself.
    google: "OhobcD8xSej4oXHJElrvxPmjCvifHSPI2f9W67SiI_s",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        {/* Loaded after the page is interactive so it never delays the
            tools themselves — analytics only records that a page was
            visited, never anything about the files people process. */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
