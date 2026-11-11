import "server-only";
import { clinics } from "@/content/clinics";
import { clinicFaqs, treatmentFaqs } from "@/content/faq";
import { lavee } from "@/content/lavee";
import { SITE_URL, aboutPage, bookingSteps, brand, contact, contentUpdated, seo, socials, testimonials } from "@/content/site";
import { treatmentCategories, treatmentsInCategory } from "@/content/treatments";
import { listPosts } from "@/lib/blog/store";
import { isPlaceholderPost } from "@/lib/blog/types";

const url = (path: string) => `${SITE_URL}${path}`;

/**
 * llms.txt (https://llmstxt.org): a plain Markdown summary of the site for AI assistants
 * and answer engines. Built from the same content files as the pages, so it never drifts.
 * `full` adds every treatment's description, benefits and FAQs, plus testimonials.
 */
export async function buildLlmsTxt(full: boolean) {
  const posts = (await listPosts()).filter((p) => !isPlaceholderPost(p));
  const out: string[] = [];
  const line = (s = "") => out.push(s);

  line(`# ${brand.name}`);
  line();
  line(`> ${seo.description} ${brand.tagline}`);
  line();
  line(
    `${brand.name} (also called ${brand.shortName}) is an aesthetic and wellness clinic in Metro Manila, Philippines, with its main clinic in Filinvest City, Alabang, Muntinlupa City. It offers non-surgical face and skin, body contouring, and hair and scalp treatments, and a free first consultation. ${lavee.fullName} is its sister location in Pasig City.`,
  );
  line();
  line(`Last updated: ${contentUpdated}. Treatment prices are not published; ask the clinic for a quote.`);

  line();
  line("## Clinics");
  line();
  for (const c of clinics) {
    line(`### ${c.name}`);
    if (c.addressLines) line(`- Address: ${c.addressLines.join(", ")}`);
    if (c.addressNote) line(`- Landmark: ${c.addressNote}`);
    if (c.phones[0]) line(`- Phone: ${c.phones[0].display}`);
    if (c.email) line(`- Email: ${c.email}`);
    line(`- Hours: ${c.hours ? c.hours.map((h) => `${h.days} ${h.time}`).join("; ") : "Please contact the clinic to confirm"}`);
    if (c.directionsUrl) line(`- Directions: ${c.directionsUrl}`);
    line(`- Page: ${url(c.brand === "lavee" ? "/lavee" : `/clinic-locator#${c.id}`)}`);
    line();
  }

  line("## Booking");
  line();
  line(`- Phone: ${contact.phone.display}`);
  line(`- WhatsApp: ${contact.whatsapp.display} (${contact.whatsapp.href.split("?")[0]})`);
  line(`- Messenger: ${contact.messenger.href.split("?")[0]}`);
  line(`- Online: "Book Free Consultation" on any page of ${SITE_URL}`);
  bookingSteps.forEach((s, i) => line(`${i + 1}. ${s.title}: ${s.body}`));

  for (const cat of treatmentCategories) {
    line();
    line(`## ${cat.name}`);
    line();
    if (full) {
      line(cat.summary);
      line();
    }
    for (const t of treatmentsInCategory(cat.id)) {
      const known = t.alsoKnownAs ? ` (${t.alsoKnownAs})` : "";
      if (!full) {
        line(`- [${t.name}${known}](${url(`/treatments/${t.slug}`)}): ${t.tagline}. ${t.description[0]}`);
        continue;
      }
      line(`### ${t.title}${known}`);
      line();
      line(`URL: ${url(`/treatments/${t.slug}`)}`);
      line();
      line(t.description.join(" "));
      line();
      line(`Benefits: ${t.benefits.join(", ")}.`);
      line();
      for (const f of treatmentFaqs(t)) {
        line(`**${f.q}** ${f.a}`);
        line();
      }
    }
  }

  line();
  line("## Frequently asked questions");
  line();
  for (const f of clinicFaqs) {
    line(`**${f.q}**`);
    line(f.a);
    line();
  }

  if (full) {
    line("## About");
    line();
    aboutPage.paragraphs.forEach((p) => {
      line(p);
      line();
    });
    aboutPage.values.forEach((v) => line(`- ${v.title}: ${v.body}`));
    line();
    line("## Client testimonials");
    line();
    testimonials.forEach((t) => {
      line(`> "${t.quote}" — ${t.name}, ${t.role}`);
      line();
    });
  }

  line("## Pages");
  line();
  [
    ["Treatments", "/treatments", "Full treatment menu"],
    ["Clinic Locator", "/clinic-locator", "Addresses, hours, maps and directions for every clinic"],
    ["Before & After", "/before-after", "Client results for HIFU and CO2 laser"],
    ["About", "/about", "Mission and values"],
    ["Amenities", "/amenities", "Reception, treatment rooms, head spa, VIP suite, steam and sauna"],
    ["Testimonials", "/testimonials", "Written and video client testimonials"],
    [lavee.fullName, "/lavee", lavee.intro],
    ["Gallery", "/gallery", "Clinic and treatment photos"],
    ["Blog", "/blog", "Skincare, treatment and hair health articles"],
  ].forEach(([name, path, desc]) => line(`- [${name}](${url(path)}): ${desc}`));
  if (!full) line(`- [Full details for AI assistants](${url("/llms-full.txt")}): every treatment's description, benefits and FAQs`);

  if (posts.length) {
    line();
    line("## Articles");
    line();
    posts.forEach((p) => line(`- [${p.title}](${url(`/blog/${p.slug}`)}): ${p.excerpt}`));
  }

  line();
  line("## Official profiles");
  line();
  socials.forEach((s) => line(`- ${s.name}: ${s.href}`));
  line();
  return out.join("\n");
}

export const llmsHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "X-Robots-Tag": "noindex",
};
