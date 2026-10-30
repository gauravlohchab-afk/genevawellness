import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import BookButton from "@/components/booking/BookButton";
import { LaveeLockup } from "@/components/Logos";
import ClinicCard from "@/components/sections/ClinicCard";
import { getClinic } from "@/content/clinics";
import { lavee } from "@/content/lavee";

export const metadata: Metadata = pageMetadata({
  title: "Lavee by Geneva Wellness",
  description: `${lavee.headline}. ${lavee.intro} Lavee is a Geneva Wellness Institute location.`,
  path: "/lavee",
});

export default function LaveePage() {
  const clinic = getClinic("lavee")!;
  const lines = [lavee.headline + ".", ...lavee.voiceLines];

  return (
    <>
      {/* Cover: aubergine ground, cream logo (kit p.8 "Covers & first frames") */}
      <section className="lavee-hero" aria-labelledby="lavee-hero-title">
        <span className="lavee-ring" style={{ width: 620, height: 620, top: -260, right: -180 }} aria-hidden="true" />
        <span className="lavee-ring" style={{ width: 420, height: 420, bottom: -220, left: -140 }} aria-hidden="true" />
        <div className="container lavee-hero__inner hero-in">
          <LaveeLockup dark width={320} priority />
          <h1 id="lavee-hero-title">{lavee.headline}</h1>
          <p className="accent">{lavee.accentLine}</p>
          <p className="lede">{lavee.intro}</p>
          <div className="btn-row btn-row--center">
            <BookButton className="btn btn--light" clinicId="lavee" brand="lavee" source="lavee-hero">
              {lavee.cta}
            </BookButton>
            <Link href="#visit" className="btn btn--ghost-light">
              Find Lavee
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="lavee-about-title">
        <div className="container">
          <div className="section-head section-head--center" data-reveal>
            <p className="eyebrow">{lavee.secondaryLine}</p>
            <h2 id="lavee-about-title" className="h2">
              Slow down, <span className="accent accent--pop">you&apos;ve earned it</span>
            </h2>
            <p className="lede">
              {lavee.fullName} brings the expertise of Geneva Wellness Institute to a calmer, more unhurried setting, with care
              that fits your skin and your story.
            </p>
          </div>
          <div className="voice-grid">
            {lines.map((l, i) => (
              <div className="voice-card" key={l} data-reveal style={{ ["--stagger" as string]: i }}>
                <span className="voice-card__num">0{i + 1}</span>
                <p className="accent">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--panel" aria-labelledby="lavee-menu-title">
        <div className="container container--narrow" style={{ display: "grid", gap: 20 }}>
          <p className="eyebrow">Treatments</p>
          <h2 id="lavee-menu-title" className="h2">
            The Lavee menu
          </h2>
          <div className="placeholder-box" role="note">
            <strong>Coming soon.</strong> Lavee&apos;s treatment menu and prices will be published here once confirmed by the clinic.
            In the meantime, request a session and our team will walk you through what&apos;s available.
          </div>
          <div>
            <BookButton clinicId="lavee" brand="lavee" source="lavee-menu">
              {lavee.cta}
            </BookButton>
          </div>
        </div>
      </section>

      <section className="section" id="visit" aria-label="Visit Lavee">
        <div className="container">
          <ClinicCard clinic={clinic} index={2} />
        </div>
      </section>

      {/* End card (kit p.7): logo, endorsement, CTA, sub-line, small line. */}
      <section className="section" aria-labelledby="lavee-end-title" style={{ textAlign: "center", borderTop: "1px solid var(--lavee-heather)" }}>
        <div className="container" style={{ display: "grid", justifyItems: "center", gap: 22 }} data-reveal>
          <LaveeLockup width={240} />
          <h2 id="lavee-end-title" className="h2" style={{ letterSpacing: "0.08em" }}>
            {lavee.cta}
          </h2>
          <p className="accent" style={{ fontSize: "1.35rem", color: "var(--lavee-plum)" }}>
            {lavee.accentLine}
          </p>
          <BookButton clinicId="lavee" brand="lavee" source="lavee-end-card">
            {lavee.cta}
          </BookButton>
          <p style={{ fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--lavee-plum)" }}>
            Lavee · {lavee.secondaryLine}
          </p>
          <Link href="/" className="link-arrow">
            Visit Geneva Wellness Institute
          </Link>
        </div>
      </section>
    </>
  );
}
