"use client";

import { useCallback, useMemo, useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ResultCard } from "@/components/ResultCard";
import { formatBytes } from "@/lib/formatBytes";

type OutputFormat = "auto" | "image/jpeg" | "image/webp";

interface Result {
  blob: Blob;
  url: string;
  fileName: string;
}

function outputMimeType(file: File, format: OutputFormat): string {
  if (format !== "auto") return format;
  // PNG doesn't compress well for photos and toBlob quality is ignored for it —
  // re-encoding as JPEG usually gives a real size win with no visible loss for photos.
  if (file.type === "image/png") return "image/jpeg";
  return file.type || "image/jpeg";
}

function extensionFor(mimeType: string): string {
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/png") return "png";
  return "jpg";
}

async function compressImage(file: File, quality: number, format: OutputFormat): Promise<Blob> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image file."));
      el.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser doesn't support canvas image processing.");

    // Flatten transparency onto white for JPEG output, since JPEG has no alpha channel.
    const mime = outputMimeType(file, format);
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mime, mime === "image/png" ? undefined : quality / 100);
    });

    if (!blob) throw new Error("Compression failed — try a different quality setting.");
    return blob;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export function CompressImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState<OutputFormat>("auto");
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const effectiveMime = useMemo(() => (file ? outputMimeType(file, format) : "image/jpeg"), [file, format]);
  const qualityApplies = effectiveMime !== "image/png";

  const runCompression = useCallback(
    async (targetFile: File, targetQuality: number, targetFormat: OutputFormat) => {
      setStatus("processing");
      setErrorMessage(null);
      try {
        const blob = await compressImage(targetFile, targetQuality, targetFormat);
        const mime = outputMimeType(targetFile, targetFormat);
        const base = targetFile.name.replace(/\.[^/.]+$/, "");
        const fileName = `${base}-compressed.${extensionFor(mime)}`;
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { blob, url: URL.createObjectURL(blob), fileName };
        });
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    []
  );

  function handleFiles(newFiles: File[]) {
    const newFile = newFiles[0];
    if (!newFile) return;
    if (!newFile.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("That doesn't look like an image file. Try a JPG, PNG, or WebP.");
      return;
    }
    if (newFile.size > 30 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("That file is over 30MB — try a smaller image.");
      return;
    }
    setFile(newFile);
    setResult(null);
    runCompression(newFile, quality, format);
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  function handleReprocess(nextQuality: number, nextFormat: OutputFormat) {
    setQuality(nextQuality);
    setFormat(nextFormat);
    if (file) runCompression(file, nextQuality, nextFormat);
  }

  if (result && file) {
    return (
      <div className="space-y-6">
        <ResultCard
          originalBytes={file.size}
          newBytes={result.blob.size}
          fileName={result.fileName}
          downloadUrl={result.url}
          previewUrl={result.url}
          onReset={handleReset}
        />

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="quality" className="font-medium text-ink">
              Quality
            </label>
            <span className="font-mono text-muted">{quality}</span>
          </div>
          <input
            id="quality"
            type="range"
            min={10}
            max={95}
            value={quality}
            disabled={!qualityApplies}
            onChange={(e) => handleReprocess(Number(e.target.value), format)}
            className="mt-2 w-full accent-signal disabled:opacity-40"
          />
          {!qualityApplies && (
            <p className="mt-1 text-xs text-muted">PNG is lossless — switch format to JPEG or WebP to use the quality slider.</p>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-medium text-ink">Output format</span>
            <select
              value={format}
              onChange={(e) => handleReprocess(quality, e.target.value as OutputFormat)}
              className="focus-ring rounded border border-line bg-canvas px-2 py-1 text-sm text-ink"
            >
              <option value="auto">Keep original</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          {status === "processing" && <p className="mt-3 text-xs text-muted">Recompressing…</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone
        accept="image/jpeg,image/png,image/webp"
        label="Drop an image here"
        hint="or click to choose a file — JPG, PNG, or WebP, up to 30MB"
        onFiles={handleFiles}
      />
      {status === "processing" && <p className="text-center text-sm text-muted">Compressing…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
