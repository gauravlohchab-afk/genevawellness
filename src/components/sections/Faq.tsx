import { faqJsonLd, type FaqItem } from "@/lib/jsonld";

/**
 * Visible questions and answers plus matching FAQPage structured data. Answers are plain
 * text so the markup and the page say exactly the same thing.
 */
export default function Faq({
  id,
  eyebrow = "FAQ",
  title,
  items,
  panel = false,
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  items: FaqItem[];
  panel?: boolean;
}) {
  return (
    <section className={`section${panel ? " section--panel" : ""}`} aria-labelledby={id}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }} />
      <div className="container container--narrow">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={id} className="h2">
            {title}
          </h2>
        </div>
        <div className="faq">
          {items.map((f, i) => (
            <details className="faq__item" key={f.q} open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
