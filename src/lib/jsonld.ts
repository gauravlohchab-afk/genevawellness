import { primaryClinic } from "@/content/clinics";
import { SITE_URL, brand, socials } from "@/content/site";

/** Structured data for the main clinic, using verified fields only. */
export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: brand.name,
    url: SITE_URL,
    logo: brand.logo.src,
    telephone: primaryClinic.phones[0]?.tel,
    email: primaryClinic.email ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ground Floor, Entrata Urban Complex, Civic Dr., Filinvest City",
      postalCode: "1781",
      addressLocality: "Alabang, Muntinlupa City",
      addressRegion: "Metro Manila",
      addressCountry: "PH",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "16:00" },
    ],
    hasMap: primaryClinic.directionsUrl ?? undefined,
    sameAs: socials.map((s) => s.href),
  };
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
    image: t.image.src,
    areaServed: { "@type": "City", name: "Muntinlupa City" },
    provider: { "@type": "HealthAndBeautyBusiness", name: brand.name, url: SITE_URL },
  };
}
