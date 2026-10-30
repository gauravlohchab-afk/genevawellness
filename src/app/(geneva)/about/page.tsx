import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import SectionHead from "@/components/sections/SectionHead";
import SmartImage from "@/components/SmartImage";
import YouTubeLite from "@/components/YouTubeLite";
import { about, aboutPage, aboutVideo, brand, storyVideo } from "@/content/site";
import { primaryClinic } from "@/content/clinics";

export const metadata: Metadata = pageMetadata({
  title: "Meet Our Aesthetic Specialists",
  description: aboutPage.intro,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Meet Our Aesthetic Specialists" intro={aboutPage.intro} crumbs={[{ label: "About" }]} />

      <section className="section" aria-labelledby="welcome-title">
        <div className="container split">
          <SmartImage src={about.images[0].src} alt={about.images[0].alt} frame="media ratio-4x5" reveal />
          <div data-reveal style={{ display: "grid", gap: 18 }}>
            <p className="eyebrow">Our Mission</p>
            <h2 id="welcome-title" className="h2">
              {aboutPage.heading}
            </h2>
            {aboutPage.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="lede">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--panel" aria-labelledby="values-title">
        <div className="container">
          <SectionHead
            eyebrow="Excellence in Aesthetic & Wellness Care"
            title={<span id="values-title">What we stand for</span>}
          />
          <div className="card-grid card-grid--4">
            {aboutPage.values.map((v, i) => (
              <div key={v.title} className="panel" style={{ background: "var(--c-bg)", ["--stagger" as string]: i }} data-reveal>
                <span className="pillar__num">0{i + 1}</span>
                <h3 className="h3">{v.title}</h3>
                <p className="text-muted">{v.body}</p>
              </div>
            ))}
          </div>
          <ul className="chips" style={{ marginTop: 40 }} aria-label="Credentials">
            {brand.trustBadges.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="tour-title">
        <div className="container split">
          <div data-reveal style={{ display: "grid", gap: 18, justifyItems: "start" }}>
            <p className="eyebrow">Our Story</p>
            <h2 id="tour-title" className="h2">
              Inside Geneva Wellness Institute
            </h2>
            <p className="lede">{storyVideo.body}</p>
            <Link href="/clinic-locator" className="link-arrow">
              Visit us in {primaryClinic.addressLines ? "Alabang" : "our clinics"} <ArrowRight />
            </Link>
          </div>
          <div data-reveal>
            {/* As on the original about-us.php: the storefront photo opens the clinic video. */}
            <YouTubeLite id={aboutVideo.id} title={aboutVideo.title} poster={aboutPage.image.src} />
          </div>
        </div>
      </section>

      <section className="section section--panel" aria-label="Team">
        <div className="container container--narrow">
          <div className="placeholder-box" role="note">
            <strong>Team profiles.</strong> The current website does not list individual doctors or specialists. Names, photos
            and credentials will be added here once the clinic provides them.
          </div>
        </div>
      </section>

      <CtaBand title={aboutPage.cta.heading} body={aboutPage.cta.body} />
    </>
  );
}
