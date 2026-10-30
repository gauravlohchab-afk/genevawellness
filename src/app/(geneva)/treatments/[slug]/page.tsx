import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "@/components/booking/BookButton";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { ArrowRight, Check } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import TreatmentCard from "@/components/sections/TreatmentCard";
import SmartImage from "@/components/SmartImage";
import { beforeAfterIntro, beforeAfterPairs } from "@/content/beforeAfter";
import { getCategory, getTreatment, treatments, treatmentsInCategory } from "@/content/treatments";
import { treatmentJsonLd } from "@/lib/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};
  return pageMetadata({
    title: t.title,
    description: `${t.tagline}. ${t.description.join(" ")}`.slice(0, 160),
    path: `/treatments/${t.slug}`,
  });
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();
  const category = getCategory(t.category);
  const related = treatmentsInCategory(t.category).filter((x) => x.slug !== t.slug).slice(0, 3);
  const results = beforeAfterPairs.filter((p) => p.treatmentSlug === t.slug);

  const jsonLd = treatmentJsonLd(t, category.name);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={t.tagline}
        title={t.title}
        crumbs={[
          { label: "Treatments", href: "/treatments" },
          { label: category.name, href: `/treatments#${category.id}` },
          { label: t.name },
        ]}
      />

      <section className="section">
        <div className="container detail">
          <div className="detail__media">
            {t.label && <span className="pill">{t.label}</span>}
            <SmartImage src={t.image.src} alt={t.image.alt} frame="media" priority />
          </div>
          <div className="detail__copy" data-reveal>
            {t.alsoKnownAs && (
              <p className="eyebrow" style={{ marginBottom: 0 }}>
                Also known as {t.alsoKnownAs}
              </p>
            )}
            <div className="prose">
              {t.description.map((p) => (
                <p key={p.slice(0, 24)} className="lede">
                  {p}
                </p>
              ))}
            </div>

            <div className="panel">
              <h2>Key benefits</h2>
              <ul className="check-list">
                {t.benefits.map((b) => (
                  <li key={b}>
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {t.homepageDetail && (
              <div>
                <h2 className="h3" style={{ marginBottom: 12 }}>
                  {t.homepageDetail.heading}
                </h2>
                <p style={{ color: "var(--c-muted)", marginBottom: 16 }}>{t.homepageDetail.intro}</p>
                <ul className="check-list">
                  {t.homepageDetail.benefits.map((b) => (
                    <li key={b}>
                      <Check />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="panel panel--outline">
              <h2>Is {t.name} right for you?</h2>
              <p className="text-muted">
                Every treatment is personalized to your unique skin type and concerns. Book a free consultation and our team will
                guide you toward the best option for your goals.
              </p>
              <div className="btn-row">
                <BookButton treatment={t.name} source={`treatment-${t.slug}`}>
                  Book {t.name} Consultation
                </BookButton>
                <Link href="/clinic-locator" className="btn btn--ghost">
                  Find a Clinic
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {results.length > 0 && (
        <section className="section section--panel" aria-labelledby="results-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <p className="eyebrow">Real Results</p>
              <h2 id="results-title" className="h2">
                {t.name} before &amp; after
              </h2>
            </div>
            <div className="ba-grid">
              {results.map((pair) => (
                <article className="ba-card" key={pair.id}>
                  <BeforeAfterSlider pair={pair} />
                  <div className="ba-card__meta">
                    <div>
                      <h3>{pair.treatmentName}</h3>
                      <p>{pair.caption}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="disclaimer" style={{ marginTop: 28 }}>
              {beforeAfterIntro.disclaimer}
            </p>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <div className="container">
            <div className="section-head section-head--split" data-reveal>
              <div>
                <p className="eyebrow">{category.name}</p>
                <h2 id="related-title" className="h2">
                  You may also like
                </h2>
              </div>
              <div>
                <Link href={`/treatments#${category.id}`} className="link-arrow">
                  All {category.name} <ArrowRight />
                </Link>
              </div>
            </div>
            <div className="card-grid">
              {related.map((r, i) => (
                <TreatmentCard key={r.slug} t={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
