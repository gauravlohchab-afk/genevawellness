import type { MetadataRoute } from "next";
import { SITE_URL, contentUpdated, hero } from "@/content/site";
import { treatments } from "@/content/treatments";
import { listPosts } from "@/lib/blog/store";
import { isPlaceholderPost } from "@/lib/blog/types";
import { absoluteUrl } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const pages: { path: string; priority: number; images?: string[] }[] = [
  { path: "", priority: 1, images: [hero.image.src] },
  { path: "/treatments", priority: 0.9 },
  { path: "/clinic-locator", priority: 0.9 },
  { path: "/before-after", priority: 0.8 },
  { path: "/about", priority: 0.8 },
  { path: "/amenities", priority: 0.7 },
  { path: "/testimonials", priority: 0.7 },
  { path: "/lavee", priority: 0.7, images: ["/brand/lavee-lavender.png"] },
  { path: "/gallery", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await listPosts()).filter((p) => !isPlaceholderPost(p));
  const lastModified = new Date(`${contentUpdated}T00:00:00+08:00`);
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.priority,
      ...(p.images && { images: p.images.map(absoluteUrl) }),
    })),
    ...treatments.map((t) => ({
      url: `${SITE_URL}/treatments/${t.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [absoluteUrl(t.image.src)],
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(p.coverImage && { images: [absoluteUrl(p.coverImage.src)] }),
    })),
  ];
}
