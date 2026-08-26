"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { formatBytes } from "@/lib/formatBytes";

interface Loaded {
  file: File;
  img: HTMLImageElement;
  naturalWidth: number;
  naturalHeight: number;
}

interface Adjustments {
  brightness: number; // 0-200, 100 = unchanged
  contrast: number; // 0-200, 100 = unchanged
  saturation: number; // 0-200, 100 = unchanged
  sharpen: number; // 0-100, 0 = off
}

const DEFAULTS: Adjustments = { brightness: 100, contrast: 100, saturation: 100, sharpen: 0 };
const PREVIEW_MAX = 640;

function applySharpen(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  if (amount <= 0) return;
  const k = (amount / 100) * 1.2; // strength multiplier, kept moderate on purpose
  const src = ctx.getImageData(0, 0, width, height);
  const srcData = src.data;
  const out = ctx.createImageData(width, height);
  const outData = out.data;
  const center = 1 + 4 * k;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        const mid = srcData[i + c];
        const up = y > 0 ? srcData[i - width * 4 + c] : mid;
        const down = y < height - 1 ? srcData[i + width * 4 + c] : mid;
        const left = x > 0 ? srcData[i - 4 + c] : mid;
        const right = x < width - 1 ? srcData[i + 4 + c] : mid;
        const value = mid * center - k * (up + down + left + right);
        outData[i + c] = Math.max(0, Math.min(255, value));
      }
      outData[i + 3] = srcData[i + 3];
    }
  }
  ctx.putImageData(out, 0, 0);
}

function render(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  width: number,
  height: number,
  adj: Adjustments,
  isJpeg: boolean
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (isJpeg) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.filter = `brightness(${adj.brightness}%) contrast(${adj.contrast}%) saturate(${adj.saturation}%)`;
  ctx.drawImage(img, 0, 0, width, height);
  ctx.filter = "none";
  applySharpen(ctx, width, height, adj.sharpen);
}

export function ImageEnhancerClient() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [adj, setAdj] = useState<Adjustments>(DEFAULTS);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; fileName: string; size: number } | null>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const previewSize = loaded
    ? (() => {
        const scale = Math.min(1, PREVIEW_MAX / Math.max(loaded.naturalWidth, loaded.naturalHeight));
        return { width: Math.round(loaded.naturalWidth * scale), height: Math.round(loaded.naturalHeight * scale) };
      })()
    : null;

  useEffect(() => {
    if (!loaded || !previewRef.current || !previewSize) return;
    render(previewRef.current, loaded.img, previewSize.width, previewSize.height, adj, loaded.file.type === "image/jpeg");
  }, [loaded, adj, previewSize]);

  function handleFiles(newFiles: File[]) {
    const file = newFiles[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("That doesn't look like an image file.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("That file is over 25MB — try a smaller image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setLoaded({ file, img, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      setAdj(DEFAULTS);
      setStatus("idle");
      setErrorMessage(null);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setStatus("error");
      setErrorMessage("Could not read that image file.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const handleDownload = useCallback(async () => {
    if (!loaded) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const canvas = document.createElement("canvas");
      render(canvas, loaded.img, loaded.naturalWidth, loaded.naturalHeight, adj, loaded.file.type === "image/jpeg");
      const mime = loaded.file.type || "image/jpeg";
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, mime === "image/png" ? undefined : 0.95)
      );
      if (!blob) throw new Error("Enhancing failed — try again.");
      const base = loaded.file.name.replace(/\.[^/.]+$/, "");
      const ext = loaded.file.name.split(".").pop() || "jpg";
      setDownloadInfo((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), fileName: `${base}-enhanced.${ext}`, size: blob.size };
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, [loaded, adj]);

  function handleReset() {
    if (downloadInfo) URL.revokeObjectURL(downloadInfo.url);
    setLoaded(null);
    setDownloadInfo(null);
    setAdj(DEFAULTS);
    setStatus("idle");
    setErrorMessage(null);
  }

  function updateAdj(key: keyof Adjustments, value: number) {
    setDownloadInfo(null);
    setAdj((prev) => ({ ...prev, [key]: value }));
  }

  if (loaded) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface p-6 text-center">
          <p className="text-sm text-muted">{loaded.file.name} — live preview, adjust below</p>
          <div className="mt-4 flex justify-center">
            <canvas ref={previewRef} className="max-h-96 w-auto rounded border border-line" />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
          {[
            { key: "brightness" as const, label: "Brightness" },
            { key: "contrast" as const, label: "Contrast" },
            { key: "saturation" as const, label: "Saturation" },
          ].map((s) => (
            <div key={s.key}>
              <div className="flex items-center justify-between text-sm">
                <label htmlFor={s.key} className="font-medium text-ink">{s.label}</label>
                <span className="font-mono text-muted">{adj[s.key]}%</span>
              </div>
              <input
                id={s.key}
                type="range"
                min={0}
                max={200}
                value={adj[s.key]}
                onChange={(e) => updateAdj(s.key, Number(e.target.value))}
                className="mt-1 w-full accent-signal"
              />
            </div>
          ))}
          <div>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="sharpen" className="font-medium text-ink">Sharpen</label>
              <span className="font-mono text-muted">{adj.sharpen}</span>
            </div>
            <input
              id="sharpen"
              type="range"
              min={0}
              max={100}
              value={adj.sharpen}
              onChange={(e) => updateAdj("sharpen", Number(e.target.value))}
              className="mt-1 w-full accent-signal"
            />
          </div>
          <button
            type="button"
            onClick={() => setAdj(DEFAULTS)}
            className="focus-ring text-xs text-muted underline hover:text-ink"
          >
            Reset adjustments
          </button>
        </div>

        {downloadInfo ? (
          <div className="rounded-lg border border-line bg-surface p-6 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-gain">Ready</p>
            <p className="mt-2 text-xs text-muted">{formatBytes(downloadInfo.size)}</p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={downloadInfo.url}
                download={downloadInfo.fileName}
                className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark sm:w-auto"
              >
                Download
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="focus-ring w-full rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-signal sm:w-auto"
              >
                Enhance another
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleDownload}
              disabled={status === "processing"}
              className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark disabled:opacity-50 sm:w-auto"
            >
              {status === "processing" ? "Rendering full size…" : "Generate download"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="focus-ring w-full rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-signal sm:w-auto"
            >
              Choose a different image
            </button>
          </div>
        )}

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
        hint="or click to choose a file — JPG, PNG, or WebP, up to 25MB"
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
