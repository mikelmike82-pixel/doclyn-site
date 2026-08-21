"use client";

import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  accept: string;
  label: string;
  hint: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

export function UploadZone({ accept, label, hint, multiple = false, onFiles }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        onFiles(Array.from(files));
      }
    },
    [onFiles]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`focus-ring flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 text-center transition ${
        isDragging ? "border-signal bg-signal-tint" : "border-line bg-surface hover:border-signal/60"
      }`}
    >
      <div className="font-display text-lg font-medium text-ink">{label}</div>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <span className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
        {multiple ? "Choose files" : "Choose a file"}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label={label}
      />
    </div>
  );
}
