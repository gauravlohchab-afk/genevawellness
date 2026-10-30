/** Categories from the original blog's filters. */
export const BLOG_CATEGORIES = ["Skincare", "Treatments", "Beauty Tips", "Hair Health", "Wellness"] as const;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  author: string;
  coverImage: { src: string; alt: string } | null;
  /** Article body in simple Markdown (see lib/blog/markdown.ts). */
  body: string;
  status: "published" | "draft";
  /** Link to the article on the old site, kept for imported posts. */
  originalUrl?: string;
  updatedAt: string;
}
