"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { ResultCard } from "@/components/ResultCard";

interface Result {
  blob: Blob;
  fileName: string;
  url: string;
  grew: boolean;
}

// This works by rendering every page to an image and recompressing it —
// the only way to actually shrink a PDF's embedded photos/scans without a
// server. Real tradeoff, stated plainly on the page: text becomes part of
// the image, so it's no longer selectable or searchable afterward. Good
// for scanned documents and image-heavy PDFs; not the right tool for a
// text report you need to keep searchable.
async function compressPdf(file: File, quality: number): Promise<{ blob: Blob; grew: boolean }> {
  const pdfjsLib = await import("pdfjs-dist");
  // See scripts/copy-pdf-worker.js — the worker is copied into /public at
  // install time and served as a plain static file so Next's build never
  // has to parse its ES module syntax.
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const originalBytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: originalBytes }).promise;
  const outDoc = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser doesn't support canvas rendering.");
    await page.render({ canvasContext: ctx, viewport }).promise;

    const jpegBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality / 100)
    );
    if (!jpegBlob) throw new Error(`Couldn't process page ${pageNumber}.`);

    const jpegBytes = await jpegBlob.arrayBuffer();
    const embedded = await outDoc.embedJpg(jpegBytes);
    const outPage = outDoc.addPage([viewport.width, viewport.height]);
    outPage.drawImage(embedded, { x: 0, y: 0, width: viewport.width, height: viewport.height });
  }

  const outBytes = await outDoc.save();
  const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
  return { blob, grew: blob.size >= file.size };
}

export function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(65);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function run(targetFile: File, targetQuality: number) {
    setStatus("processing");
    setErrorMessage(null);
    try {
      const { blob, grew } = await compressPdf(targetFile, targetQuality);
      const base = targetFile.name.replace(/\.pdf$/i, "");
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { blob, url: URL.createObjectURL(blob), fileName: `${base}-compressed.pdf`, grew };
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Couldn't process that PDF — it may be encrypted or corrupted."
      );
    }
  }

  function handleFiles(newFiles: File[]) {
    const newFile = newFiles[0];
    if (!newFile) return;
    if (newFile.type !== "application/pdf") {
      setStatus("error");
      setErrorMessage("That doesn't look like a PDF.");
      return;
    }
    setFile(newFile);
    setResult(null);
    run(newFile, quality);
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  function handleQualityChange(next: number) {
    setQuality(next);
    if (file) run(file, next);
  }

  if (result && file) {
    return (
      <div className="space-y-4">
        <ResultCard
          originalBytes={file.size}
          newBytes={result.blob.size}
          fileName={result.fileName}
          downloadUrl={result.url}
          onReset={handleReset}
        />
        {result.grew && (
          <p className="rounded-lg border border-line bg-gain-tint px-4 py-3 text-center text-sm text-gain">
            This PDF was already efficient — flattening it to images made it bigger, not smaller.
            It&apos;s probably a text-based PDF rather than a scan; this tool isn&apos;t the right
            fit for it. Try a lower quality below, or skip compressing this one.
          </p>
        )}

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="pdfQuality" className="font-medium text-ink">Quality</label>
            <span className="font-mono text-muted">{quality}</span>
          </div>
          <input
            id="pdfQuality"
            type="range"
            min={20}
            max={90}
            value={quality}
            onChange={(e) => handleQualityChange(Number(e.target.value))}
            className="mt-2 w-full accent-signal"
          />
          {status === "processing" && <p className="mt-3 text-xs text-muted">Recompressing…</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone accept="application/pdf" label="Drop a PDF here" hint="or click to choose a file" onFiles={handleFiles} />
      {status === "processing" && <p className="text-center text-sm text-muted">Compressing — this can take a moment for longer PDFs…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
