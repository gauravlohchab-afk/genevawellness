import Link from "next/link";
import { beforeAfterIntro, beforeAfterPairs } from "@/content/beforeAfter";
import BeforeAfterSlider from "../BeforeAfterSlider";
import { ArrowRight } from "../Icons";
import SectionHead from "./SectionHead";

export default function BeforeAfterSection({ headingAs = "h2", showHead = true }: { headingAs?: "h1" | "h2"; showHead?: boolean }) {
  return (
    <>
      {showHead && (
        <SectionHead
          as={headingAs}
          eyebrow="Real Results"
          title={
            <>
              See the <span className="accent accent--pop">transformation</span>
            </>
          }
          lede={beforeAfterIntro.body}
        />
      )}
      <div className="ba-grid">
        {beforeAfterPairs.map((pair, i) => (
          <article className="ba-card" key={pair.id} data-reveal style={{ ["--stagger" as string]: i }}>
            <BeforeAfterSlider pair={pair} />
            <div className="ba-card__meta">
              <div>
                <h3>{pair.treatmentName}</h3>
                <p>{pair.caption}</p>
              </div>
              <Link href={`/treatments/${pair.treatmentSlug}`} className="link-arrow">
                About the treatment <ArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="disclaimer" style={{ marginTop: 36 }}>
        {beforeAfterIntro.disclaimer}
      </p>
    </>
  );
}
