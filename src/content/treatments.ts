/**
 * Treatment catalogue.
 *
 * Source of truth: https://www.genevawellness.ph/treatments.php (audited 29 Oct 2026).
 * Names, taglines, descriptions, benefits and labels are kept as published on the
 * original site. No prices, durations or session counts are listed there, so none
 * are shown here.
 */
import { legacyAsset, photo } from "@/lib/assets";

export type TreatmentCategoryId = "face-skin" | "body-contouring" | "hair-scalp";

export interface TreatmentCategory {
  id: TreatmentCategoryId;
  name: string;
  /** Short line taken from the original homepage feature slides / section intros. */
  summary: string;
  image: { src: string; alt: string };
}

export interface Treatment {
  slug: string;
  category: TreatmentCategoryId;
  /** Short name used in menus, forms and cards. */
  name: string;
  /** Heading as published on the original treatments page. */
  title: string;
  tagline: string;
  /** Paragraphs, as published. */
  description: string[];
  benefits: string[];
  label?: string;
  /** Name used elsewhere on the original site, kept for search and the enquiry form. */
  alsoKnownAs?: string;
  image: { src: string; alt: string };
  /** Anchor ids used by the old treatments.php page, used for redirects. */
  legacyAnchors: string[];
  /** Extra detail published on the original homepage "Signature Treatments" block. */
  homepageDetail?: { heading: string; intro: string; benefits: string[] };
}

export const treatmentCategories: TreatmentCategory[] = [
  {
    id: "face-skin",
    name: "Face & Skin Treatments",
    summary:
      "State-of-the-art CO2, Carbon & Pico laser therapies designed to restore clarity, reduce pigmentation, and rejuvenate your skin from within.",
    image: photo.rfFace,
  },
  {
    id: "body-contouring",
    name: "Body & Contouring",
    summary:
      "Targeted body contouring & slimming treatments using Exilis and RF technology to sculpt the figure you've always desired — no surgery required.",
    image: photo.bodyContouring,
  },
  {
    id: "hair-scalp",
    name: "Hair & Scalp Care",
    summary: "Specialized scalp treatments to restore hair vitality and promote healthy, thick growth.",
    image: {
      src: legacyAsset("/img/home-service-3.webp"),
      alt: "Scalp care at Geneva Wellness",
    },
  },
];

export const treatments: Treatment[] = [
  // ── Face & Skin ────────────────────────────────────────────────
  {
    slug: "hydra-7d",
    category: "face-skin",
    name: "HYDRA 7D",
    alsoKnownAs: "HydraFacial",
    title: "HydraFacial — The Ultimate Skin Rejuvenation",
    tagline: "Renew Your Complexion",
    label: "Most Popular",
    description: [
      "A non-invasive treatment that deeply cleanses, exfoliates, and hydrates the skin.",
      "Addresses fine lines, acne, and dullness — instant, visible results with zero downtime.",
    ],
    benefits: ["Deep Cleansing", "Exfoliation", "Hydration", "Antioxidant Protection"],
    image: { src: legacyAsset("/img%5Cservices%5Chydrafacial-img.webp"), alt: "HydraFacial" },
    legacyAnchors: ["hydrafacial", "hydra-7d"],
  },
  {
    slug: "hifu",
    category: "face-skin",
    name: "HIFU",
    title: "HIFU — Non-Surgical Facelift",
    tagline: "Lift and Tighten Without Surgery",
    description: [
      "Focused ultrasound energy stimulates collagen production, reducing wrinkles and sagging with no downtime.",
      "Results continue to improve as collagen builds.",
    ],
    benefits: ["Non-Surgical Facelift", "Collagen Boost", "Natural Results"],
    image: { src: legacyAsset("/img%5Cservices%5Chifu-img.webp"), alt: "HIFU Non-Surgical Facelift" },
    legacyAnchors: ["hifu"],
  },
  {
    slug: "co2-laser",
    category: "face-skin",
    name: "CO₂ Laser",
    title: "CO₂ Laser Therapy",
    tagline: "Resurface and Rejuvenate",
    description: [
      "Resurfaces the skin to address fine lines, wrinkles, scars, and sun damage — revealing smoother, younger-looking skin and stimulating collagen production.",
    ],
    benefits: ["Skin Resurfacing", "Wrinkle Reduction", "Scar Treatment"],
    image: { src: legacyAsset("/img%5Cservices%5Cco2-img.webp"), alt: "CO2 Laser Therapy" },
    legacyAnchors: ["co2", "co2-laser"],
  },
  {
    slug: "pico-laser",
    category: "face-skin",
    name: "Pico Laser",
    title: "Pico Laser — Precision Treatment",
    tagline: "Target Pigmentation and Scars",
    description: [
      "Ultra-short laser pulses break down pigment particles for clearer, brighter skin.",
      "Treats melasma, sunspots, acne scars — ideal for all skin types with minimal downtime.",
    ],
    benefits: ["Pigmentation Removal", "Scar Reduction", "Quick Recovery"],
    image: { src: legacyAsset("/img%5Cservices%5Cpico.webp"), alt: "Pico Laser Precision Treatment" },
    legacyAnchors: ["pico"],
  },
  {
    slug: "carbon-laser-peel",
    category: "face-skin",
    name: "Carbon Laser Peel",
    title: "Carbon Laser — Hollywood Peel",
    tagline: "Achieve a Hollywood Glow",
    description: [
      "Exfoliates and purifies the skin, reducing pore size and controlling oil while leaving your skin bright and glowing — perfect with absolutely no downtime.",
    ],
    benefits: ["Deep Cleansing", "Pore Reduction", "Radiant Glow"],
    image: { src: legacyAsset("/img%5Cservices%5Ccarbon-img.webp"), alt: "Carbon Laser Hollywood Peel" },
    legacyAnchors: ["carbon", "carbon-laser"],
  },
  {
    slug: "exilis-face-neck",
    category: "face-skin",
    name: "Exilis Face & Neck",
    title: "Exilis Face & Neck",
    tagline: "Tighten and Contour",
    description: [
      "Combines radiofrequency and ultrasound to tighten skin, reduce wrinkles, and contour the face and neck — no surgery, no downtime, lasting results.",
    ],
    benefits: ["Skin Tightening", "Wrinkle Reduction", "Dual Technology"],
    image: { src: legacyAsset("/img%5Cservices%5Cexilis-img.webp"), alt: "Exilis Face & Neck Treatment" },
    legacyAnchors: ["exilis-face"],
  },
  {
    slug: "intimate-whitening",
    category: "face-skin",
    name: "Intimate Whitening",
    title: "Intimate Whitening",
    tagline: "Brighten and Even Skin Tone",
    description: [
      "Lightens skin in sensitive areas, reducing hyperpigmentation for a brighter, more even tone using gentle, safe formulations suitable for all genders.",
    ],
    benefits: ["Safe & Gentle", "Effective Whitening", "No Downtime"],
    // The original page reuses the Cryotherapy photo here. Kept as-is until a dedicated image is supplied.
    image: { src: legacyAsset("/img/gallery-img-2.webp"), alt: "Underarm whitening results at Geneva Wellness" },
    legacyAnchors: [],
  },

  // ── Body & Contouring ──────────────────────────────────────────
  {
    slug: "cryotherapy",
    category: "body-contouring",
    name: "Cryotherapy",
    title: "Cryotherapy — Freeze Away Stubborn Fat",
    tagline: "Freeze Away Stubborn Fat",
    label: "Top Rated",
    description: [
      "Uses extreme cold to target and destroy fat cells in specific body areas.",
      "Non-invasive, no-downtime alternative to liposuction.",
      "Your body naturally eliminates treated fat cells over time for a slimmer, contoured appearance.",
    ],
    benefits: ["Fat Reduction", "No Surgery", "Quick Sessions", "Natural Elimination"],
    image: { src: legacyAsset("/img%5Cservices%5Ccryotherapy-img.webp"), alt: "Cryotherapy Fat Freezing" },
    legacyAnchors: ["cryotherapy"],
  },
  {
    slug: "ems",
    category: "body-contouring",
    name: "EMS Muscle Stimulation",
    title: "EMS — Electrical Muscle Stimulation",
    tagline: "Tone and Strengthen",
    description: [
      "Mimics a high-intensity workout with electrical impulses to tone muscles while reducing fat.",
      "Fully customizable — target specific muscle groups for personalized results.",
    ],
    benefits: ["Muscle Toning", "Fat Reduction", "Targeted Treatment"],
    image: { src: legacyAsset("/img%5Cservices%5Cems.webp"), alt: "EMS Electrical Muscle Stimulation" },
    legacyAnchors: [],
  },
  {
    slug: "exilis-body-contouring",
    category: "body-contouring",
    name: "Exilis Body Contouring",
    title: "Exilis Body Contouring",
    tagline: "Contour and Tighten",
    description: [
      "Combines radiofrequency and ultrasound to contour body areas — abdomen, thighs, arms, buttocks.",
      "Non-invasive, no downtime, visible improvements in firmness over time.",
    ],
    benefits: ["Body Contouring", "Skin Tightening", "Customizable"],
    image: { src: legacyAsset("/img%5Cservices%5Cexilis-body.webp"), alt: "Exilis Body Contouring" },
    legacyAnchors: ["exilis"],
  },
  {
    slug: "laser-hair-removal",
    category: "body-contouring",
    name: "Laser Hair Removal",
    title: "Laser Hair Removal",
    tagline: "Achieve Long-Lasting Smoothness",
    description: [
      "Long-term solution for unwanted hair — targets follicles to inhibit future growth.",
      "Suitable for all skin types, multiple body areas, minimal discomfort, no downtime.",
    ],
    benefits: ["Long-Term Results", "All Skin Types", "Multiple Areas"],
    image: { src: legacyAsset("/img%5Cservices%5Claser-hair-remove.webp"), alt: "Laser Hair Removal Treatment" },
    legacyAnchors: [],
  },

  // ── Hair & Scalp ───────────────────────────────────────────────
  {
    slug: "hair-restoration",
    category: "hair-scalp",
    name: "Hair Restoration",
    title: "Hair Restoration — Thicker, Healthier Hair",
    tagline: "Restore Hair Density",
    label: "Most Requested",
    description: [
      "Stimulates hair growth and improves scalp health using PRP therapy, laser therapy, and topical solutions.",
      "Tailored plans for noticeable improvements in hair density and quality — regular sessions give you thicker, healthier hair that boosts your confidence.",
    ],
    benefits: ["Thicker Hair", "Scalp Health", "Non-Invasive", "Personalized Care"],
    image: { src: legacyAsset("/img%5Cservices%5Chair-restoratial.webp"), alt: "Hair Restoration Treatment" },
    legacyAnchors: ["hair"],
    homepageDetail: {
      heading: "Regain your confidence with thicker, healthier hair",
      intro:
        "Our Hair Restoration treatments stimulate hair growth and improve scalp health, addressing hair thinning and loss.",
      benefits: [
        "Stimulates natural hair growth",
        "Improves overall scalp condition",
        "Comfortable non-surgical treatments",
        "Customized plans",
      ],
    },
  },
  {
    slug: "flaky-scalp-therapy",
    category: "hair-scalp",
    name: "Flaky Scalp Therapy",
    title: "Flaky Scalp Therapy",
    tagline: "Soothe and Strengthen",
    description: [
      "Targets dandruff and scalp conditions with deep cleansing and intense hydration.",
      "Removes dead cells and excess oil — strengthens follicles, promotes shiny, healthy hair.",
    ],
    benefits: ["Dandruff Control", "Scalp Hydration", "Stronger Hair"],
    image: { src: legacyAsset("/img%5Cservices%5Cflaky-scalp.webp"), alt: "Flaky Scalp Therapy Treatment" },
    legacyAnchors: [],
    homepageDetail: {
      heading: "Soothe and revitalize your scalp",
      intro:
        "Flaky Scalp Therapy targets dandruff and other scalp conditions, offering deep cleansing and intense hydration.",
      benefits: [
        "Treats and prevents dandruff",
        "Moisturizes and nourishes the scalp",
        "Removes impurities",
        "Promotes stronger, shinier hair",
      ],
    },
  },
  {
    slug: "scalp-psoriasis-therapy",
    category: "hair-scalp",
    name: "Scalp Psoriasis Therapy",
    title: "Scalp Psoriasis Therapy",
    tagline: "Manage and Relieve Psoriasis",
    description: [
      "Reduces psoriasis symptoms using medicated products and therapeutic techniques to soothe the scalp and promote healthy skin cell turnover for daily comfort.",
    ],
    benefits: ["Symptom Relief", "Anti-Inflammatory", "Scalp Health"],
    image: {
      src: legacyAsset("/img%5Cservices%5Cscalp-img.webp"),
      alt: "Scalp Psoriasis Therapy Treatment",
    },
    legacyAnchors: [],
    homepageDetail: {
      heading: "Relief for a healthier scalp",
      intro: "Scalp Psoriasis Therapy reduces the symptoms of psoriasis, such as itching and flakiness.",
      benefits: [
        "Soothes itching and flakiness",
        "Reduces inflammation",
        "Uses specialized products",
        "Promotes healthy skin cell turnover",
      ],
    },
  },
];

/**
 * Treatments that appear only as options in the original booking forms. They have no
 * description on the original site, so they get no detail page. They stay selectable
 * in the enquiry form so nothing the clinic offered is dropped.
 */
export const formOnlyTreatments: string[] = [
  "Anti-Aging (Per Area)",
  "Excimer RX Laser (Per Area)",
  "Arm Slimming",
  "Microneedling",
];

/** Treatments highlighted on the homepage (the original "Our Advanced Treatments" trio). */
export const featuredTreatmentSlugs = ["hydra-7d", "co2-laser", "carbon-laser-peel", "hifu"];

export const getTreatment = (slug: string) => treatments.find((t) => t.slug === slug);
export const getCategory = (id: TreatmentCategoryId) => treatmentCategories.find((c) => c.id === id)!;
export const treatmentsInCategory = (id: TreatmentCategoryId) => treatments.filter((t) => t.category === id);
