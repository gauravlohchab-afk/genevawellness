import Link from "next/link";
import BookButton from "../booking/BookButton";

export default function CtaBand({
  title = "Ready to Transform Your Wellness Journey?",
  body = "Schedule a free consultation with our experts today. Let's discuss your goals and create a personalized treatment plan.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section section--deep cta-band" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band__inner" data-reveal>
          <p className="eyebrow">Free Consultation</p>
          <h2 id="cta-title" className="h2">
            {title}
          </h2>
          <p className="lede" style={{ marginInline: "auto" }}>
            {body}
          </p>
          <div className="btn-row btn-row--center">
            <BookButton className="btn btn--light" source="cta-band">
              Book Free Consultation
            </BookButton>
            <Link href="/treatments" className="btn btn--ghost-light">
              Explore Treatments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
