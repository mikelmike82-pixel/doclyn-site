"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { SimpleResultCard } from "@/components/SimpleResultCard";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

export function WatermarkPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(60);
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
      setFile(newFile);
      setPageCount(pdf.getPageCount());
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't read that PDF — it may be encrypted or corrupted.");
    }
  }

  async function handleWatermark() {
    if (!file || !text.trim()) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity / 100,
          rotate: degrees(45),
        });
      });

      const outBytes = await pdf.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      setResult({ url: URL.createObjectURL(blob), fileName: `${base}-watermarked.pdf`, size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong adding that watermark.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setPageCount(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (result) {
    return (
      <SimpleResultCard
        title="Watermarked"
        fileName={result.fileName}
        fileSize={result.size}
        downloadUrl={result.url}
        onReset={handleReset}
        resetLabel="Watermark another PDF"
      />
    );
  }

  if (file && pageCount) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium text-ink">{file.name}</p>
          <p className="text-xs text-muted">{pageCount} pages</p>

          <label htmlFor="watermark-text" className="mt-4 block text-sm font-medium text-ink">
            Watermark text
          </label>
          <input
            id="watermark-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={60}
            className="focus-ring mt-1 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink"
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <label htmlFor="opacity" className="font-medium text-ink">Opacity</label>
            <span className="font-mono text-muted">{opacity}%</span>
          </div>
          <input
            id="opacity"
            type="range"
            min={10}
            max={80}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="mt-1 w-full accent-signal"
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <label htmlFor="font-size" className="font-medium text-ink">Size</label>
            <span className="font-mono text-muted">{fontSize}pt</span>
          </div>
          <input
            id="font-size"
            type="range"
            min={20}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="mt-1 w-full accent-signal"
          />
        </div>

        <button
          type="button"
          onClick={handleWatermark}
          disabled={status === "processing" || !text.trim()}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50"
        >
          {status === "processing" ? "Adding watermark…" : "Add watermark"}
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
