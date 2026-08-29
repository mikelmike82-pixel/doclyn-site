"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadZone } from "@/components/UploadZone";
import { ResultCard } from "@/components/ResultCard";

type Kind = "pdf" | "docx" | "xlsx";

interface Result {
  blob: Blob;
  url: string;
  fileName: string;
  grew: boolean;
  note: string | null;
}

function detectKind(file: File): Kind | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".xlsx")) return "xlsx";
  return null;
}

function labelFor(kind: Kind): string {
  if (kind === "pdf") return "PDF";
  if (kind === "docx") return "Word document";
  return "Excel spreadsheet";
}

// PDFs are compressed the exact same way as the dedicated Compress PDF tool
// — each page rendered to an image and recompressed. It's kept as its own
// copy here (rather than shared code) so this tool can never accidentally
// change behavior on the existing, already-live Compress PDF page.
async function compressPdf(file: File, quality: number): Promise<{ blob: Blob; grew: boolean }> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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

async function recompressJpegBytes(bytes: Uint8Array, quality: number): Promise<Uint8Array | null> {
  const blob = new Blob([bytes as BlobPart], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("bad image"));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const outBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality / 100)
    );
    if (!outBlob) return null;
    return new Uint8Array(await outBlob.arrayBuffer());
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// .docx and .xlsx files are actually zip archives full of XML plus any
// embedded photos. This never touches the document's text, formatting, or
// formulas — it only (a) recompresses embedded JPEG photos, the same way
// Compress Image does, and (b) re-zips the whole package at maximum
// compression. Real, safe savings on photo-heavy documents; small or no
// savings on a plain text-only document, which is stated honestly below.
async function compressOfficeFile(
  file: File,
  quality: number
): Promise<{ blob: Blob; grew: boolean; note: string | null }> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);

  const mediaPattern = /^(word|xl|ppt)\/media\//i;
  const jpegPattern = /\.jpe?g$/i;

  let photosFound = 0;
  let photosShrunk = 0;

  const entries = Object.values(zip.files);
  for (const entry of entries) {
    if (entry.dir) continue;
    if (!mediaPattern.test(entry.name) || !jpegPattern.test(entry.name)) continue;
    photosFound++;
    const original = await entry.async("uint8array");
    const recompressed = await recompressJpegBytes(original, quality);
    if (recompressed && recompressed.length < original.length) {
      zip.file(entry.name, recompressed, { binary: true });
      photosShrunk++;
    }
  }

  const outBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  const note =
    photosFound === 0
      ? "No embedded photos were found in this file, so the size savings here come only from repacking it more efficiently — that's usually small for a mostly-text document."
      : photosShrunk === 0
      ? "This file's photos were already efficiently compressed, so there wasn't much left to save."
      : null;

  return { blob: outBlob, grew: outBlob.size >= file.size, note };
}

export function DocumentCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);
  const [quality, setQuality] = useState(70);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function run(targetFile: File, targetKind: Kind, targetQuality: number) {
    setStatus("processing");
    setErrorMessage(null);
    try {
      const base = targetFile.name.replace(/\.[^/.]+$/, "");
      if (targetKind === "pdf") {
        const { blob, grew } = await compressPdf(targetFile, targetQuality);
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { blob, url: URL.createObjectURL(blob), fileName: `${base}-compressed.pdf`, grew, note: null };
        });
      } else {
        const { blob, grew, note } = await compressOfficeFile(targetFile, targetQuality);
        const ext = targetKind;
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { blob, url: URL.createObjectURL(blob), fileName: `${base}-compressed.${ext}`, grew, note };
        });
      }
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong compressing that file.");
    }
  }

  function handleFiles(newFiles: File[]) {
    const newFile = newFiles[0];
    if (!newFile) return;
    const detected = detectKind(newFile);
    if (!detected) {
      setStatus("error");
      setErrorMessage("Supported formats right now are PDF (.pdf), Word (.docx), and Excel (.xlsx). Legacy .doc and .xls files aren't supported.");
      return;
    }
    if (newFile.size > 40 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("That file is over 40MB — try a smaller file.");
      return;
    }
    setFile(newFile);
    setKind(detected);
    setResult(null);
    run(newFile, detected, quality);
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setKind(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  function handleQualityChange(next: number) {
    setQuality(next);
    if (file && kind) run(file, kind, next);
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
            This file was already efficient — the compressed version came out the same size or
            bigger. That usually means there wasn&apos;t much left to save; try a lower quality
            below, or skip compressing this one.
          </p>
        )}
        {result.note && (
          <p className="text-center text-xs text-muted">{result.note}</p>
        )}

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="docQuality" className="font-medium text-ink">
              Photo quality {kind === "pdf" ? "(applies to every page)" : "(applies to embedded photos)"}
            </label>
            <span className="font-mono text-muted">{quality}</span>
          </div>
          <input
            id="docQuality"
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
      <UploadZone
        accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        label="Drop a document here"
        hint="or click to choose a file — PDF, Word (.docx), or Excel (.xlsx)"
        onFiles={handleFiles}
      />
      {status === "processing" && (
        <p className="text-center text-sm text-muted">Compressing — this can take a moment for larger files…</p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
