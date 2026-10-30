# Geneva Wellness Institute website (with Lavee)

Next.js 15 (App Router, React 19, TypeScript). No UI framework and no animation library: styling is one design-system stylesheet with brand tokens, and motion is CSS plus a small IntersectionObserver.

See **AUDIT.md** for the content inventory, brand decisions, data conflicts and the list of missing details.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all pages prerendered except /api/enquiry)
npm start            # serve the production build
```

Node 18.18+ (tested on Node 22). It needs a Node host (Vercel, Netlify, a VPS, etc.) because of the `/api/enquiry` route. Copy `.env.example` to `.env.local` to configure.

## Images

Photos live in `public/images`. After adding or replacing one, run:

```bash
npm run images
```

This writes 160px and 800px versions beside each photo and updates `src/content/imageSizes.json`, so pages get correct width/height (no layout shift) and download a right-sized file. Images without an entry still work; they just load the original.

## Production build alongside the dev server

`npm run build` writes to `.next`, which the dev server also uses; running both at once corrupts the dev server. To test a production build while developing:

```bash
NEXT_DIST_DIR=.next-prod npm run build
NEXT_DIST_DIR=.next-prod npx next start -p 3010
```

## Routes

| Route | What it is |
|---|---|
| `/` | Homepage: hero, intro, categories, feature stories, featured treatments, before & after, stats, hair & scalp tabs, video, Lavee, testimonials, booking steps, clinic preview, blog, CTA |
| `/treatments` | All 14 treatments by category, with a sticky category bar |
| `/treatments/[slug]` | Treatment detail (14 static pages), with related before & after and a pre-filled booking CTA |
| `/before-after` | Before & after comparison sliders |
| `/gallery` | The 17-image clinic gallery with lightbox |
| `/blog`, `/blog/[slug]` | Blog with category filters and article pages, edited from `/admin` |
| `/admin` | Password-protected blog admin (not indexed) |
| `/about` | Mission, values, story video |
| `/testimonials` | 9 video testimonials and written quotes |
| `/clinic-locator` | Three clinics, Alabang first, each with hours, contacts, map, directions and booking |
| `/lavee` | Lavee by Geneva Wellness, fully in the Lavee palette |
| `/sitemap.xml`, `/robots.txt` | Generated |
| `/api/enquiry` | Booking endpoint (POST), forwards to the leads API |

Old URLs (`/about-us.php`, `/treatments.php`, `/gallery.php`, `/testimonials.php`, `/contact-us.php`, `/index.php`, `/blog.php`, `/blog/*.php`, `/blog-category/*.php`) redirect permanently.

## Where to edit things

| To change | Edit |
|---|---|
| Clinic names, addresses, phones, hours, map links | `src/content/clinics.ts` (one place, used everywhere) |
| Treatments, descriptions, images | `src/content/treatments.ts` |
| Before & after pairs, captions, disclaimer | `src/content/beforeAfter.ts` |
| Homepage/about copy, stats, testimonials, socials, legal links | `src/content/site.ts` |
| Lavee copy and logo files | `src/content/lavee.ts`, `public/brand/` |
| Colours, type, spacing, motion | tokens at the top of `src/app/globals.css` |
| Where original images load from | `NEXT_PUBLIC_LEGACY_ASSET_BASE` (see `src/lib/assets.ts`) |

To fill in a placeholder clinic, set its fields in `clinics.ts` and remove `placeholder: true`. Directions and the map appear automatically once `directionsUrl` and `mapQuery` are set.

## Booking popup

The booking popup opens from any "Book" button, optionally with a treatment and/or clinic pre-selected (`BookButton` also accepts `mode="booking"` to open on the Direct Booking tab). It has two tabs:

| Tab | Fields (* required) | Sent as |
|---|---|---|
| Consultation | Full name*, Email*, Phone*, Interest or treatment*, Message* | `type=call` |
| Direct Booking | Full name*, Age, Treatment*, Contact #*, Email*, Preferred schedule*, Payment method | `type=booking` |

Both tabs also ask for Privacy Policy consent. The form validates in the browser and again on the server (`src/lib/enquiry.ts` is shared), blocks double submits, keeps what the visitor typed if they close it or sending fails, and has loading, error and success states.

Delivery: `/api/enquiry` forwards each request to the leads API:

```
POST {LEADS_API_URL}/api/leads?type=call|booking&center={LEADS_CENTER}
```

`LEADS_CENTER` must be set (see `.env.example`); until it is, the form says online sending is unavailable and offers WhatsApp/Messenger. `LEADS_API_URL` defaults to the Railway deployment. The JSON body:

```json
{
  "fullname": "Maria Santos",
  "email": "maria@example.com",
  "phone": "0915 396 0593",
  "treatment": "HIFU",
  "message": "Preferred schedule: Thu, 5 Nov 2026, 2:30 pm",
  "schedule": "2026-11-05T14:30:00+08:00",
  "age": 34,
  "payment_method": "GCash",
  "clinic": "Geneva Wellness Institute, Alabang",
  "source": "home-hero"
}
```

`schedule`, `age` and `payment_method` are sent for bookings only. The API confirms it requires `fullname`, `email`, `phone` and `treatment` (plus `schedule` for bookings); the names of the optional fields (`message`, `age`, `payment_method`, `clinic`, `source`) are not confirmed by the API, so check them against its database and adjust `src/app/api/enquiry/route.ts` if needed.

## Blog admin

Go to `/admin`, sign in with the admin password, and you can create, edit, publish/unpublish (draft) and delete posts, upload a cover image, and write the article with simple formatting (headings, bold, lists, quotes, links, images) with a live preview. Changes appear on `/blog`, the article page and the homepage immediately.

Setup (server environment):

```bash
ADMIN_PASSWORD=choose-a-long-password
ADMIN_SESSION_SECRET=$(openssl rand -hex 32)
BLOG_DATA_DIR=/var/lib/geneva-blog   # optional, defaults to ./data
```

Without `ADMIN_PASSWORD` the admin is switched off.

**Why this setup:** posts are stored as one JSON file (`posts.json`) plus an `uploads/` folder on the server's disk. There's no database or third-party service to sign up for, pay for or maintain, and backing up the blog means copying one folder. Login is a single admin password with a signed, httpOnly session cookie (8 hours), checked on every admin page and action, with a limit of 5 failed attempts per 15 minutes. Everything typed in the editor is escaped before display, so pasted HTML or scripts can't run on the site.

**Hosting requirement:** the data folder must be on a persistent disk, which any VPS, Docker host with a volume, Render or Railway (with a disk) provides. Serverless hosts like Vercel or Netlify don't keep files between requests. To host there, swap the four functions in `src/lib/blog/store.ts` for a hosted store (e.g. Vercel Blob, Supabase). Nothing else needs to change.

The three original posts are seeded with their real titles, dates, categories, summaries and images. The full article text couldn't be copied word for word, so each one currently links to the original article. Open each post in the admin and paste the full text in.

## Brand rules enforced in code

- Every component reads semantic colour tokens; `data-brand="geneva"` or `data-brand="lavee"` on a wrapper switches the whole palette, so a Lavee block can't pick up Geneva red.
- Lavee pages use their own header and footer. On Geneva pages, the homepage Lavee section is lavender logo on cream, and the red header steps aside while it is on screen.
- Logos are used as supplied (no recolouring, filters or redraws). If the Geneva logo can't load, the plain name is shown instead.

## Accessibility and motion

Skip link, landmarks, one `h1` per page, labelled forms with inline errors tied by `aria-describedby`, focus-trapped dialogs that restore focus, keyboard-operable mega menu, tabs and comparison slider (arrows, Page Up/Down, Home/End). Reveal-on-scroll only hides content when JavaScript is running, and `prefers-reduced-motion` turns all motion off.
