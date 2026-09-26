"use client";

import { useEffect, useState } from "react";

interface ImagePreviewProps {
  // Typed as Blob (not just File) so this same component can preview either
  // a freshly-picked File or a Blob produced as an output, without a cast.
  file: Blob;
  alt?: string;
  className?: string;
}

// A simple, self-contained image thumbnail: turns a File/Blob into an
// object URL for the lifetime of this component and cleans it up on
// unmount or when the file changes. No upload happens — this is purely
// reading the bytes already sitting in the browser.
export function ImagePreview({ file, alt, className = "max-h-64 w-auto rounded-lg border border-line object-contain" }: ImagePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt ?? "Preview"} className={className} />
  );
}
