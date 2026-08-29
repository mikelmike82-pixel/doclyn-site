// Central tool registry. Every tool on the site is declared here once —
// the homepage grid, category pages, the intent router, and internal
// linking all read from this single list. Adding a new tool later means
// adding one entry here plus its page component, not touching five files.

export type ToolCategory = "pdf" | "image" | "ai";

export type ToolStatus = "live" | "soon";

export interface ToolDefinition {
  slug: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  keywords: string[]; // used by the homepage intent-matcher
  status: ToolStatus;
  clientSide: boolean; // true = never leaves the browser
}

export const tools: ToolDefinition[] = [
  {
    slug: "compress-image",
    name: "Compress Image",
    category: "image",
    shortDescription: "Shrink JPG, PNG, or WebP files without a visible quality hit.",
    keywords: ["compress", "shrink", "smaller", "reduce", "image", "photo", "picture", "jpg", "jpeg", "png", "kb", "mb"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    shortDescription: "Combine multiple PDFs into a single file, in the order you choose.",
    keywords: ["merge", "combine", "join", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    shortDescription: "Keep or delete specific pages from a PDF — your choice.",
    keywords: ["split", "separate", "pdf", "pages", "delete", "remove"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "pdf",
    shortDescription: "Turn one or more images into a single PDF document.",
    keywords: ["jpg to pdf", "image to pdf", "photo to pdf", "convert", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    shortDescription: "Export each page of a PDF as its own image.",
    keywords: ["pdf to jpg", "pdf to image", "convert", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    // Works by rasterizing each page and recompressing it as an image —
    // real, meaningful savings for scans and photo-heavy PDFs, at the
    // honest cost of no longer having selectable text. Said plainly on
    // the tool page itself, not hidden in fine print.
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    shortDescription: "Reduce PDF file size, right in your browser.",
    keywords: ["compress", "shrink", "smaller", "reduce", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    // Extracts the real text from the PDF and lays it out as paragraphs in
    // a genuine, editable .docx — it does not reconstruct tables, images,
    // or exact layout. That honest limit is explained on the tool page,
    // not glossed over.
    slug: "pdf-to-word",
    name: "PDF to Word",
    category: "pdf",
    shortDescription: "Extract a PDF's text into an editable Word document.",
    keywords: ["pdf to word", "pdf to docx", "convert", "pdf", "word", "docx", "editable"],
    status: "live",
    clientSide: true,
  },
  {
    // Renders the .docx as HTML, then captures it as an image sliced across
    // PDF pages — looks and prints right, but (like Compress PDF) the text
    // ends up as a picture of text rather than selectable/searchable text.
    slug: "word-to-pdf",
    name: "Word to PDF",
    category: "pdf",
    shortDescription: "Convert a Word document (.docx) to PDF.",
    keywords: ["word to pdf", "docx to pdf", "convert", "pdf", "word", "docx"],
    status: "live",
    clientSide: true,
  },
  {
    // Detects PDF vs. .docx/.xlsx and compresses each the way that actually
    // fits it: PDFs via the same page-rasterization technique as Compress
    // PDF; Word/Excel by recompressing embedded JPEG photos and re-zipping
    // the archive (they're zip files under the hood) — never touching text,
    // formatting, or formulas. Honest about small savings on text-only files.
    slug: "document-compressor",
    name: "Document Compressor",
    category: "pdf",
    shortDescription: "Shrink a PDF, Word, or Excel file — each compressed the right way for its format.",
    keywords: ["document compressor", "compress document", "compress word", "compress excel", "compress docx", "compress xlsx", "reduce file size", "shrink"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    category: "image",
    shortDescription: "Change image dimensions precisely, in pixels or percent.",
    keywords: ["resize", "dimensions", "width", "height", "image", "photo"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "remove-image-metadata",
    name: "Remove Image Metadata",
    category: "image",
    shortDescription: "Strip EXIF and location data from a photo before you share it.",
    keywords: ["metadata", "exif", "location", "privacy", "strip", "remove"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    category: "pdf",
    shortDescription: "Rotate every page of a PDF 90, 180, or 270 degrees.",
    keywords: ["rotate", "turn", "sideways", "orientation", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    category: "pdf",
    shortDescription: "Stamp custom text diagonally across every page.",
    keywords: ["watermark", "stamp", "confidential", "draft", "brand", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    category: "pdf",
    shortDescription: "Number every page, with your choice of position and starting number.",
    keywords: ["page numbers", "number pages", "pagination", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    category: "pdf",
    shortDescription: "Trim margins evenly from every page with a single slider.",
    keywords: ["crop", "trim", "margin", "pdf"],
    status: "live",
    clientSide: true,
  },
  {
    // Real brightness/contrast/saturation/sharpen adjustments via Canvas —
    // deliberately not an AI upscaler, which would need a paid model and a
    // backend. That tradeoff is explained plainly on the tool page.
    slug: "image-enhancer",
    name: "Image Enhancer",
    category: "image",
    shortDescription: "Adjust brightness, contrast, saturation, and sharpness with a live preview.",
    keywords: ["enhance", "enhancer", "brightness", "contrast", "sharpen", "saturation", "image", "photo"],
    status: "live",
    clientSide: true,
  },
  // Summarize PDF and Chat with PDF are deliberately not listed yet — both
  // need a server route calling a paid LLM API, which means an API key and
  // a real decision about usage limits and cost. That's a decision for the
  // operator to make explicitly, not something to ship silently. Add two
  // entries here (category: "ai") once that decision is made and the
  // backend route exists — the homepage's AI section reappears on its own.
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getLiveTools(): ToolDefinition[] {
  return tools.filter((t) => t.status === "live");
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}

// Very deliberately NOT an AI call — this is free, instant, and reliable.
// Phase 2 revisits this only if real usage data shows rule-matching failing often.
export function matchToolFromPhrase(phrase: string): ToolDefinition | undefined {
  const normalized = phrase.toLowerCase().trim();
  if (!normalized) return undefined;

  let bestMatch: ToolDefinition | undefined;
  let bestScore = 0;

  for (const tool of tools) {
    let score = 0;
    for (const keyword of tool.keywords) {
      if (normalized.includes(keyword)) {
        score += keyword.split(" ").length; // multi-word keywords count more
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = tool;
    }
  }

  return bestScore > 0 ? bestMatch : undefined;
}
