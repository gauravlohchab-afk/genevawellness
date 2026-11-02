import { clinics, primaryClinic, type Clinic } from "@/content/clinics";
import { SITE_URL, brand, socials } from "@/content/site";

/** Structured data needs absolute URLs; site-relative paths are prefixed with the site URL. */
export const absoluteUrl = (src: string) => (src.startsWith("/") ? `${SITE_URL}${src}` : src);

const DAYS: Record<string, string[]> = {
  "Monday – Friday": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  Saturday: ["Saturday"],
  Sunday: ["Sunday"],
};

/** "9:00 AM" → "09:00" */
const to24h = (t: string) => {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return undefined;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
};

/** One clinic as a local business, using only the fields the clinic has confirmed. */
function locationJsonLd(c: Clinic) {
  const lavee = c.brand === "lavee";
  const hours = (c.hours ?? [])
    .map((h) => {
      const [opens, closes] = h.time.split("–").map(to24h);
      return DAYS[h.days] && opens && closes
        ? { "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[h.days], opens, closes }
        : null;
    })
    .filter(Boolean);
  return {
    "@type": "HealthAndBeautyBusiness",
    "@id": `${SITE_URL}/clinic-locator#${c.id}`,
    name: c.name,
    url: `${SITE_URL}${lavee ? "/lavee" : "/clinic-locator#" + c.id}`,
    image: absoluteUrl(lavee ? "/brand/lavee-lavender.png" : "/images/lifestyle/group-four.webp"),
    logo: absoluteUrl(lavee ? "/brand/lavee-lavender.png" : brand.logo.src),
    telephone: c.phones[0]?.tel,
    email: c.email ?? undefined,
    address: c.postal
      ? {
          "@type": "PostalAddress",
          streetAddress: c.postal.street,
          addressLocality: c.postal.locality,
          addressRegion: c.postal.region,
          postalCode: c.postal.postalCode,
          addressCountry: "PH",
        }
      : undefined,
    openingHoursSpecification: hours.length ? hours : undefined,
    hasMap: c.directionsUrl ?? undefined,
    parentOrganization: c.primary ? undefined : { "@type": "Organization", name: brand.name, url: SITE_URL },
  };
}

/** Structured data for the main clinic, using verified fields only. */
export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    ...locationJsonLd(primaryClinic),
    name: brand.name,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ground Floor, Entrata Urban Complex, Civic Dr., Filinvest City",
      postalCode: "1781",
      addressLocality: "Alabang, Muntinlupa City",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    sameAs: socials.map((s) => s.href),
  };
}

/** Every clinic location, for the Clinic Locator. */
export function allClinicsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": clinics.map((c) => (c.primary ? { ...clinicJsonLd(), "@context": undefined } : locationJsonLd(c))),
  };
}

/** The Lavee location on its own page. */
export function laveeJsonLd() {
  const c = clinics.find((x) => x.brand === "lavee");
  return c ? { "@context": "https://schema.org", ...locationJsonLd(c) } : null;
}

/** Site-level entity, so search engines connect the pages to one brand. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: SITE_URL,
    inLanguage: "en-PH",
  };
}

/** A treatment as a service offered by the clinic. */
export function treatmentJsonLd(t: { name: string; title: string; slug: string; description: string[]; image: { src: string } }, category: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.title,
    alternateName: t.name,
    serviceType: category,
    description: t.description.join(" "),
    url: `${SITE_URL}/treatments/${t.slug}`,
    image: absoluteUrl(t.image.src),
    areaServed: { "@type": "City", name: "Muntinlupa City" },
    provider: { "@type": "HealthAndBeautyBusiness", name: brand.name, url: SITE_URL },
  };
}
