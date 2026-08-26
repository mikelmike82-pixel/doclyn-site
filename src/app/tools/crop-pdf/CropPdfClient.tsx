"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { SimpleResultCard } from "@/components/SimpleResultCard";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

export function CropPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [margin, setMargin] = useState(36); // points; 72pt = 1 inch
  const [status, setStatus] = useState<"idle" | "loading" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleFiles(newFiles: File[]) {
    const newFile = newFiles[0];
    if (!newFile) return;
    if (newFile.type !== "application/pdf") {
      setStatus("error");
      setErrorMessage("That doesn't look like a PDF.");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    try {
      const bytes = await newFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const first = pdf.getPage(0);
      setFile(newFile);
      setPageSize(first.getSize());
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't read that PDF — it may be encrypted or corrupted.");
    }
  }

  const maxMargin = pageSize ? Math.floor(Math.min(pageSize.width, pageSize.height) / 2) - 10 : 100;

  async function handleCrop() {
    if (!file) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const m = Math.min(margin, Math.floor(Math.min(width, height) / 2) - 5);
        const safeMargin = Math.max(0, m);
        page.setCropBox(safeMargin, safeMargin, width - safeMargin * 2, height - safeMargin * 2);
      });
      const outBytes = await pdf.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      setResult({ url: URL.createObjectURL(blob), fileName: `${base}-cropped.pdf`, size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong cropping that PDF.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setPageSize(null);
    setMargin(36);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (result) {
    return (
      <SimpleResultCard
        title="Cropped"
        fileName={result.fileName}
        fileSize={result.size}
        downloadUrl={result.url}
        onReset={handleReset}
        resetLabel="Crop another PDF"
      />
    );
  }

  if (file && pageSize) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium text-ink">{file.name}</p>
          <p className="text-xs text-muted">
            Page size {Math.round(pageSize.width)} × {Math.round(pageSize.height)}pt — margin trims evenly from all four sides
          </p>

          <div className="mt-4 flex items-center justify-between text-sm">
            <label htmlFor="margin" className="font-medium text-ink">Trim margin</label>
            <span className="font-mono text-muted">{margin}pt (~{(margin / 72).toFixed(2)}in)</span>
          </div>
          <input
            id="margin"
            type="range"
            min={0}
            max={Math.max(10, maxMargin)}
            value={Math.min(margin, Math.max(10, maxMargin))}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="mt-1 w-full accent-signal"
          />
          <p className="mt-1 text-xs text-muted">
            This changes the visible page boundary — it doesn&apos;t crop or move any content itself.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCrop}
          disabled={status === "processing"}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50"
        >
          {status === "processing" ? "Cropping…" : "Crop PDF"}
        </button>

        {errorMessage && (
          <p className="text-center text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone accept="application/pdf" label="Drop a PDF here" hint="or click to choose a file" onFiles={handleFiles} />
      {status === "loading" && <p className="text-center text-sm text-muted">Reading PDF…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
