/**
 * Frequently asked questions, shown on the page and mirrored as FAQPage structured data.
 *
 * Every answer is assembled from facts already published elsewhere on this site (clinic
 * details, treatment copy, booking steps). Nothing here adds a medical claim, price,
 * session count or downtime figure that the clinic has not published. Edit the source
 * content (clinics.ts, treatments.ts, site.ts) and these answers follow.
 */
import { clinics, primaryClinic } from "@/content/clinics";
import { lavee } from "@/content/lavee";
import { brand, contact } from "@/content/site";
import { getCategory, treatmentCategories, treatmentsInCategory, type Treatment } from "@/content/treatments";
import type { FaqItem } from "@/lib/jsonld";

const alabangAddress = primaryClinic.addressLines!.join(", ");
const otherClinics = clinics.filter((c) => !c.primary);
const hoursText = (primaryClinic.hours ?? []).map((h) => `${h.days}: ${h.time}`).join("; ");
const bookingText = `Call ${contact.phone.display}, message us on WhatsApp at ${contact.whatsapp.display} or Facebook Messenger, or use the Book Free Consultation button on any page of this website.`;

/** General questions about the clinic, shown on the homepage. */
export const clinicFaqs: FaqItem[] = [
  {
    q: `Where is ${brand.name} located?`,
    a: `The main clinic is at ${alabangAddress}. ${primaryClinic.addressNote ?? ""} ${brand.name} also has ${otherClinics
      .map((c) => `${c.name} (${c.addressLines?.join(", ")})`)
      .join(" and ")}.`.replace(/\s+/g, " "),
  },
  {
    q: `What are the opening hours of ${brand.name} in Alabang?`,
    a: `The Alabang clinic is open ${hoursText}. For the Makati and Lavee clinics, please contact us to confirm hours before your visit.`,
  },
  {
    q: "Is the first consultation free?",
    a: `Yes. ${brand.name} offers a free consultation. Our team reviews your skin, body or hair goals and recommends a personalized treatment plan.`,
  },
  {
    q: "How do I book an appointment?",
    a: `${bookingText} Tell us the treatment you are interested in and your preferred date and time, and our team will confirm your appointment.`,
  },
  {
    q: `What treatments does ${brand.name} offer?`,
    a: treatmentCategories
      .map((c) => `${c.name}: ${treatmentsInCategory(c.id).map((t) => t.alsoKnownAs ?? t.name).join(", ")}.`)
      .join(" "),
  },
  {
    q: "Are the treatments surgical?",
    a: `No. ${brand.name} provides non-surgical aesthetic and wellness treatments using technologies such as HIFU, CO2, Pico and carbon lasers, radiofrequency and cryotherapy. Your practitioner explains what to expect from your chosen treatment, including any recovery time, during your consultation.`,
  },
  {
    q: `What is ${lavee.fullName}?`,
    a: `${lavee.fullName} is a ${brand.name} location at ${otherClinics.find((c) => c.brand === "lavee")?.addressLines?.join(", ")}. ${lavee.intro}`,
  },
];

/** Questions answered on each treatment page, built from that treatment's published copy. */
export function treatmentFaqs(t: Treatment): FaqItem[] {
  const category = getCategory(t.category);
  const known = t.alsoKnownAs ? ` (also known as ${t.alsoKnownAs})` : "";
  const benefits = [...new Set([...t.benefits, ...(t.homepageDetail?.benefits ?? [])])];
  return [
    {
      q: `What is ${t.name}?`,
      a: `${t.name}${known} is part of the ${category.name} menu at ${brand.name} in Alabang, Muntinlupa City. ${t.description.join(" ")}`,
    },
    {
      q: `What are the benefits of ${t.name}?`,
      a: `${benefits.join(", ")}. Every treatment is personalized to your skin type, concerns and goals.`,
    },
    {
      q: `Where can I get ${t.name} in Metro Manila?`,
      a: `${brand.name} offers ${t.name} at its main clinic, ${alabangAddress}. You can also ask about availability at our Makati clinic when you book.`,
    },
    {
      q: `How do I book a ${t.name} consultation?`,
      a: `Start with a free consultation so our team can confirm ${t.name} suits you. ${bookingText}`,
    },
  ];
}
