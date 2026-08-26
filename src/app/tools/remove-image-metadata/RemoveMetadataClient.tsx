"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ResultCard } from "@/components/ResultCard";

interface Result {
  blob: Blob;
  url: string;
  fileName: string;
}

// Re-drawing onto a canvas and re-encoding is what actually strips the
// metadata — EXIF, GPS location, camera model, timestamps — since none of
// that survives a canvas round-trip. No third-party library needed.
async function stripMetadata(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image file."));
      el.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser doesn't support canvas image processing.");
    if (file.type === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const mime = file.type === "image/webp" ? "image/webp" : file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mime, mime === "image/png" ? undefined : 0.95)
    );
    if (!blob) throw new Error("Couldn't process that image — try again.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function RemoveMetadataClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleFiles(newFiles: File[]) {
    const newFile = newFiles[0];
    if (!newFile) return;
    if (!newFile.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("That doesn't look like an image file.");
      return;
    }
    setFile(newFile);
    setStatus("processing");
    setErrorMessage(null);
    try {
      const blob = await stripMetadata(newFile);
      const base = newFile.name.replace(/\.[^/.]+$/, "");
      const ext = newFile.name.split(".").pop() || "jpg";
      setResult({ blob, url: URL.createObjectURL(blob), fileName: `${base}-clean.${ext}` });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (result && file) {
    return (
      <div className="space-y-3">
        <ResultCard
          originalBytes={file.size}
          newBytes={result.blob.size}
          fileName={result.fileName}
          downloadUrl={result.url}
          previewUrl={result.url}
          onReset={handleReset}
        />
        <p className="text-center text-xs text-muted">
          EXIF, GPS location, camera details, and timestamps have been stripped. Any size change
          above is a side effect of re-encoding, not the goal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UploadZone
        accept="image/jpeg,image/png,image/webp"
        label="Drop an image here"
        hint="or click to choose a file — JPG, PNG, or WebP"
        onFiles={handleFiles}
      />
      {status === "processing" && <p className="text-center text-sm text-muted">Removing metadata…</p>}
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
