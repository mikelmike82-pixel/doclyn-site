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

function parsePageRanges(input: string, pageCount: number): number[] {
  const indices = new Set<number>();
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      let start = parseInt(rangeMatch[1], 10);
      let end = parseInt(rangeMatch[2], 10);
      if (start > end) [start, end] = [end, start];
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= pageCount) indices.add(i - 1);
      }
    } else if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n >= 1 && n <= pageCount) indices.add(n - 1);
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

type Mode = "keep" | "remove";

export function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [mode, setMode] = useState<Mode>("keep");
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
      setRangeInput(`1-${pdf.getPageCount()}`);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't read that PDF — it may be encrypted or corrupted.");
    }
  }

  async function handleSplit() {
    if (!file || !pageCount) return;
    const selected = parsePageRanges(rangeInput, pageCount);
    if (selected.length === 0) {
      setErrorMessage(`Enter page numbers between 1 and ${pageCount}, e.g. "1-3, 5".`);
      return;
    }
    const indices =
      mode === "keep"
        ? selected
        : Array.from({ length: pageCount }, (_, i) => i).filter((i) => !selected.includes(i));
    if (indices.length === 0) {
      setErrorMessage("That would remove every page — leave at least one page in the result.");
      return;
    }
    setStatus("processing");
    setErrorMessage(null);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));
      const outBytes = await out.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      const suffix = mode === "keep" ? "pages" : "trimmed";
      setResult({ url: URL.createObjectURL(blob), fileName: `${base}-${suffix}.pdf`, size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong splitting that PDF.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setPageCount(null);
    setRangeInput("");
    setMode("keep");
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (result) {
    return (
      <SimpleResultCard
        title="Ready"
        fileName={result.fileName}
        fileSize={result.size}
        downloadUrl={result.url}
        onReset={handleReset}
        resetLabel="Split another PDF"
      />
    );
  }

  if (file && pageCount) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium text-ink">{file.name}</p>
          <p className="text-xs text-muted">{pageCount} pages</p>

          <div className="mt-4 flex rounded-full border border-line bg-canvas p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("keep")}
              className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                mode === "keep" ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              Keep these pages
            </button>
            <button
              type="button"
              onClick={() => setMode("remove")}
              className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${
                mode === "remove" ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              Delete these pages
            </button>
          </div>

          <label htmlFor="ranges" className="mt-4 block text-sm font-medium text-ink">
            {mode === "keep" ? "Pages to keep" : "Pages to delete"}
          </label>
          <input
            id="ranges"
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder={`e.g. 1-3, 5, 8-${pageCount}`}
            className="focus-ring mt-1 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink"
          />
          <p className="mt-1 text-xs text-muted">Comma-separate individual pages and ranges. Order doesn&apos;t matter.</p>
        </div>

        <button
          type="button"
          onClick={handleSplit}
          disabled={status === "processing"}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50"
        >
          {status === "processing" ? "Working…" : mode === "keep" ? "Extract pages" : "Delete pages"}
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
