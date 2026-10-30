import { renderOg } from "@/lib/og";
import { listPosts } from "@/lib/blog/store";

export const alt = "Geneva Wellness Institute blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [latest] = await listPosts();
  return renderOg({
    eyebrow: "Our Blog",
    title: "Wellness & Skincare Blog",
    subtitle: "Expert advice on lasers, anti-aging, body contouring and hair.",
    photo: latest?.coverImage?.src,
  });
}
