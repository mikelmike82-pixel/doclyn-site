"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { formatBytes } from "@/lib/formatBytes";

interface Loaded {
  file: File;
  naturalWidth: number;
  naturalHeight: number;
}

interface Result {
  url: string;
  fileName: string;
  size: number;
  width: number;
  height: number;
}

function extensionFor(mimeType: string): string {
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/png") return "png";
  return "jpg";
}

async function resizeImage(file: File, width: number, height: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image file."));
      el.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser doesn't support canvas image processing.");
    if (file.type === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type || "image/jpeg", 0.92));
    if (!blob) throw new Error("Resizing failed — try again.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ResizeImageClient() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function handleFiles(newFiles: File[]) {
    const file = newFiles[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("That doesn't look like an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setLoaded({ file, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setStatus("error");
      setErrorMessage("Could not read that image file.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function updateWidth(next: number) {
    if (!loaded) return;
    setWidth(next);
    if (lockRatio) setHeight(Math.round((next * loaded.naturalHeight) / loaded.naturalWidth));
  }

  function updateHeight(next: number) {
    if (!loaded) return;
    setHeight(next);
    if (lockRatio) setWidth(Math.round((next * loaded.naturalWidth) / loaded.naturalHeight));
  }

  async function handleResize() {
    if (!loaded || width < 1 || height < 1) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const blob = await resizeImage(loaded.file, width, height);
      const base = loaded.file.name.replace(/\.[^/.]+$/, "");
      const fileName = `${base}-${width}x${height}.${extensionFor(loaded.file.type)}`;
      setResult({ url: URL.createObjectURL(blob), fileName, size: blob.size, width, height });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleReset() {
    if (result) URL.revokeObjectURL(result.url);
    setLoaded(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (result) {
    return (
      <div className="rounded-lg border border-line bg-surface p-8 text-center shadow-card">
        <p className="text-sm font-medium uppercase tracking-wide text-gain">Resized</p>
        <div className="mt-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.url}
            alt={`Preview of ${result.fileName}`}
            className="max-h-64 w-auto rounded border border-line object-contain"
          />
        </div>
        <p className="mt-3 font-mono text-lg text-ink">
          {result.width} × {result.height}px
        </p>
        <p className="mt-1 text-xs text-muted">{formatBytes(result.size)}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={result.url}
            download={result.fileName}
            className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark sm:w-auto"
          >
            Download
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="focus-ring w-full rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-signal sm:w-auto"
          >
            Resize another
          </button>
        </div>
      </div>
    );
  }

  if (loaded) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm text-muted">
            {loaded.file.name} — original {loaded.naturalWidth} × {loaded.naturalHeight}px
          </p>

          <div className="mt-4 flex items-end gap-3">
            <div>
              <label htmlFor="width" className="block text-xs font-medium text-muted">Width</label>
              <input
                id="width"
                type="number"
                min={1}
                value={width}
                onChange={(e) => updateWidth(Number(e.target.value))}
                className="focus-ring mt-1 w-28 rounded border border-line bg-canvas px-2 py-1.5 text-sm text-ink"
              />
            </div>
            <span className="pb-2 text-muted">×</span>
            <div>
              <label htmlFor="height" className="block text-xs font-medium text-muted">Height</label>
              <input
                id="height"
                type="number"
                min={1}
                value={height}
                onChange={(e) => updateHeight(Number(e.target.value))}
                className="focus-ring mt-1 w-28 rounded border border-line bg-canvas px-2 py-1.5 text-sm text-ink"
              />
            </div>
            <label className="flex items-center gap-1.5 pb-2 text-xs text-muted">
              <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="accent-signal" />
              Lock aspect ratio
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResize}
          disabled={status === "processing"}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50"
        >
          {status === "processing" ? "Resizing…" : "Resize image"}
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
      <UploadZone
        accept="image/jpeg,image/png,image/webp"
        label="Drop an image here"
        hint="or click to choose a file — JPG, PNG, or WebP"
        onFiles={handleFiles}
      />
      {status === "error" && errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="text-center text-xs text-signal">Processes on your device — nothing is uploaded</p>
    </div>
  );
}
