// Maps each tool to a distinct icon — one recognizable pictogram per tool
// (not shared across a whole file type), styled in the site's own brand
// blue rather than a rainbow of category colors. Same idea as iLovePDF's
// tool grid: every tool is visually distinct at a glance, but themed to
// match Doclyn instead of borrowing someone else's palette.

import type { ComponentType, SVGProps } from "react";
import {
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  DocumentIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  HashtagIcon,
  PhotoIcon,
  ScissorsIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  TagIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const toolIcons: Record<string, IconComponent> = {
  "merge-pdf": Square3Stack3DIcon, // pages stacking into one
  "split-pdf": ScissorsIcon,
  "jpg-to-pdf": DocumentIcon,
  "pdf-to-jpg": PhotoIcon,
  "compress-pdf": ArrowsPointingInIcon,
  "pdf-to-word": DocumentTextIcon,
  "word-to-pdf": DocumentIcon,
  "document-compressor": ArchiveBoxArrowDownIcon,
  "rotate-pdf": ArrowPathIcon,
  "watermark-pdf": TagIcon,
  "add-page-numbers": HashtagIcon,
  "crop-pdf": ViewfinderCircleIcon,
  "compress-image": ArrowsPointingInIcon,
  "resize-image": ArrowsPointingOutIcon,
  "remove-image-metadata": EyeSlashIcon,
  "image-enhancer": SparklesIcon,
};

// Falls back to a generic document icon for any future tool slug that
// hasn't been given a specific icon yet, so a missing entry never breaks
// the card — it just looks a little generic until someone adds one.
export function getToolIcon(slug: string): IconComponent {
  return toolIcons[slug] ?? DocumentIcon;
}
