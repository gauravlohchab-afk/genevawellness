import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import SmartImage from "../SmartImage";

const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function PostCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="post-card" data-reveal style={{ ["--stagger" as string]: index % 3 }}>
      {post.coverImage ? (
        <SmartImage src={post.coverImage.src} alt={post.coverImage.alt} frame="media media--zoom" />
      ) : (
        <div className="media" aria-hidden="true" />
      )}
      <p className="post-card__meta">
        {post.category} · <time dateTime={post.date}>{fmt(post.date)}</time>
      </p>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </Link>
  );
}
