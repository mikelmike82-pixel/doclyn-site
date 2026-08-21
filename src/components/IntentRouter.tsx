"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { matchToolFromPhrase } from "@/lib/tools";

const EXAMPLES = [
  "Make this image smaller than 100KB",
  "Turn these photos into one PDF",
  "Compress a JPG without losing quality",
];

export function IntentRouter() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const match = matchToolFromPhrase(value);

    if (!match) {
      setNotice("We don't have a tool for that one yet — take a look at what's live below.");
      return;
    }

    if (match.status !== "live") {
      setNotice(`${match.name} is on the way but isn't live yet. Try Compress Image below in the meantime.`);
      return;
    }

    setNotice(null);
    router.push(`/tools/${match.slug}`);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What do you want to do with your file?"
          aria-label="Describe what you want to do with your file"
          className="focus-ring w-full rounded-full border border-line bg-surface px-6 py-4 text-base text-ink shadow-card placeholder:text-muted"
        />
        <button
          type="submit"
          className="focus-ring shrink-0 rounded-full bg-signal px-7 py-4 text-base font-medium text-white transition hover:bg-signal-dark"
        >
          Find my tool
        </button>
      </form>

      {notice && (
        <p className="mt-3 text-sm text-gain" role="status">
          {notice}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setValue(example)}
            className="focus-ring rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-muted transition hover:border-signal hover:text-ink"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
