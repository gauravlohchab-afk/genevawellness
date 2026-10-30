import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import BookButton from "@/components/booking/BookButton";
import { ArrowRight } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { amenitiesAlsoOnSite, amenitiesIntro, amenityCount, amenityGroups } from "@/content/amenities";

export const metadata: Metadata = pageMetadata({
  title: "Clinic Amenities",
  description:
    "Every space inside Geneva Wellness Institute in Alabang: reception, consultation and treatment rooms, the head spa, VIP suite, steam cocoons and private sauna.",
  path: "/amenities",
});

const pad = (n: number) => String(n).padStart(2, "0");

export default function AmenitiesPage() {
  let n = 0;
  return (
    <>
      <PageHero
        eyebrow={amenitiesIntro.eyebrow}
        title={amenitiesIntro.title}
        intro={amenitiesIntro.lede}
        crumbs={[{ label: "Amenities" }]}
      >
        <p className="amenities-meta">
          <span>{amenityCount} spaces</span>
          <span aria-hidden="true">·</span>
          <Link href="/clinic-locator#alabang" className="link-arrow">
            {amenitiesIntro.location} <ArrowRight />
          </Link>
        </p>
      </PageHero>

      {amenityGroups.map((group, gi) => (
        <section
          key={group.id}
          className={`section section--tight${gi % 2 ? " section--panel" : ""}`}
          aria-labelledby={`amenities-${group.id}`}
        >
          <div className="container">
            <div className="amenity-group__head" data-reveal>
              <h2 id={`amenities-${group.id}`} className="h2">
                {group.title}
                {group.note && <span className="accent accent--pop"> · {group.note}</span>}
              </h2>
            </div>
            <ul className="amenity-grid">
              {group.items.map((item, i) => {
                n += 1;
                return (
                  <li key={item.name} className="amenity" data-reveal style={{ ["--stagger" as string]: i }}>
                    <span className="amenity__num" aria-hidden="true">
                      {pad(n)}
                    </span>
                    <h3>{item.name}</h3>
                    <p>{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      <section className="section section--tight" aria-label="Also on site">
        <div className="container cta-inline">
          <p className="amenities-also">
            <strong>Also on site:</strong> {amenitiesAlsoOnSite}
          </p>
          <BookButton source="amenities">Book a Consultation</BookButton>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
