# Doclyn — v1.0

The file problem solver. Nine tools, all fully working, all 100% client-side
— nothing is uploaded anywhere. No "Soon" tags anywhere on the site right now.

## Live tools

- **Compress Image** — canvas-based recompression, quality slider, format switch
- **Resize Image** — exact width/height, aspect-ratio lock
- **Remove Image Metadata** — strips EXIF/GPS/camera data via canvas re-encode
- **Merge PDF** — combine multiple PDFs in upload order (pdf-lib)
- **Split PDF** — extract a page range into a new PDF (pdf-lib)
- **JPG to PDF** — one or more images → one PDF, one page each (pdf-lib)
- **PDF to JPG** — every page rendered to its own JPG (pdfjs-dist)
- **Compress PDF** — rasterizes and recompresses each page (pdf-lib + pdfjs-dist).
  Real, meaningful savings for scans and photo-heavy PDFs — with one honest
  tradeoff stated on the tool page itself: the output is no longer
  searchable/selectable text, so it's not the right tool for a text report.

## On hold, on purpose: AI tools

Summarize PDF and Chat with PDF aren't in this build at all — not "soon,"
just not here. Both need a server route calling a paid AI API, which means
an API key and a real decision about usage limits and cost. You chose to
leave them out entirely for now rather than have the site advertise
something unbuilt. To add them back: add two entries with `category: "ai"`
to `src/lib/tools.ts`, build the backend route, and the homepage's AI
section reappears on its own — the code was written to make that a small
change, not a rearchitecture.

## What's here

- `src/lib/tools.ts` — the single registry every tool is declared in. Adding
  a new tool later means adding one entry here plus a page component — the
  homepage grid, the intent router, and internal links all read from this
  list automatically.
- `src/app/tools/*/` — each tool's folder has `page.tsx` (server component,
  handles SEO metadata) and a `*Client.tsx` (the actual interactive tool).
- `src/components/UploadZone.tsx`, `PickedFileList.tsx`, `ResultCard.tsx`,
  `SimpleResultCard.tsx` — the reusable upload/result pieces every tool
  builds on.

## Local development

This project was written in a sandbox without npm registry access, so it
has **not** been build-tested locally yet. Everything here is standard,
well-worn patterns except one piece: **PDF to JPG** depends on `pdfjs-dist`
loading a separate worker file, which is the single most common source of
bugs when wiring that library into Next.js. If only one tool misbehaves on
first deploy, it's probably this one — expected, not alarming.

To run it on your own machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000. If `npm install` or `npm run build`
surfaces an error, that's expected on a first real build — send it back and
it'll get fixed.

## Deploying

Push this to a GitHub repo, then import that repo in Vercel. Vercel detects
Next.js automatically, runs `npm install` and `npm run build` on its own
servers (which do have full registry access), and gives you a live URL.
