import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import CtaBand from "@/components/sections/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "Before & After Results Gallery",
  description: "Discover real before and after results from Geneva Wellness Institute clients, including HIFU and CO2 laser treatments.",
  path: "/before-after",
});

export default function BeforeAfterPage() {
  return (
    <>
      <PageHero
        eyebrow="Real Results"
        title="Before & After Results"
        intro="Discover real before and after results from our clients. Drag the slider on each image to compare."
        crumbs={[{ label: "Before & After" }]}
      />
      <section className="section" aria-labelledby="ba-list-title">
        <div className="container">
          <h2 id="ba-list-title" className="visually-hidden">
            Before and after comparisons
          </h2>
          <BeforeAfterSection showHead={false} />
        </div>
      </section>
      <section className="section section--panel section--tight" aria-label="Gallery">
        <div className="container cta-inline">
          <h2 className="h3">See more in our clinic gallery</h2>
          <Link href="/gallery" className="btn btn--ghost">
            Open Gallery
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
