import type { Metadata } from "next";
import Link from "next/link";
import BookButton from "@/components/booking/BookButton";
import CountUp from "@/components/CountUp";
import { ArrowRight } from "@/components/Icons";
import { LaveeLockup } from "@/components/Logos";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import Hero from "@/components/sections/Hero";
import ClinicPreview from "@/components/sections/ClinicPreview";
import CtaBand from "@/components/sections/CtaBand";
import Quotes from "@/components/sections/Quotes";
import ScrollStory from "@/components/sections/ScrollStory";
import SectionHead from "@/components/sections/SectionHead";
import TreatmentCard from "@/components/sections/TreatmentCard";
import SmartImage from "@/components/SmartImage";
import YouTubeLite from "@/components/YouTubeLite";
import { lavee } from "@/content/lavee";
import PostCard from "@/components/sections/PostCard";
import { listPosts } from "@/lib/blog/store";
import { about, bookingSteps, featureStories, seo, stats, storyVideo } from "@/content/site";
import { featuredTreatmentSlugs, getTreatment, treatmentCategories, treatmentsInCategory } from "@/content/treatments";
import { clinicJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ description: seo.description, path: "/" });

// Re-rendered when blog posts change (see admin actions) and at least every 5 minutes.
export const revalidate = 300;

export default async function HomePage() {
  const posts = (await listPosts()).slice(0, 3);
  const featured = featuredTreatmentSlugs.map((s) => getTreatment(s)!);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([clinicJsonLd(), websiteJsonLd()]) }} />

      {/* B — Hero */}
      <Hero />

      {/* C — Introduction */}
      <section className="section" aria-labelledby="about-title">
        <div className="container split">
          <div className="collage">
            <SmartImage src={about.images[0].src} alt={about.images[0].alt} frame="media" reveal />
            <SmartImage src={about.images[1].src} alt={about.images[1].alt} frame="media" reveal />
          </div>
          <div data-reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 id="about-title" className="h2">
              Your journey to becoming <span className="accent accent--pop">the best version of yourself</span>
            </h2>
            <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="lede">
                  {p}
                </p>
              ))}
            </div>
            <div className="pillars">
              {about.pillars.map((p, i) => (
                <div className="pillar" key={p.title}>
                  <span className="pillar__num">0{i + 1}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="link-arrow" style={{ marginTop: 24 }}>
              Read More About Us <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* D — Treatment categories */}
      <section className="section section--tight" aria-labelledby="cats-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="Our Treatments"
            title={
              <span id="cats-title">
                Premium <span className="accent accent--pop">non-invasive</span> treatments
              </span>
            }
            lede="Advanced aesthetic procedures for anti-aging, body contouring & hair restoration"
          />
          <div className="category-grid rail">
            {treatmentCategories.map((c, i) => (
              <Link key={c.id} href={`/treatments#${c.id}`} className="category-tile" data-reveal style={{ ["--stagger" as string]: i }}>
                <SmartImage src={c.image.src} alt={c.image.alt} frame="media media--zoom" />
                <div className="category-tile__body">
                  <span className="category-tile__count">{treatmentsInCategory(c.id).length} treatments</span>
                  <h3>{c.name}</h3>
                  <p>{c.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* E — Feature stories (the original homepage slides), as a pinned scroll story */}
      <ScrollStory stories={featureStories} />

      {/* E — Featured treatments */}
      <section className="section section--panel" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head section-head--split" data-reveal>
            <div>
              <p className="eyebrow">Our Advanced Treatments</p>
              <h2 id="featured-title" className="h2">
                Explore our serene environment &amp; <span className="accent accent--pop">treatments in action</span>
              </h2>
            </div>
            <div>
              <Link href="/treatments" className="link-arrow">
                View all treatments <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="card-grid card-grid--4 rail">
            {featured.map((t, i) => (
              <TreatmentCard key={t.slug} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* G — Before & After */}
      <section className="section" id="before-after" aria-label="Before and after results">
        <div className="container">
          <BeforeAfterSection />
          <div style={{ marginTop: 32 }}>
            <Link href="/before-after" className="btn btn--ghost">
              View the full gallery
            </Link>
          </div>
        </div>
      </section>

      {/* F — Expertise in numbers */}
      <section className="section--deep" aria-label="Geneva Wellness in numbers">
        <div className="container">
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__value">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="stat__label">
                  {s.label}
                  {s.note && <span className="stat__note">{s.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="section section--panel" aria-labelledby="video-title">
        <div className="container split">
          <div data-reveal>
            <p className="eyebrow">Watch Our Story</p>
            <h2 id="video-title" className="h2">
              Experience <span className="accent accent--pop">Geneva Wellness</span> in action
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              {storyVideo.body}
            </p>
          </div>
          <div data-reveal>
            <YouTubeLite id={storyVideo.id} title={storyVideo.title} thumb="maxresdefault" />
          </div>
        </div>
      </section>

      {/* H — Lavee. On a Geneva page Lavee appears as its lavender logo on cream (kit p.8). */}
      <section className="section lavee-feature" data-brand="lavee" data-brand-zone="lavee" aria-labelledby="lavee-title">
        <div className="container lavee-feature__grid">
          <div className="lavee-feature__logo" data-reveal="fade">
            <LaveeLockup width={300} />
          </div>
          <div data-reveal style={{ display: "grid", gap: 20, justifyItems: "start" }}>
            <p className="eyebrow">{lavee.secondaryLine}</p>
            <h2 id="lavee-title" className="h2">
              Introducing {lavee.fullName}
            </h2>
            <p className="accent" style={{ fontSize: "1.45rem", color: "var(--lavee-plum)" }}>
              {lavee.headline}.
            </p>
            <p className="lede">{lavee.intro}</p>
            <div className="btn-row btn-row--link">
              <Link href="/lavee" className="btn">
                Discover Lavee
              </Link>
              <Link href="/clinic-locator#lavee" className="link-arrow">
                Find the Lavee clinic <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" aria-labelledby="quotes-title">
        <div className="container">
          <div className="section-head section-head--split" data-reveal>
            <div>
              <p className="eyebrow">Client Stories</p>
              <h2 id="quotes-title" className="h2">
                What our clients <span className="accent accent--pop">say</span>
              </h2>
            </div>
            <div>
              <Link href="/testimonials" className="link-arrow">
                Watch video testimonials <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="rail-wrap">
            <Quotes />
          </div>
        </div>
      </section>

      {/* How booking works */}
      <section className="section section--deep" aria-labelledby="steps-title">
        <div className="container">
          <SectionHead
            eyebrow="How to Book"
            title={
              <span id="steps-title">
                Four simple steps to <span className="accent accent--pop">your visit</span>
              </span>
            }
          />
          <ol className="steps">
            {bookingSteps.map((s, i) => (
              <li className="step" key={s.title} data-reveal style={{ ["--stagger" as string]: i }}>
                <span className="step__num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p className="step__sub">{s.subtitle}</p>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 48 }} data-reveal>
            <BookButton className="btn btn--light" source="home-steps">
              Start with Step 1
            </BookButton>
          </div>
        </div>
      </section>

      {/* I — Clinic locator preview */}
      <section className="section section--panel" aria-labelledby="clinics-title">
        <div className="container">
          <div className="section-head section-head--split" data-reveal>
            <div>
              <p className="eyebrow">Clinic Locator</p>
              <h2 id="clinics-title" className="h2">
                Find your <span className="accent accent--pop">clinic</span>
              </h2>
            </div>
            <div>
              <Link href="/clinic-locator" className="btn btn--ghost">
                Open Clinic Locator
              </Link>
            </div>
          </div>
          <ClinicPreview />
        </div>
      </section>

      {/* Blog */}
      <section className="section" aria-labelledby="blog-title">
        <div className="container">
          <div className="section-head section-head--split" data-reveal>
            <div>
              <p className="eyebrow">Our Blog</p>
              <h2 id="blog-title" className="h2">
                Insights for <span className="accent accent--pop">skin, body &amp; hair</span>
              </h2>
            </div>
            <div>
              <Link href="/blog" className="link-arrow">
                View All Blog Posts <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="card-grid card-grid--3 rail">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* J — Final CTA */}
      <CtaBand />
    </>
  );
}
