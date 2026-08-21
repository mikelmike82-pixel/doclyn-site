"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { PickedFileList } from "@/components/PickedFileList";
import { SimpleResultCard } from "@/components/SimpleResultCard";

interface Result {
  url: string;
  fileName: string;
  size: number;
}

const MAX_PAGE_POINTS = 1200; // caps very large photos to a sane PDF page size

async function fileToPngBytes(file: File): Promise<{ bytes: ArrayBuffer; width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`Couldn't read ${file.name} as an image.`));
      el.src = url;
    });

    const scale = Math.min(1, MAX_PAGE_POINTS / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser doesn't support canvas image processing.");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error(`Couldn't process ${file.name}.`);
    return { bytes: await blob.arrayBuffer(), width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function imagesToPdf(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const { bytes, width, height } = await fileToPngBytes(file);
    const image = await pdfDoc.embedPng(bytes);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }
  const outBytes = await pdfDoc.save();
  return new Blob([outBytes as BlobPart], { type: "application/pdf" });
}

export function JpgToPdfClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function addFiles(newFiles: File[]) {
    const imagesOnly = newFiles.filter((f) => f.type.startsWith("image/"));
    setErrorMessage(imagesOnly.length !== newFiles.length ? "Only image files are supported — some files were skipped." : null);
    setFiles((prev) => [...prev, ...imagesOnly]);
  }

  function reorderFiles(from: number, to: number) {
    setFiles((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleConvert() {
    if (files.length === 0) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const blob = await imagesToPdf(files);
      setResult({ url: URL.createObjectURL(blob), fileName: "images.pdf", size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Couldn't build that PDF — try a different image.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFiles([]);
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
        resetLabel="Convert more images"
      />
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone
        accept="image/jpeg,image/png,image/webp"
        label="Drop images here"
        hint="or click to choose files — each becomes one page; reorder with the arrows below"
        multiple
        onFiles={addFiles}
      />
      <PickedFileList files={files} onRemove={removeFile} onReorder={reorderFiles} />

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={status === "processing"}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "processing" ? "Building PDF…" : `Convert ${files.length} image${files.length > 1 ? "s" : ""} to PDF`}
        </button>
      )}

      {errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
