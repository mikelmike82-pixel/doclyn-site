"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { SimpleResultCard } from "@/components/SimpleResultCard";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

const PAGE_WIDTH_PT = 595.28; // A4 at 72dpi
const PAGE_HEIGHT_PT = 841.89;

// Honest about the tradeoff here: mammoth.js turns the .docx into HTML
// (keeping headings, bold/italic, lists, and basic images), then that HTML
// is rendered off-screen and captured as an image, which is sliced across
// A4 pages to build the PDF. That means the result looks right, but the
// text in it is a picture of text, not real selectable/searchable text —
// the same honest tradeoff Compress PDF discloses, for the same reason:
// producing a genuine text-based PDF from arbitrary Word formatting reliably
// needs the kind of layout engine that runs server-side in the big tools.
async function convertWordToPdf(file: File): Promise<Blob> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "780px";
  container.style.padding = "40px";
  container.style.background = "#ffffff";
  container.style.color = "#111111";
  container.style.fontFamily = "Georgia, 'Times New Roman', serif";
  container.style.fontSize = "15px";
  container.style.lineHeight = "1.6";
  container.innerHTML = html || "<p>(This document appears to be empty.)</p>";
  document.body.appendChild(container);

  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });

    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });

    const imgWidth = PAGE_WIDTH_PT;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= PAGE_HEIGHT_PT;

    while (heightLeft > 0) {
      position -= PAGE_HEIGHT_PT;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= PAGE_HEIGHT_PT;
    }

    return pdf.output("blob");
  } finally {
    document.body.removeChild(container);
  }
}

export function WordToPdfClient() {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleFiles(newFiles: File[]) {
    const file = newFiles[0];
    if (!file) return;
    const isDocx = file.name.toLowerCase().endsWith(".docx");
    if (!isDocx) {
      setStatus("error");
      setErrorMessage("Please choose a .docx file (older .doc files aren't supported).");
      return;
    }
    setStatus("processing");
    setErrorMessage(null);
    try {
      const blob = await convertWordToPdf(file);
      const base = file.name.replace(/\.docx$/i, "");
      setResult({ url: URL.createObjectURL(blob), fileName: `${base}.pdf`, size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Couldn't convert that document.");
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
        resetLabel="Convert another document"
      />
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        label="Drop a Word document here"
        hint="or click to choose a .docx file"
        onFiles={handleFiles}
      />
      {status === "processing" && <p className="text-center text-sm text-muted">Converting…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
