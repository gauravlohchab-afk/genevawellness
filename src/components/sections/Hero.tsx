import Link from "next/link";
import BookButton from "@/components/booking/BookButton";
import { ArrowRight } from "@/components/Icons";
import SmartImage from "@/components/SmartImage";
import { hero, stats } from "@/content/site";
import { treatments } from "@/content/treatments";
import { heroGallery } from "@/lib/assets";

const SEAL_TEXT = "Non-invasive · Personalised · Expert care · ";

/** Homepage hero: layered arch composition, masked headline, trust row and treatment marquee. */
export default function Hero() {
  const trust = stats.filter((s) => s.label !== "Treatments");
  const names = treatments.map((t) => t.name);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__ornament" aria-hidden="true" data-parallax="-0.12" />
        <div className="hero__ornament hero__ornament--sm" aria-hidden="true" data-parallax="0.18" />

        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow hero-rise" style={{ ["--d" as string]: 0 }}>
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className="display hero__title">
              <span className="line-mask">
                <span style={{ ["--d" as string]: 1 }}>Transformative</span>
              </span>
              <span className="line-mask">
                <span style={{ ["--d" as string]: 2 }}>Wellness</span>
              </span>
              <span className="line-mask">
                <span className="accent accent--pop" style={{ ["--d" as string]: 3 }}>
                  &amp; Aesthetic Treatments
                </span>
              </span>
            </h1>
            <p className="lede hero-rise" style={{ ["--d" as string]: 4 }}>
              {hero.body}
            </p>
            <div className="btn-row hero-rise" style={{ ["--d" as string]: 5 }}>
              <BookButton source="home-hero">{hero.primaryCta}</BookButton>
              <Link href="/treatments" className="btn btn--ghost">
                {hero.secondaryCta} <ArrowRight />
              </Link>
            </div>
            <dl className="hero__trust hero-rise" style={{ ["--d" as string]: 6 }}>
              {trust.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>
                    {s.value.toLocaleString("en-US")}
                    <span>{s.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hero__visual">
            <div className="hero__arch" data-parallax="0.06">
              <SmartImage src={hero.image.src} alt={hero.image.alt} frame="media hero__main" priority />
            </div>
            <div className="hero__float hero__float--a" data-parallax="-0.14">
              <SmartImage src={heroGallery[0].src} alt={heroGallery[0].alt} frame="media" priority />
            </div>
            <div className="hero__float hero__float--b" data-parallax="0.2">
              <SmartImage src={heroGallery[1].src} alt={heroGallery[1].alt} frame="media" />
            </div>
            <svg className="hero__seal" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="hero-seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <circle cx="100" cy="100" r="98" />
              <text>
                {/* Stretched to the circle's circumference (2π × 78) so the phrase meets itself exactly. */}
                <textPath href="#hero-seal-path" textLength="488" lengthAdjust="spacing">
                  {SEAL_TEXT + SEAL_TEXT}
                </textPath>
              </text>
              <path className="hero__seal-star" d="M100 78 L106 94 L122 100 L106 106 L100 122 L94 106 L78 100 L94 94 Z" />
            </svg>
          </div>
        </div>

        <a href="#about-title" className="hero__scroll" aria-label="Scroll to introduction">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <ul key={k}>
              {names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
