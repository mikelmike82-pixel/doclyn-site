"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { formatBytes } from "@/lib/formatBytes";

interface PageImage {
  pageNumber: number;
  url: string;
  size: number;
}

export function PdfToJpgClient() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFiles(newFiles: File[]) {
    const file = newFiles[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus("error");
      setErrorMessage("That doesn't look like a PDF.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setPages([]);
    setFileName(file.name);

    try {
      // Loaded dynamically so the (fairly large) PDF rendering engine only
      // ships to people who actually open this tool.
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const results: PageImage[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Your browser doesn't support canvas rendering.");
        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
        if (blob) {
          results.push({ pageNumber, url: URL.createObjectURL(blob), size: blob.size });
        }
      }

      setPages(results);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Couldn't render that PDF — it may be encrypted or corrupted."
      );
    }
  }

  function handleReset() {
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setPages([]);
    setFileName(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (pages.length > 0 && fileName) {
    const base = fileName.replace(/\.pdf$/i, "");
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">
          {pages.length} page{pages.length > 1 ? "s" : ""} from <span className="text-ink">{fileName}</span>
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {pages.map((page) => (
            <div key={page.pageNumber} className="rounded-lg border border-line bg-surface p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={page.url} alt={`Page ${page.pageNumber}`} className="w-full rounded" />
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-xs text-muted">
                  Page {page.pageNumber} · {formatBytes(page.size)}
                </span>
                <a
                  href={page.url}
                  download={`${base}-page-${page.pageNumber}.jpg`}
                  className="focus-ring text-xs font-medium text-signal hover:text-signal-dark"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="focus-ring w-full rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-signal"
        >
          Convert another PDF
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone accept="application/pdf" label="Drop a PDF here" hint="or click to choose a file" onFiles={handleFiles} />
      {status === "loading" && <p className="text-center text-sm text-muted">Rendering pages…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
