import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Quotes from "@/components/sections/Quotes";
import SectionHead from "@/components/sections/SectionHead";
import YouTubeLite from "@/components/YouTubeLite";
import { videoTestimonials } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Client Testimonials",
  description: "Real stories from patients who transformed their beauty and confidence at Geneva Wellness Institute.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Real Stories"
        title="Client Testimonials"
        intro="Real stories from patients who transformed their beauty and confidence"
        crumbs={[{ label: "Testimonials" }]}
      />
      <section className="section" aria-labelledby="videos-title">
        <div className="container">
          <SectionHead eyebrow="Watch" title={<span id="videos-title">In their own words</span>} />
          <div className="card-grid">
            {videoTestimonials.map((v, i) => (
              <div key={v.id} data-reveal style={{ ["--stagger" as string]: i % 3 }}>
                <YouTubeLite id={v.id} title={v.title} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--panel" aria-labelledby="written-title">
        <div className="container">
          <SectionHead eyebrow="Client Stories" title={<span id="written-title">What our clients say</span>} />
          <Quotes />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
