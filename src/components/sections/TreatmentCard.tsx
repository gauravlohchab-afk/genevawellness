import Link from "next/link";
import { getCategory, type Treatment } from "@/content/treatments";
import { ArrowRight } from "../Icons";
import SmartImage from "../SmartImage";

export default function TreatmentCard({ t, index = 0, headingLevel = 3 }: { t: Treatment; index?: number; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <Link href={`/treatments/${t.slug}`} className="t-card" data-reveal style={{ ["--stagger" as string]: index % 4 }}>
      <div className="t-card__visual">
        {t.label && <span className="pill">{t.label}</span>}
        <span className="t-card__num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <SmartImage src={t.image.src} alt={t.image.alt} frame="media media--zoom" />
        {/* Key benefits rise over the photo on hover; the same list is on the detail page. */}
        <div className="t-card__reveal" aria-hidden="true">
          <span>Key benefits</span>
          <ul>
            {t.benefits.slice(0, 3).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="t-card__body">
        <p className="t-card__cat">{getCategory(t.category).name}</p>
        <H>{t.name}</H>
        <p className="t-card__tag">{t.tagline}</p>
        <p className="t-card__desc">{t.description[0]}</p>
        <span className="t-card__cta">
          Discover
          <span className="t-card__arrow" aria-hidden="true">
            <ArrowRight />
          </span>
        </span>
      </div>
    </Link>
  );
}
