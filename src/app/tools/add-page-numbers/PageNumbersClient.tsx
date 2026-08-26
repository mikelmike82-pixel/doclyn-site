"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { SimpleResultCard } from "@/components/SimpleResultCard";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center";

const MARGIN = 28;

function positionFor(pos: Position, width: number, height: number, textWidth: number) {
  switch (pos) {
    case "bottom-right":
      return { x: width - MARGIN - textWidth, y: MARGIN };
    case "bottom-left":
      return { x: MARGIN, y: MARGIN };
    case "top-center":
      return { x: width / 2 - textWidth / 2, y: height - MARGIN };
    case "bottom-center":
    default:
      return { x: width / 2 - textWidth / 2, y: MARGIN };
  }
}

export function PageNumbersClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [startAt, setStartAt] = useState(1);
  const [position, setPosition] = useState<Position>("bottom-center");
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

  async function handleAddNumbers() {
    if (!file) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const fontSize = 11;

      pages.forEach((page, i) => {
        const label = String(startAt + i);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const { x, y } = positionFor(position, width, height, textWidth);
        page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
      });

      const outBytes = await pdf.save();
      const blob = new Blob([outBytes as BlobPart], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      setResult({ url: URL.createObjectURL(blob), fileName: `${base}-numbered.pdf`, size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong adding page numbers.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setPageCount(null);
    setStartAt(1);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (result) {
    return (
      <SimpleResultCard
        title="Numbered"
        fileName={result.fileName}
        fileSize={result.size}
        downloadUrl={result.url}
        onReset={handleReset}
        resetLabel="Number another PDF"
      />
    );
  }

  if (file && pageCount) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium text-ink">{file.name}</p>
          <p className="text-xs text-muted">{pageCount} pages</p>

          <label className="mt-4 block text-sm font-medium text-ink">Position</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {[
              { value: "bottom-center", label: "Bottom center" },
              { value: "bottom-right", label: "Bottom right" },
              { value: "bottom-left", label: "Bottom left" },
              { value: "top-center", label: "Top center" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPosition(opt.value as Position)}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                  position === opt.value
                    ? "border-signal bg-signal text-white"
                    : "border-line text-muted hover:border-signal hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label htmlFor="start-at" className="mt-4 block text-sm font-medium text-ink">
            Start numbering at
          </label>
          <input
            id="start-at"
            type="number"
            min={0}
            value={startAt}
            onChange={(e) => setStartAt(Number(e.target.value))}
            className="focus-ring mt-1 w-28 rounded border border-line bg-canvas px-3 py-2 text-sm text-ink"
          />
        </div>

        <button
          type="button"
          onClick={handleAddNumbers}
          disabled={status === "processing"}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50"
        >
          {status === "processing" ? "Adding numbers…" : "Add page numbers"}
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
