import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "@/components/booking/BookButton";
import { ArrowRight } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PostCard from "@/components/sections/PostCard";
import SmartImage from "@/components/SmartImage";
import { SITE_URL, brand } from "@/content/site";
import { readingMinutes, renderMarkdown } from "@/lib/blog/markdown";
import { getPostBySlug, listPosts } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    openGraph: { type: "article", publishedTime: post.date, modifiedTime: post.updatedAt, section: post.category },
  });
}

const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = (await listPosts()).filter((p) => p.id !== post.id).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author || brand.name },
    publisher: { "@type": "Organization", name: brand.name },
    image: post.coverImage?.src,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={post.category}
        title={post.title}
        intro={post.excerpt}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      >
        <p className="post-card__meta">
          <time dateTime={post.date}>{fmt(post.date)}</time> · {post.author} · {readingMinutes(post.body)} min read
        </p>
      </PageHero>

      <article className="section">
        <div className="container container--narrow" style={{ display: "grid", gap: 40 }}>
          {post.coverImage && <SmartImage src={post.coverImage.src} alt={post.coverImage.alt} frame="media ratio-16x9" priority />}
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
          <div className="panel">
            <h2>Have questions about your skin, body or hair goals?</h2>
            <p className="text-muted">Schedule a free consultation with our experts today.</p>
            <div className="btn-row">
              <BookButton source={`blog-${post.slug}`}>Book Free Consultation</BookButton>
              <Link href="/treatments" className="btn btn--ghost">
                Explore Treatments
              </Link>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section--panel" aria-labelledby="related-title">
          <div className="container">
            <div className="section-head section-head--split" data-reveal>
              <div>
                <p className="eyebrow">Keep reading</p>
                <h2 id="related-title" className="h2">
                  Related articles
                </h2>
              </div>
              <div>
                <Link href="/blog" className="link-arrow">
                  All articles <ArrowRight />
                </Link>
              </div>
            </div>
            <div className="card-grid card-grid--3">
              {related.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
