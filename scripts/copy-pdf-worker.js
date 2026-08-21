// Runs automatically after `npm install` (see package.json "postinstall").
//
// Why this exists: pdfjs-dist's worker file (pdf.worker.min.mjs) is a real ES
// module with top-level `import`/`export` statements. The PDF tools used to
// reference it with `new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url)`,
// which tells Next.js's build-time bundler to statically locate and process
// that file as a bundled asset. Next's production build then tries to parse
// it with a loader that doesn't expect module syntax, and the build fails
// with "'import', and 'export' cannot be used outside of module".
//
// The fix: copy the worker file into /public as a plain static file, and
// reference it at runtime with a plain string path ("/pdf.worker.min.mjs").
// A file in /public is never parsed or bundled by webpack/SWC at all — it's
// just served as-is, byte for byte, exactly like an image or a font would be.
// This also means the worker is still served from doclyn.me itself, not a
// third-party CDN, which matches the "nothing leaves your device except the
// tool code itself" privacy story.
//
// This script only copies bytes with Node's fs API — it never parses the
// worker file as JavaScript, so it can't hit the module-syntax problem above.

const fs = require("fs");
const path = require("path");

const source = path.join(
  __dirname,
  "..",
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs"
);
const destDir = path.join(__dirname, "..", "public");
const dest = path.join(destDir, "pdf.worker.min.mjs");

if (!fs.existsSync(source)) {
  console.warn(
    "[copy-pdf-worker] Couldn't find pdfjs-dist's worker file at " +
      source +
      " — skipping copy. PDF to JPG and Compress PDF will not work until this runs successfully."
  );
  process.exit(0);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(source, dest);
console.log("[copy-pdf-worker] Copied pdf.worker.min.mjs into /public.");
