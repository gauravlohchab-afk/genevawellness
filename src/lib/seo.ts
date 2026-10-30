import type { Metadata } from "next";
import { brand, seo } from "@/content/site";

interface PageSeo {
  /** Page title without the brand suffix; omit for the homepage default. */
  title?: string;
  description: string;
  /** Canonical path, e.g. "/about". */
  path: string;
  openGraph?: Metadata["openGraph"];
}

/**
 * Per-page metadata. Next.js replaces (not merges) a parent's openGraph/twitter objects,
 * so every page sets its own titles, URL and description here. Share images come from
 * each route's opengraph-image file, which Next.js adds automatically.
 */
export function pageMetadata({ title, description, path, openGraph }: PageSeo): Metadata {
  // Keep titles readable in search results (~65 chars): long page titles drop the brand suffix.
  const branded = title ? `${title} | ${brand.name}` : seo.defaultTitle;
  const fullTitle = title && branded.length > 65 ? title : branded;
  return {
    ...(title && { title: fullTitle === title ? { absolute: title } : title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: brand.name,
      locale: "en_PH",
      url: path,
      title: fullTitle,
      description,
      ...openGraph,
    } as Metadata["openGraph"],
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
