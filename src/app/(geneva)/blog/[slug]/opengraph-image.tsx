import { renderOg } from "@/lib/og";
import { brand } from "@/content/site";
import { getPostBySlug } from "@/lib/blog/store";

export const alt = "Geneva Wellness Institute blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return renderOg({
    eyebrow: post?.category ?? "Our Blog",
    title: post?.title ?? brand.name,
    photo: post?.coverImage?.src,
  });
}
