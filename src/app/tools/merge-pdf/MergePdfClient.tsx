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

async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
}

export function MergePdfClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function addFiles(newFiles: File[]) {
    const pdfsOnly = newFiles.filter((f) => f.type === "application/pdf");
    if (pdfsOnly.length !== newFiles.length) {
      setErrorMessage("Only PDF files are supported — some files were skipped.");
    } else {
      setErrorMessage(null);
    }
    setFiles((prev) => [...prev, ...pdfsOnly]);
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

  async function handleMerge() {
    if (files.length < 2) {
      setErrorMessage("Add at least two PDFs to merge.");
      return;
    }
    setStatus("processing");
    setErrorMessage(null);
    try {
      const blob = await mergePdfs(files);
      setResult({ url: URL.createObjectURL(blob), fileName: "merged.pdf", size: blob.size });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Couldn't merge those files — try re-saving them and trying again.");
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
        title="Merged"
        fileName={result.fileName}
        fileSize={result.size}
        downloadUrl={result.url}
        onReset={handleReset}
        resetLabel="Merge more PDFs"
      />
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone
        accept="application/pdf"
        label="Drop PDFs here"
        hint="or click to choose files — reorder them with the arrows below before merging"
        multiple
        onFiles={addFiles}
      />
      <PickedFileList files={files} onRemove={removeFile} onReorder={reorderFiles} />

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleMerge}
          disabled={status === "processing" || files.length < 2}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "processing" ? "Merging…" : `Merge ${files.length} PDFs`}
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
