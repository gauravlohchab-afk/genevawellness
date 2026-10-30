import Link from "next/link";
import { clinics, primaryClinic } from "@/content/clinics";
import { lavee } from "@/content/lavee";
import { brand as geneva, contact, legalLinks, socials } from "@/content/site";
import { treatments } from "@/content/treatments";
import { SocialIcon } from "../Icons";
import { GenevaLogo, LaveeLockup } from "../Logos";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "All Treatments", href: "/treatments" },
  { label: "Before & After", href: "/before-after" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Lavee", href: "/lavee" },
  { label: "Clinic Locator", href: "/clinic-locator" },
];

export default function Footer({ brand }: { brand: "geneva" | "lavee" }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            {brand === "lavee" ? (
              <>
                <LaveeLockup width={180} />
                <p>
                  {lavee.fullName} · {lavee.secondaryLine}
                </p>
              </>
            ) : (
              <>
                <Link href="/" aria-label="Geneva Wellness Institute — Home" style={{ minHeight: 0 }}>
                  <GenevaLogo className="logo-geneva" />
                </Link>
                <p>
                  {geneva.tagline} {geneva.taglineSecond}
                </p>
                <ul className="chips site-footer__badges" aria-label="Credentials">
                  {geneva.trustBadges.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </>
            )}
            <ul className="socials" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Geneva Wellness Institute on ${s.name}`}>
                    <SocialIcon name={s.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h2>Quick Links</h2>
            <ul>
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Treatments">
            <h2>Treatments</h2>
            <ul>
              {treatments.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={`/treatments/${t.slug}`}>{t.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2>Visit &amp; Contact</h2>
            {brand === "lavee" ? (
              <p style={{ fontSize: "0.95rem", color: "var(--c-muted)" }}>
                Lavee clinic address and hours coming soon. See the{" "}
                <Link href="/clinic-locator#lavee" style={{ display: "inline", minHeight: 0, textDecoration: "underline" }}>
                  Clinic Locator
                </Link>
                .
              </p>
            ) : (
              <>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                  Alabang · Main clinic
                </p>
                <dl className="hours-list" aria-label={`${primaryClinic.shortName} hours`}>
                  {primaryClinic.hours?.map((h) => (
                    <div key={h.days} style={{ display: "contents" }}>
                      <dt>{h.days}</dt>
                      <dd>{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            <ul style={{ marginTop: 16 }}>
              <li>
                <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  WhatsApp {contact.whatsapp.display}
                </a>
              </li>
              <li>
                <a href={contact.messenger.href} target="_blank" rel="noopener noreferrer">
                  Message us on Messenger
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <Link href="/clinic-locator">
                  {clinics.length} clinic locations →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {year} Geneva Wellness Institute. All rights reserved.</p>
          <ul aria-label="Legal">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="/sitemap.xml">Sitemap</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
