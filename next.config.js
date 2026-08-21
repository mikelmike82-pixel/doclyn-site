/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // No ESLint config is bundled in this starter yet — don't let a missing
    // lint setup block the production build on Vercel.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // pdfjs-dist ships as a real ES module. Even though it's only ever
    // imported dynamically inside "use client" components (PdfToJpgClient,
    // CompressPdfClient), Next still walks that module graph while
    // collecting page data for the server build — and its CommonJS-based
    // bundler can't parse pdfjs-dist's import/export syntax, which is what
    // caused the "'import', and 'export' cannot be used outside of module"
    // build failure. Listing it here tells Next to leave it as a plain
    // require()/import() resolved at runtime instead of trying to bundle
    // it, which Node handles fine on its own.
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
};

module.exports = nextConfig;
