"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { SimpleResultCard } from "@/components/SimpleResultCard";
import { PdfPagePreview } from "@/components/PdfPagePreview";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

interface PageRange {
  from: number;
  to: number;
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

// Clamps a (possibly empty-input / NaN) page number into a valid 1..pageCount
// page index, the same way a person would expect typing "0" or leaving the
// box blank to just snap back to something sane rather than error out.
function clampPage(n: number, pageCount: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(Math.max(1, Math.round(n)), pageCount);
}

type Mode = "ranges" | "keep" | "remove";

export function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [ranges, setRanges] = useState<PageRange[]>([]);
  const [mode, setMode] = useState<Mode>("ranges");
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
      const count = pdf.getPageCount();
      setFile(newFile);
      setPageCount(count);
      setRangeInput(`1-${count}`);
      setRanges([{ from: 1, to: count }]);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't read that PDF — it may be encrypted or corrupted.");
    }
  }

  function addRange() {
    if (!pageCount) return;
    setRanges((prev) => {
      const last = prev[prev.length - 1];
      const nextFrom = last ? Math.min(last.to + 1, pageCount) : 1;
      return [...prev, { from: nextFrom, to: pageCount }];
    });
  }

  function updateRange(index: number, field: "from" | "to", value: number) {
    setRanges((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function removeRange(index: number) {
    setRanges((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSplitByRanges() {
    if (!file || !pageCount) return;
    const validRanges = ranges
      .map((r) => {
        const from = clampPage(r.from, pageCount);
        const to = clampPage(r.to, pageCount);
        return from <= to ? { from, to } : { from: to, to: from };
      });

    if (validRanges.length === 0) {
      setErrorMessage("Add at least one page range.");
      return;
    }

    setStatus("processing");
    setErrorMessage(null);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const base = file.name.replace(/\.pdf$/i, "");

      if (validRanges.length === 1) {
        const r = validRanges[0];
        const indices = Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from - 1 + i);
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const outBytes = await out.save();
        const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
        setResult({ url: URL.createObjectURL(blob), fileName: `${base}-pages-${r.from}-${r.to}.pdf`, size: blob.size });
      } else {
        // Multiple ranges — each one becomes its own PDF, same as iLovePDF's
        // "split by range" mode, bundled into one zip so it's still a single
        // download instead of triggering several browser downloads at once.
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (const r of validRanges) {
          const indices = Array.from({ length: r.to - r.from + 1 }, (_, i) => r.from - 1 + i);
          const out = await PDFDocument.create();
          const copied = await out.copyPages(src, indices);
          copied.forEach((p) => out.addPage(p));
          const outBytes = await out.save();
          zip.file(`${base}-pages-${r.from}-${r.to}.pdf`, outBytes);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResult({ url: URL.createObjectURL(zipBlob), fileName: `${base}-split.zip`, size: zipBlob.size });
      }
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong splitting that PDF.");
    }
  }

  async function handleKeepOrRemove() {
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

  function handleSplit() {
    if (mode === "ranges") {
      handleSplitByRanges();
    } else {
      handleKeepOrRemove();
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setPageCount(null);
    setRangeInput("");
    setRanges([]);
    setMode("ranges");
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

          <div className="mt-4 flex justify-center">
            <PdfPagePreview
              file={file}
              label={`Preview of the first page of ${file.name}`}
              className="max-h-56 w-full rounded border border-line bg-canvas object-contain"
            />
          </div>

          <div className="mt-4 flex rounded-full border border-line bg-canvas p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("ranges")}
              className={`flex-1 rounded-full px-2 py-1.5 font-medium transition ${
                mode === "ranges" ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              Split into ranges
            </button>
            <button
              type="button"
              onClick={() => setMode("keep")}
              className={`flex-1 rounded-full px-2 py-1.5 font-medium transition ${
                mode === "keep" ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              Keep these pages
            </button>
            <button
              type="button"
              onClick={() => setMode("remove")}
              className={`flex-1 rounded-full px-2 py-1.5 font-medium transition ${
                mode === "remove" ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              Delete these pages
            </button>
          </div>

          {mode === "ranges" ? (
            <div className="mt-4 space-y-3">
              {ranges.map((r, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted">Range {i + 1}:</span>
                  <span className="text-sm text-ink">From page</span>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={r.from}
                    onChange={(e) => updateRange(i, "from", Number(e.target.value))}
                    aria-label={`Range ${i + 1} start page`}
                    className="focus-ring w-20 rounded border border-line bg-canvas px-2 py-1.5 text-sm text-ink"
                  />
                  <span className="text-sm text-ink">to</span>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={r.to}
                    onChange={(e) => updateRange(i, "to", Number(e.target.value))}
                    aria-label={`Range ${i + 1} end page`}
                    className="focus-ring w-20 rounded border border-line bg-canvas px-2 py-1.5 text-sm text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => removeRange(i)}
                    disabled={ranges.length === 1}
                    aria-label={`Remove range ${i + 1}`}
                    className="focus-ring ml-auto shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRange}
                className="focus-ring text-sm font-medium text-signal hover:text-signal-dark"
              >
                + Add another range
              </button>
              <p className="text-xs text-muted">
                Each range becomes its own PDF — like splitting page 1 to 5 and page 6 to 10 into
                two separate files. Add more than one range and you&apos;ll get them all back
                together in a single zip.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleSplit}
          disabled={status === "processing"}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50"
        >
          {status === "processing"
            ? "Working…"
            : mode === "ranges"
            ? ranges.length > 1
              ? `Split into ${ranges.length} files`
              : "Split PDF"
            : mode === "keep"
            ? "Extract pages"
            : "Delete pages"}
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
