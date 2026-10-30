# Audit and content inventory

Audited 29 October 2026. Sources: https://www.genevawellness.ph/ (home, `treatments.php`, `about-us.php`, `gallery.php`, `testimonials.php`, `contact-us.php`) and `Lavee_Brand_Kit.pdf` (v1, October 2026, 8 pages).

## How the audit was done, and its limits

- Page text was read through a fetch service. The project's sandbox could not download files from genevawellness.ph directly (the network proxy refused the host), so **no original images or the Geneva logo file were copied into this repo**. They are loaded from the live site by URL (see `src/lib/assets.ts`). If a file fails to load, the site shows a labelled "Original image" frame, never a stand-in photo.
- The fetch service paraphrases long passages, so a few long sentences were reassembled from consecutive quoted fragments. Wording should still be spot-checked against the live site before launch.
- Legal pages (privacy, terms, cookies) and the blog post bodies were **not** copied, because they must be copied word for word. Legal links point to the existing pages; blog posts link to their originals until the text is pasted in through `/admin`.

## Brand

| | Geneva Wellness Institute | Lavee by Geneva Wellness |
|---|---|---|
| Source | Brand kit p.2 shows Geneva's swatches beside Lavee's, role for role. Hexes were sampled from those swatches (Lavee samples matched the kit's published hexes exactly). | Brand kit p.3 |
| Logo / price | Logo red `#C21807` | Lavee Lavender `#9874A5` |
| Accent pops | Vivid red `#C51907` | Orchid `#8E5BA6` |
| Sub-heads on light | Dark red `#800000` | Plum `#5E3A6E` |
| Deep backgrounds, CTA | Dark crimson `#560216` | Aubergine `#3B2147` |
| Emphasis on dark | Light orange `#F3D7CD` | Lilac `#E4D6EC` |
| Panels | Tan `#F0E5D9` | Lavender Mist `#F1EAF3` |
| Shared neutral | Cream `#FEFAED` | Cream `#FEFAED` |
| Dividers | Gray orange `#C8AD94` | Heather `#B8A7C0` |
| Fonts | Cinzel, Palatino italic, Arimo (kit p.2: "Stays exactly as Geneva") | Same |

- The kit states fonts are shared by both brands, so Geneva uses the same three typefaces. Palatino falls back to P052 / Book Antiqua / Georgia where not installed.
- **Never mix reds and purples in one composition.** On Geneva pages Lavee appears only as its lavender logo on cream (kit p.8). The sticky header hides while the homepage Lavee section is at the top of the screen. Every component reads colours from semantic tokens set by `data-brand="geneva" | "lavee"`.
- Lavee logo files (cream, lavender, aubergine) were extracted from the brand kit PDF without alteration. Replace them with the master files from `_LaveeKit` when available.
- The kit spells the brand **Lavee**; the brief says "LAVI". The site uses Lavee, matching the logo, until confirmed.

## Content inventory

| Original | New location | Status |
|---|---|---|
| Hero (eyebrow, heading, intro, CTAs) | Home hero | Ported. "LOCAL PREVIEW TEST." removed. "Award-Winning Clinic" and the "100% Safe / Fast Results / Zero Downtime" badges left out pending substantiation. |
| 3 feature slides (Laser, Anti-aging, Body) | Home editorial rows | Ported verbatim |
| About intro + 3 pillars | Home intro | Ported |
| Hair & scalp "Signature Treatments" (3) | Home tabs + detail pages | Ported with benefits and labels |
| "Our Advanced Treatments" (HYDRA 7D, CO2, Carbon) | Home featured cards (+ HIFU) | Ported |
| Before & After (HIFU Face Lift, CO2 Laser Resurfacing) | Home, `/before-after`, treatment pages | Ported with original pairs and captions; comparison slider added |
| Video "Our Story Full Tour" (`bD7H1rx4nOw`) | Home, `/about` | Click-to-load embed |
| Stats (10,000+, 15+, 20+, 5.0 / 500+ reviews) | Home stats band | Ported. **About page lists different numbers** (5000+, 10+, 25+, 98%); homepage set used. Please confirm. |
| 3 written testimonials | Home, `/testimonials` | Ported in full |
| 9 video testimonials | `/testimonials` | Ported (YouTube IDs) |
| 4-step booking process | Home | Ported |
| Blog page (`blog.php`) + 3 posts | `/blog`, `/blog/[slug]`, home cards | Titles, dates, categories, summaries and cover images ported from the blog page and articles (the homepage on the old site showed older dates and different summaries; the blog page values are used). Full article text still to be pasted in via `/admin`; until then each post links to the original. Category filters kept (the old site shows counts for ~40 posts, but only 3 are published). |
| Treatments page: 14 treatments in 3 categories | `/treatments`, `/treatments/[slug]` | All 14 ported (names, taglines, descriptions, benefits, labels). No prices on the original site, so none shown. |
| Treatments only in booking dropdowns | Enquiry form "Also available" | Anti-Aging (Per Area), Excimer RX Laser (Per Area), Arm Slimming, Microneedling. Aliases (7D Hifu, Exilis Pro/Ultra, Cryo Belly, EMSCULPT, Advanced Hairloss Solution, Dandruff Scalp Solution) map to existing treatments. Please confirm whether any are separate services. |
| About page (mission, 4 values, CTA) | `/about` | Ported. No team members are listed on the original; a placeholder note says so. |
| Gallery (17 uncaptioned images) | `/gallery` with lightbox | Shown as a gallery, **not** as before/after pairs, because the original gives no pairing or captions |
| Consultation form + Direct Booking form | Treatment popup | Fields reused (see below) |
| Contact page | `/clinic-locator` (Alabang card) | Ported; conflicts below |
| Footer (tagline, badges, hours, socials, legal) | Footer | Ported. Placeholder phone/address removed. |
| Old `.php` URLs | Permanent redirects in `next.config.mjs` | Done |

## Data conflicts on the current site (need a decision)

1. **Alabang street address:** "5102 Bridgeway Ave., Filinvest Corporate City, Alabang, Muntinlupa City, 1780" vs "5012 Bridgeway Avenue, Alabang, Filinvest City, Muntinlupa, 1781". The site shows the first with a visible note.
2. **Placeholders on the live site:** footer phone "(123) 456-7890", address "123 Wellness Ave, Geneva District", WhatsApp `wa.me/639XXXXXXXXX`, and "+63 917 555 1234" / "(02) 4555 1234" on the contact page. None are used.
3. **Email:** `hello@genevawellness.com` and `support@genevawellness.com` use a `.com` domain while the site is `.ph`. Only `geneva.institute23@gmail.com` is shown. Please confirm the preferred address.
4. **Phone hours** (Mon–Sun 11 AM–7 PM) conflict with clinic hours (Mon–Fri 9–6, Sat 10–4, Sun closed). Clinic hours are shown.
5. **Intimate Whitening** reuses the Cryotherapy photo on the original site. Kept as is until a dedicated image is supplied.
6. **Before & after disclaimer:** the original has none. A neutral "individual results vary" note was added in `src/content/beforeAfter.ts` for the clinic to approve.

## Missing information and assets

- Second Geneva clinic: name, address, phone, email, hours, Google Maps link.
- Lavee clinic: same details, plus any Lavee treatment menu and prices.
- Geneva logo master files (light and dark variants). Currently loaded from the live site.
- Original photography and before/after images, to self-host (`public/legacy`, then set `NEXT_PUBLIC_LEGACY_ASSET_BASE=/legacy`).
- Team member names, photos and credentials, if they should appear.
- Privacy Policy, Terms and Cookie Policy text, and the full text of the 3 blog posts (paste into `/admin`).
- Enquiry destination (CRM, inbox or automation webhook) for `ENQUIRY_WEBHOOK_URL`.

## Enquiry form

Fields kept from the original consultation form: Full Name*, Email Address*, Phone Number*, Preferred Treatment, Message or Questions, privacy consent (from the contact page version). Added: Preferred Clinic* (three locations) and the optional Preferred Schedule from the original "Direct Booking" tab. Not collected: Age and Payment Method (not needed for an enquiry). Treatment became required, with a "Not sure yet" option, because the popup's purpose is choosing a treatment.

No submission endpoint was discoverable on the original forms (no `action` attribute was exposed), so the new form posts to `/api/enquiry`, which forwards to a configurable webhook. With no webhook configured, it says so plainly and offers WhatsApp and Messenger. It never shows a success message unless delivery succeeded.
