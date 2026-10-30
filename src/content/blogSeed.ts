/**
 * Starting blog content, imported from https://www.genevawellness.ph/blog.php
 * (audited 29 Oct 2026). Titles, dates, categories, excerpts and images match the
 * original posts. The full article text could not be copied word for word, so each
 * body links to the original article until an admin pastes the full text in
 * /admin. This file is only used the first time the blog store is created.
 */
import { legacyAsset } from "@/lib/assets";
import type { BlogPost } from "@/lib/blog/types";

const imported = (url: string) =>
  `The full article is being moved to our new website. Until then, you can [read it on our current blog](${url}).`;

export const blogSeed: BlogPost[] = [
  {
    id: "seed-hair-care-tips",
    slug: "hair-care-tips",
    title: "Hair Care Tips for a Healthier Scalp",
    excerpt: "Explore essential tips for maintaining a healthy scalp and vibrant hair.",
    category: "Hair Health",
    date: "2024-11-18",
    author: "Geneva Wellness Team",
    coverImage: { src: legacyAsset("/img/blog-1-new.webp"), alt: "Woman with healthy, vibrant hair" },
    body: imported("https://www.genevawellness.ph/blog/hair-care-tips.php"),
    status: "published",
    originalUrl: "https://www.genevawellness.ph/blog/hair-care-tips.php",
    updatedAt: "2026-10-29T00:00:00.000Z",
  },
  {
    id: "seed-body-contouring-techniques",
    slug: "body-contouring-techniques",
    title: "Top 5 Body Contouring Techniques",
    excerpt: "Discover the most effective body contouring techniques to achieve your ideal figure",
    category: "Treatments",
    date: "2024-11-14",
    author: "Geneva Wellness Team",
    coverImage: { src: legacyAsset("/img/blog-2-new.webp"), alt: "Body contouring treatment in progress" },
    body: imported("https://www.genevawellness.ph/blog/body-contouring-techniques.php"),
    status: "published",
    originalUrl: "https://www.genevawellness.ph/blog/body-contouring-techniques.php",
    updatedAt: "2026-10-29T00:00:00.000Z",
  },
  {
    id: "seed-benefits-of-regular-facials",
    slug: "benefits-of-regular-facials",
    title: "The Benefits of Regular Facials",
    excerpt: "Unlock the secret to glowing, youthful skin with regular facials.",
    category: "Beauty Tips",
    date: "2024-11-10",
    author: "Geneva Wellness Team",
    coverImage: { src: legacyAsset("/img/blog-3-new.webp"), alt: "Woman enjoying a relaxing facial treatment" },
    body: imported("https://www.genevawellness.ph/blog/benefits-of-regular-facials.php"),
    status: "published",
    originalUrl: "https://www.genevawellness.ph/blog/benefits-of-regular-facials.php",
    updatedAt: "2026-10-29T00:00:00.000Z",
  },
];
