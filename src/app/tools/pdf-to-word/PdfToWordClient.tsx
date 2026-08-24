"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { SimpleResultCard } from "@/components/SimpleResultCard";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

interface TextItemLike {
  str: string;
  transform: number[];
}

// Honest about what this does: it pulls the actual text out of the PDF and
// lays it out as paragraphs in a real, editable .docx — one line per line of
// text, grouped by page. It does NOT reconstruct tables, images, columns,
// fonts, or exact positioning, because doing that reliably requires the kind
// of layout-analysis engine that only runs server-side (which is what paid
// tools like Adobe's actually use). For a scanned PDF or a photo of a page,
// this returns nothing useful — there's no text layer to extract from an
// image. The tool page says all of this plainly before anyone uses it.
async function convertPdfToWord(file: File): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  // See the matching comment in PdfToJpgClient.tsx — the worker is loaded
  // from a CDN, matched to the installed version, because any local
  // reference to this file breaks the Next.js production build.
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const { Document, Packer, Paragraph, PageBreak } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    // Group text fragments into lines using their vertical position — items
    // on the same visual line share (roughly) the same y-coordinate.
    const lineMap = new Map<number, string[]>();
    for (const rawItem of textContent.items) {
      const item = rawItem as TextItemLike;
      if (typeof item.str !== "string") continue;
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push(item.str);
    }

    // PDF y-coordinates increase upward, so sort descending to read top to bottom.
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
    let addedAnyLine = false;
    for (const y of sortedYs) {
      const lineText = lineMap.get(y)!.join(" ").replace(/\s+/g, " ").trim();
      if (lineText) {
        children.push(new Paragraph(lineText));
        addedAnyLine = true;
      }
    }
    if (!addedAnyLine) {
      children.push(new Paragraph(`[Page ${pageNumber} has no extractable text — likely a scanned image.]`));
    }

    if (pageNumber < pdf.numPages) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBlob(doc);
}

export function PdfToWordClient() {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleFiles(newFiles: File[]) {
    const file = newFiles[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setStatus("error");
      setErrorMessage("That doesn't look like a PDF.");
      return;
    }
    setStatus("processing");
    setErrorMessage(null);
    try {
      const blob = await convertPdfToWord(file);
      const base = file.name.replace(/\.pdf$/i, "");
      setResult({ url: URL.createObjectURL(blob), fileName: `${base}.docx`, size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Couldn't convert that PDF — it may be encrypted or corrupted.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
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
        resetLabel="Convert another PDF"
      />
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone accept="application/pdf" label="Drop a PDF here" hint="or click to choose a file" onFiles={handleFiles} />
      {status === "processing" && <p className="text-center text-sm text-muted">Extracting text…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
