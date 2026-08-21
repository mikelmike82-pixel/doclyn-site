import { formatBytes } from "@/lib/formatBytes";

interface SimpleResultCardProps {
  title: string;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  onReset: () => void;
  resetLabel: string;
}

export function SimpleResultCard({ title, fileName, fileSize, downloadUrl, onReset, resetLabel }: SimpleResultCardProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-8 text-center shadow-card">
      <p className="text-sm font-medium uppercase tracking-wide text-gain">{title}</p>
      <p className="mt-3 truncate font-mono text-sm text-muted">{fileName}</p>
      <p className="mt-1 font-mono text-lg text-ink">{formatBytes(fileSize)}</p>
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
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
