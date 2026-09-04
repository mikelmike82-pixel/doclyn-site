import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools";
import { getToolIcon } from "@/lib/toolIcons";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const isLive = tool.status === "live";
  const Icon = getToolIcon(tool.slug);

  const content = (
    <div
      className={`group h-full rounded-lg border border-line bg-surface p-5 shadow-card transition ${
        isLive ? "hover:-translate-y-0.5 hover:border-signal hover:shadow-md" : "opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            isLive ? "bg-signal-tint" : "bg-canvas"
          }`}
          aria-hidden="true"
        >
          <Icon className={`h-6 w-6 ${isLive ? "text-signal" : "text-muted"}`} strokeWidth={1.5} />
        </span>
        {!isLive && (
          <span className="shrink-0 rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">
            Soon
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink">{tool.name}</h3>
      <p className="mt-1.5 text-sm text-muted">{tool.shortDescription}</p>
      {tool.clientSide && (
        <p className="mt-3 text-xs font-medium text-signal">Processes on your device</p>
      )}
    </div>
  );

  if (!isLive) {
    return <div aria-disabled="true">{content}</div>;
  }

  return (
    <Link href={`/tools/${tool.slug}`} className="focus-ring block h-full rounded-lg">
      {content}
    </Link>
  );
}
