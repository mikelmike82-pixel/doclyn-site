"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface PdfPagePreviewProps {
  // Blob (not just File) so this can preview an original upload or a
  // freshly-generated PDF result the same way.
  file: Blob;
  className?: string;
  scale?: number;
  label?: string;
  // Optional inline style — used by tools like Rotate PDF to visually spin
  // the preview to match the rotation the person picked, before they commit.
  style?: CSSProperties;
}

// Renders page 1 of a PDF to a thumbnail image, entirely in the browser.
// Reuses the exact same pdfjs-dist + CDN-hosted-worker pattern already used
// in PdfToJpgClient.tsx and CompressPdfClient.tsx — loaded dynamically so
// the rendering engine only ships to people who open a tool that needs it,
// and the worker comes from a CDN because any local reference to that file
// breaks the Next.js production build (see the comment in PdfToJpgClient.tsx).
export function PdfPagePreview({
  file,
  className = "h-56 w-full rounded-lg border border-line bg-canvas object-contain",
  scale = 0.6,
  label,
  style,
}: PdfPagePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setStatus("loading");
    setUrl(null);

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const data = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas context");
        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
        if (cancelled) return;
        if (!blob) {
          setStatus("error");
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    render();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, scale]);

  if (status === "loading") {
    return (
      <div className={`${className} flex items-center justify-center text-center text-xs text-muted`} style={style}>
        Loading preview…
      </div>
    );
  }

  // A preview that fails to render (an encrypted or unusual PDF) shouldn't
  // block the rest of the tool — the actual processing step already has
  // its own, more specific error handling. Just quietly show nothing here.
  if (status === "error" || !url) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={label ?? "Preview of the first page"} className={className} style={style} />
  );
}
