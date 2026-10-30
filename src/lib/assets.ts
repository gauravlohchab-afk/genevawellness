/**
 * Geneva photography is self-hosted in /public/images. Content files still refer to images
 * by their path on the original website (e.g. "/img/services/hifu-img.webp"), so every
 * placement can be checked against the old site; this map resolves each one to the local
 * file. The old site's treatment photos are crops of its gallery photos, so they map to the
 * same gallery files. Anything not supplied yet (the before/after client photos) is still
 * loaded from the original website.
 */
import imageSizes from "@/content/imageSizes.json";

export const LEGACY_ASSET_BASE = (
  process.env.NEXT_PUBLIC_LEGACY_ASSET_BASE ?? "https://www.genevawellness.ph"
).replace(/\/$/, "");

const g = (n: number) => `/images/gallery/gallery-${n}.webp`;

const localByPath: Record<string, string> = {
  "/img/geneva-logo.svg": "/brand/geneva-logo.svg",
  "/img/home-hero-updated-new.webp": "/images/home-hero.webp",
  "/img/facial-treatment-clinic.webp": g(5),
  "/img/wellness-treatment-new.webp": "/images/wellness-treatment.webp",
  "/img/advanced-treatement-1.webp": "/images/advanced-treatment-1.webp",
  "/img/advanced-treatement-2.webp": "/images/advanced-treatment-2.webp",
  "/img/advanced-treatement-3.webp": "/images/advanced-treatment-3.webp",
  "/img/about-video.webp": "/images/clinic-storefront.webp",
  "/img/home-hair-1.webp": "/images/home-hair.webp",
  "/img/home-service-2.webp": "/images/home-service-2.webp",
  "/img/home-service-3.webp": "/images/home-service-3.webp",
  "/img/blog-1-new.webp": "/images/blog/hair-care-tips.webp",
  "/img/blog-2-new.webp": "/images/blog/body-contouring.webp",
  "/img/blog-3-new.webp": "/images/blog/regular-facials.webp",
  // treatments.php (img\services\…)
  "/img/services/carbon-img.webp": g(12),
  "/img/services/co2-img.webp": g(15),
  "/img/services/cryotherapy-img.webp": g(10),
  "/img/services/ems.webp": g(7),
  "/img/services/exilis-body.webp": g(9),
  "/img/services/exilis-img.webp": g(14),
  "/img/services/flaky-scalp.webp": g(6),
  "/img/services/hair-restoratial.webp": g(17),
  "/img/services/hifu-img.webp": g(5),
  "/img/services/laser-hair-remove.webp": g(16),
  "/img/services/pico.webp": g(13),
  "/img/services/scalp-img.webp": g(8),
  // The original HydraFacial photo wasn't supplied; new photography stands in.
  "/img/services/hydrafacial-img.webp": "/images/hydrafacial.webp",
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`/img/gallery-img-${i + 1}.webp`, g(i + 1)])),
};

/** Paths are written as the original site writes them, including encoded backslashes. */
export const legacyAsset = (path: string) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return localByPath[p.replace(/%5C/gi, "/")] ?? `${LEGACY_ASSET_BASE}${p}`;
};

/** New photography (not on the original site), placed by subject. */
export const photo = {
  portraitGlow: { src: "/images/portrait-glow.webp", alt: "Radiant, healthy skin" },
  skincareRitual: { src: "/images/skincare-ritual.webp", alt: "Skin care ritual" },
  facialCleanse: { src: "/images/facial-cleanse.webp", alt: "Esthetician performing a facial" },
  bookingOnline: { src: "/images/booking-online.webp", alt: "Booking a consultation online" },
  ledMask: { src: "/images/led-mask.webp", alt: "LED light therapy facial" },
  hifuDevice: { src: "/images/hifu-device.webp", alt: "HIFU non-surgical facelift" },
  rfFace: { src: "/images/rf-face.webp", alt: "Radiofrequency face treatment" },
  rfBody: { src: "/images/rf-body.webp", alt: "Radiofrequency body contouring" },
  bodyContouring: { src: "/images/body-contouring.webp", alt: "Body contouring treatment" },
  carbonMask: { src: "/images/carbon-mask.webp", alt: "Carbon laser peel mask" },
  bodyScrub: { src: "/images/body-scrub.webp", alt: "Body polish treatment" },
};

/** The homepage hero's two floating frames. */
export const heroGallery = [photo.portraitGlow, photo.ledMask];

type SizeEntry = { width: number; height: number; variants: number[] };

/**
 * Responsive attributes for a self-hosted photo (see scripts/optimize-images.mjs):
 * intrinsic width/height (reserves space, no layout shift) and a srcset of the generated
 * widths. Returns {} for images without a manifest entry, e.g. blog uploads.
 */
export function imageAttrs(
  src: string,
  { thumb = false } = {}
): { width?: number; height?: number; srcSet?: string; src?: string } {
  const entry = (imageSizes as Record<string, SizeEntry>)[src];
  if (!entry) return {};
  const variant = (w: number) => src.replace(/\.webp$/, `-${w}.webp`);
  const widths = entry.variants.filter((w) => (thumb ? w <= 160 : w > 160));
  return {
    width: entry.width,
    height: entry.height,
    srcSet: [...widths.map((w) => `${variant(w)} ${w}w`), ...(thumb ? [] : [`${src} ${entry.width}w`])].join(", ") || undefined,
    ...(thumb && widths.length ? { src: variant(widths[widths.length - 1]) } : {}),
  };
}
