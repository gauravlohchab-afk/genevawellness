import { clinics, primaryClinic, type Clinic } from "@/content/clinics";
import { SITE_URL, brand, contact, seo, socials } from "@/content/site";
import { getCategory, treatmentCategories, treatmentsInCategory, type Treatment } from "@/content/treatments";

/** Structured data needs absolute URLs; site-relative paths are prefixed with the site URL. */
export const absoluteUrl = (src: string) => (src.startsWith("/") ? `${SITE_URL}${src}` : src);

/**
 * Stable entity ids. Every page refers back to the same organisation, website and clinic
 * nodes, so search engines and AI answer engines merge them into one brand entity.
 */
export const ids = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  clinic: (id: string) => `${SITE_URL}/clinic-locator#${id}`,
  service: (slug: string) => `${SITE_URL}/treatments/${slug}#service`,
};

const metroManila = { "@type": "AdministrativeArea", name: "Metro Manila" };

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

/** The main clinic's address, split into parts (its display lines are not machine-readable). */
const ALABANG_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Ground Floor, Entrata Urban Complex, Civic Dr., Filinvest City",
  postalCode: "1781",
  addressLocality: "Alabang, Muntinlupa City",
  addressRegion: "Metro Manila",
  addressCountry: "PH",
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
  const address = c.primary
    ? ALABANG_ADDRESS
    : c.postal
      ? {
          "@type": "PostalAddress",
          streetAddress: c.postal.street,
          addressLocality: c.postal.locality,
          addressRegion: c.postal.region,
          postalCode: c.postal.postalCode,
          addressCountry: "PH",
        }
      : undefined;
  return {
    "@type": "HealthAndBeautyBusiness",
    "@id": ids.clinic(c.id),
    name: c.name,
    url: `${SITE_URL}${lavee ? "/lavee" : "/clinic-locator#" + c.id}`,
    image: absoluteUrl(lavee ? "/brand/lavee-lavender.png" : "/images/lifestyle/group-four.webp"),
    logo: absoluteUrl(lavee ? "/brand/lavee-lavender.png" : brand.logo.src),
    telephone: c.phones[0]?.tel,
    email: c.email ?? undefined,
    address,
    openingHoursSpecification: hours.length ? hours : undefined,
    hasMap: c.directionsUrl ?? undefined,
    areaServed: metroManila,
    currenciesAccepted: "PHP",
    parentOrganization: { "@id": ids.organization },
  };
}

/** The organisation behind every clinic, with its full treatment catalogue. Rendered on every page. */
export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ids.organization,
    name: brand.name,
    alternateName: brand.shortName,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl(brand.logo.src) },
    image: absoluteUrl("/images/lifestyle/group-four.webp"),
    description: seo.description,
    slogan: brand.tagline,
    email: primaryClinic.email ?? contact.email,
    telephone: contact.phone.tel,
    address: ALABANG_ADDRESS,
    areaServed: metroManila,
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer service", telephone: contact.phone.tel, areaServed: "PH" },
      { "@type": "ContactPoint", contactType: "reservations", url: contact.whatsapp.href, areaServed: "PH" },
    ],
    sameAs: socials.map((s) => s.href),
    subOrganization: clinics.map((c) => ({ "@id": ids.clinic(c.id) })),
    knowsAbout: [
      ...treatmentCategories.map((c) => c.name),
      ...treatmentCategories.flatMap((c) => treatmentsInCategory(c.id).map((t) => t.alsoKnownAs ?? t.name)),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Aesthetic and wellness treatments",
      itemListElement: treatmentCategories.map((cat) => ({
        "@type": "OfferCatalog",
        name: cat.name,
        itemListElement: treatmentsInCategory(cat.id).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@id": ids.service(t.slug), "@type": "Service", name: t.name },
        })),
      })),
    },
  };
}

/** Site-level entity, so search engines connect the pages to one brand. */
export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: brand.name,
    alternateName: brand.shortName,
    url: SITE_URL,
    inLanguage: "en-PH",
    publisher: { "@id": ids.organization },
  };
}

/** Organisation + website, emitted once from the root layout. */
export function siteGraphJsonLd() {
  return { "@context": "https://schema.org", "@graph": [organizationJsonLd(), websiteJsonLd()] };
}

/** The main clinic, for the homepage. */
export function clinicJsonLd() {
  return { "@context": "https://schema.org", ...locationJsonLd(primaryClinic) };
}

/** Every clinic location, for the Clinic Locator. */
export function allClinicsJsonLd() {
  return { "@context": "https://schema.org", "@graph": clinics.map(locationJsonLd) };
}

/** The Lavee location on its own page. */
export function laveeJsonLd() {
  const c = clinics.find((x) => x.brand === "lavee");
  return c ? { "@context": "https://schema.org", ...locationJsonLd(c) } : null;
}

/** A treatment as a service offered by the clinic. */
export function treatmentJsonLd(t: Treatment) {
  const category = getCategory(t.category);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": ids.service(t.slug),
    name: t.title,
    alternateName: [t.name, t.alsoKnownAs].filter(Boolean),
    serviceType: category.name,
    category: category.name,
    description: t.description.join(" "),
    url: `${SITE_URL}/treatments/${t.slug}`,
    image: absoluteUrl(t.image.src),
    areaServed: metroManila,
    provider: { "@id": ids.organization },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceLocation: { "@id": ids.clinic(primaryClinic.id) },
      servicePhone: { "@type": "ContactPoint", telephone: contact.phone.tel },
    },
  };
}

/** The treatment menu as an ordered list, for /treatments. */
export function treatmentListJsonLd() {
  const all = treatmentCategories.flatMap((c) => treatmentsInCategory(c.id));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Treatments at ${brand.name}`,
    numberOfItems: all.length,
    itemListElement: all.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/treatments/${t.slug}`,
      name: t.name,
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Question-and-answer pairs that are visible on the page. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
