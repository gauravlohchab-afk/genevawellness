import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import SectionHead from "@/components/sections/SectionHead";
import TreatmentCard from "@/components/sections/TreatmentCard";
import BookButton from "@/components/booking/BookButton";
import { treatmentCategories, treatmentsInCategory } from "@/content/treatments";

export const metadata: Metadata = pageMetadata({
  title: "Premium Laser Treatments",
  description:
    "Explore HIFU, CO2, Pico and Carbon laser, HYDRA 7D, Exilis, Cryotherapy, EMS, laser hair removal and hair & scalp treatments at Geneva Wellness Institute, Alabang.",
  path: "/treatments",
});

export default function TreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Premium Laser Treatments"
        intro="Advanced aesthetic procedures for anti-aging, body contouring & hair restoration"
        crumbs={[{ label: "Treatments" }]}
      >
        <div className="btn-row">
          <BookButton source="treatments-hero">Book Free Consultation</BookButton>
        </div>
      </PageHero>

      <nav className="cat-nav" aria-label="Treatment categories">
        <div className="container">
          <ul>
            {treatmentCategories.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`}>
                  {c.name} ({treatmentsInCategory(c.id).length})
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {treatmentCategories.map((c) => (
        <section key={c.id} id={c.id} className="section cat-section" aria-labelledby={`${c.id}-title`}>
          <div className="container">
            <SectionHead title={<span id={`${c.id}-title`}>{c.name}</span>} lede={c.summary} />
            <div className="card-grid">
              {treatmentsInCategory(c.id).map((t, i) => (
                <TreatmentCard key={t.slug} t={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
