import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { ArrowRight } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { clinicGallery } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Clinic Gallery",
  description: "Step inside Geneva Wellness Institute in Alabang: our treatment suites, facial and body rituals, and the technology behind your results.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Aesthetic Results Gallery"
        intro="Discover real before and after results from our clients."
        crumbs={[{ label: "Gallery" }]}
      >
        <Link href="/before-after" className="link-arrow">
          Compare results side by side <ArrowRight />
        </Link>
      </PageHero>
      <section className="section" aria-label="Gallery images">
        <div className="container">
          <Gallery images={clinicGallery} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
