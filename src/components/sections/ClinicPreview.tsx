import Link from "next/link";
import { clinics } from "@/content/clinics";
import { ArrowRight } from "../Icons";

export default function ClinicPreview() {
  return (
    <div className="clinic-preview">
      {clinics.map((c, i) => (
        <article
          key={c.id}
          className={`clinic-mini${c.primary ? " clinic-mini--primary" : ""}`}
          data-brand={c.brand}
          data-reveal
          style={{ ["--stagger" as string]: i }}
        >
          <span className={`status-pill${c.primary ? " status-pill--main" : ""}`}>
            {c.primary ? "Main clinic" : c.placeholder ? "Details coming soon" : `Location ${i + 1}`}
          </span>
          <h3>{c.name}</h3>
          {c.addressLines ? (
            <address>{c.addressLines.join(", ")}</address>
          ) : (
            <p className="clinic-card__note">Address to be announced.</p>
          )}
          <Link href={`/clinic-locator#${c.id}`} className="link-arrow" style={{ justifySelf: "start" }}>
            {c.placeholder ? "View location" : "Hours & directions"} <ArrowRight />
          </Link>
        </article>
      ))}
    </div>
  );
}
