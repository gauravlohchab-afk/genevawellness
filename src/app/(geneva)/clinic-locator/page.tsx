import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ClinicCard from "@/components/sections/ClinicCard";
import { clinics } from "@/content/clinics";
import { contact } from "@/content/site";
import { clinicJsonLd } from "@/lib/jsonld";
import { SocialIcon } from "@/components/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Find Your Clinic",
  description:
    "Find Geneva Wellness Institute clinics, including our main clinic in Alabang and Lavee by Geneva Wellness. Hours, directions and consultation booking.",
  path: "/clinic-locator",
});

export default function ClinicLocatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd()) }} />
      <PageHero
        eyebrow="Clinic Locator"
        title="Find Your Clinic"
        intro="Visit our main clinic in Alabang, or choose the Geneva Wellness location that suits you best. Every clinic offers the same expert, personalized care."
        crumbs={[{ label: "Clinic Locator" }]}
      >
        <nav aria-label="Jump to a clinic">
          <ul className="chips">
            {clinics.map((c) => (
              <li key={c.id} style={{ padding: 0 }}>
                <a href={`#${c.id}`} style={{ display: "inline-flex", minHeight: 40, alignItems: "center", padding: "0 14px", textDecoration: "none" }}>
                  {c.shortName}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section className="section" aria-label="Clinic locations">
        <div className="container clinic-list">
          {clinics.map((c, i) => (
            <ClinicCard key={c.id} clinic={c} index={i} />
          ))}
        </div>
      </section>

      <section className="section section--panel section--tight" aria-labelledby="chat-title">
        <div className="container container--narrow" style={{ textAlign: "center", display: "grid", gap: 18, justifyItems: "center" }}>
          <h2 id="chat-title" className="h2">
            Prefer to chat first?
          </h2>
          <p className="lede">Send us a message and let us know the treatment you&apos;re interested in and any preferred dates and times.</p>
          <div className="btn-row btn-row--center">
            <a className="btn" href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
              <SocialIcon name="WhatsApp" size={16} /> WhatsApp {contact.whatsapp.display}
            </a>
            <a className="btn btn--ghost" href={contact.messenger.href} target="_blank" rel="noopener noreferrer">
              <SocialIcon name="Messenger" size={16} /> Messenger
            </a>
          </div>
          <Link href="/treatments" className="link-arrow">
            Browse treatments first
          </Link>
        </div>
      </section>
    </>
  );
}
