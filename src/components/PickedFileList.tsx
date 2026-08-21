"use client";

import { formatBytes } from "@/lib/formatBytes";

interface PickedFileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (from: number, to: number) => void;
}

export function PickedFileList({ files, onRemove, onReorder }: PickedFileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
      {files.map((file, index) => (
        <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-4 py-3">
          {onReorder && (
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                onClick={() => onReorder(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move ${file.name} up`}
                className="focus-ring rounded px-1 text-muted hover:text-ink disabled:opacity-25"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onReorder(index, index + 1)}
                disabled={index === files.length - 1}
                aria-label={`Move ${file.name} down`}
                className="focus-ring rounded px-1 text-muted hover:text-ink disabled:opacity-25"
              >
                ▼
              </button>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {index + 1}. {file.name}
            </p>
            <p className="text-xs text-muted">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${file.name}`}
            className="focus-ring shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:bg-canvas hover:text-ink"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
