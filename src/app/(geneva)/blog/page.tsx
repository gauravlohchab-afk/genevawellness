import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import PostCard from "@/components/sections/PostCard";
import { listPosts } from "@/lib/blog/store";
import { BLOG_CATEGORIES } from "@/lib/blog/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Wellness & Skincare Blog",
  description: "Expert advice on laser treatments, anti-aging, body contouring, and beauty tips from our aesthetic specialists.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = await listPosts();
  const active = BLOG_CATEGORIES.find((c) => c === category);
  const posts = active ? all.filter((p) => p.category === active) : all;
  const counts = Object.fromEntries(BLOG_CATEGORIES.map((c) => [c, all.filter((p) => p.category === c).length]));

  return (
    <>
      <PageHero
        eyebrow="Our Blog"
        title="Wellness & Skincare Blog"
        intro="Expert advice on laser treatments, anti-aging, body contouring, and beauty tips from our aesthetic specialists"
        crumbs={[{ label: "Blog" }]}
      >
        <nav aria-label="Blog categories">
          <ul className="chips">
            <li className={!active ? "is-active" : undefined}>
              <Link href="/blog" aria-current={!active ? "page" : undefined}>
                All Posts ({all.length})
              </Link>
            </li>
            {BLOG_CATEGORIES.map((c) => (
              <li key={c} className={active === c ? "is-active" : undefined}>
                <Link href={`/blog?category=${encodeURIComponent(c)}`} aria-current={active === c ? "page" : undefined}>
                  {c} ({counts[c]})
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section className="section" aria-labelledby="articles-title">
        <div className="container">
          <h2 id="articles-title" className="visually-hidden">
            {active ? `${active} articles` : "Latest articles"}
          </h2>
          {posts.length ? (
            <div className="card-grid card-grid--3">
              {posts.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="placeholder-box" role="status">
              <strong>No articles in {active ?? "this category"} yet.</strong> <Link href="/blog">See all posts</Link>.
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
