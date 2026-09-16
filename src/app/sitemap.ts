import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  // www.doclyn.me is the actual Production domain in Vercel (the apex
  // doclyn.me just 308-redirects to it) — the sitemap should list the real
  // destination URLs, not ones that immediately redirect.
  const base = "https://www.doclyn.me";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === "live")
    .map((t) => ({
      url: `${base}/tools/${t.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...toolRoutes];
}
