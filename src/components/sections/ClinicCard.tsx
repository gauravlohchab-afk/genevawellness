import type { Clinic } from "@/content/clinics";
import BookButton from "../booking/BookButton";
import ClinicMap from "../ClinicMap";
import { ArrowRight } from "../Icons";
import { LaveeLogo } from "../Logos";

const TBC = <span className="clinic-card__note">To be confirmed</span>;

export default function ClinicCard({ clinic, index }: { clinic: Clinic; index: number }) {
  const isLavee = clinic.brand === "lavee";
  const headingId = `clinic-${clinic.id}`;
  return (
    <article
      id={clinic.id}
      className={`clinic-card${clinic.primary ? " clinic-card--primary" : ""}`}
      data-brand={clinic.brand}
      aria-labelledby={headingId}
      data-reveal
    >
      <div className="clinic-card__body">
        <div className="clinic-card__title">
          <span className={`status-pill${clinic.primary ? " status-pill--main" : ""}`}>
            {clinic.primary ? "Main clinic" : isLavee ? "Lavee clinic" : `Location ${String(index + 1).padStart(2, "0")}`}
          </span>
          {isLavee && <LaveeLogo variant="lavender" width={150} alt="" />}
          <h2 id={headingId}>{clinic.name}</h2>
          {isLavee && <p className="accent" style={{ color: "var(--lavee-plum)", fontSize: "1.1rem" }}>A Geneva Wellness location</p>}
        </div>

        {clinic.placeholder && (
          <div className="placeholder-box" role="note">
            <strong>Details coming soon.</strong> The address, contact numbers, opening hours and map for this clinic will be
            published here once confirmed. You can already request a consultation for this location.
          </div>
        )}

        <dl>
          <div>
            <dt>Address</dt>
            <dd>
              {clinic.addressLines ? (
                <address>
                  {clinic.addressLines.map((l) => (
                    <span key={l} style={{ display: "block" }}>
                      {l}
                    </span>
                  ))}
                </address>
              ) : (
                TBC
              )}
              {clinic.addressNote && (
                <p className="clinic-card__note" style={{ marginTop: 6 }}>
                  {clinic.addressNote}
                </p>
              )}
            </dd>
          </div>
          <div>
            <dt>Opening hours</dt>
            <dd>
              {clinic.hours ? (
                <dl className="hours">
                  {clinic.hours.map((h) => (
                    <div key={h.days} style={{ display: "contents" }}>
                      <dt style={{ all: "unset", color: "var(--c-muted)" }}>{h.days}</dt>
                      <dd>{h.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                TBC
              )}
            </dd>
          </div>
          <div>
            <dt>Call or text</dt>
            <dd>
              {clinic.phones.length
                ? clinic.phones.map((p) => (
                    <span key={p.tel} style={{ display: "block" }}>
                      <a href={`tel:${p.tel}`}>{p.display}</a>
                      {p.label && <span style={{ color: "var(--c-muted)" }}> · {p.label}</span>}
                    </span>
                  ))
                : TBC}
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{clinic.email ? <a href={`mailto:${clinic.email}`}>{clinic.email}</a> : TBC}</dd>
          </div>
        </dl>

        <div className="btn-row">
          <BookButton clinicId={clinic.id} brand={clinic.brand} source={`clinic-locator-${clinic.id}`}>
            {isLavee ? "Book your session" : "Book a Consultation"}
          </BookButton>
          {clinic.directionsUrl ? (
            <a className="btn btn--ghost" href={clinic.directionsUrl} target="_blank" rel="noopener noreferrer">
              Get Directions <ArrowRight size={16} />
            </a>
          ) : (
            <p className="field-hint" style={{ alignSelf: "center" }}>
              Directions will be added once the address is confirmed.
            </p>
          )}
        </div>
      </div>
      <div className="clinic-card__map">
        <ClinicMap embedUrl={clinic.mapEmbedUrl} query={clinic.mapQuery} name={clinic.name} />
      </div>
    </article>
  );
}
