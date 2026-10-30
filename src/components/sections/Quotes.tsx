import { testimonials } from "@/content/site";

export default function Quotes() {
  return (
    <div className="quotes">
      {testimonials.map((t, i) => (
        <figure className="quote" key={t.name} data-reveal style={{ ["--stagger" as string]: i }}>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <strong>{t.name}</strong>
            <span>{t.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
