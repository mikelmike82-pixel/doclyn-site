import { formatBytes } from "@/lib/formatBytes";

interface ResultCardProps {
  originalBytes: number;
  newBytes: number;
  fileName: string;
  downloadUrl: string;
  onReset: () => void;
}

export function ResultCard({ originalBytes, newBytes, fileName, downloadUrl, onReset }: ResultCardProps) {
  const savedPct = originalBytes > 0 ? Math.max(0, Math.round((1 - newBytes / originalBytes) * 100)) : 0;

  return (
    <div className="rounded-lg border border-line bg-surface p-8 text-center shadow-card">
      <p className="text-sm font-medium uppercase tracking-wide text-gain">Done</p>
      <div className="mt-4 flex items-center justify-center gap-4 font-mono">
        <div className="text-right">
          <div className="text-xs text-muted">Original</div>
          <div className="text-lg text-muted line-through decoration-1">{formatBytes(originalBytes)}</div>
        </div>
        <div className="text-2xl text-muted">→</div>
        <div className="text-left">
          <div className="text-xs text-muted">New</div>
          <div className="text-2xl font-semibold text-ink">{formatBytes(newBytes)}</div>
        </div>
      </div>
      {savedPct > 0 && (
        <p className="mt-3 text-sm text-gain">
          You saved <span className="font-mono font-semibold">{savedPct}%</span>
        </p>
      )}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={downloadUrl}
          download={fileName}
          className="focus-ring w-full rounded-full bg-signal px-6 py-3 text-sm font-medium text-white transition hover:bg-signal-dark sm:w-auto"
        >
          Download
        </a>
        <button
          type="button"
          onClick={onReset}
          className="focus-ring w-full rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-signal sm:w-auto"
        >
          Compress another
        </button>
      </div>
    </div>
  );
}
