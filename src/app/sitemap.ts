import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { treatments } from "@/content/treatments";
import { listPosts } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts();
  const now = new Date();
  const pages = ["", "/treatments", "/before-after", "/about", "/amenities", "/testimonials", "/clinic-locator", "/lavee", "/gallery", "/blog"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...treatments.map((t) => ({ url: `${SITE_URL}/treatments/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
