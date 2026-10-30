/**
 * Before & after pairs, exactly as paired and captioned on the original homepage
 * ("Real Results"). Do not add a pair unless both images come from the clinic as a
 * matched set for the same client and treatment.
 */
import { legacyAsset } from "@/lib/assets";

export interface BeforeAfterPair {
  id: string;
  treatmentName: string;
  treatmentSlug: string;
  caption: string;
  before: { src: string; alt: string };
  after: { src: string; alt: string };
}

export const beforeAfterIntro = {
  heading: "See the transformation",
  body: "Witness the transformative power of our treatments with real client before & after results.",
  /**
   * The original site shows no disclaimer. This neutral wording was added for the
   * redesign and should be approved by the clinic (see AUDIT.md).
   */
  disclaimer:
    "Individual results vary. These are results from Geneva Wellness Institute clients and are not a guarantee of the outcome of any treatment. Your specialist will discuss what to expect during your consultation.",
};

export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "hifu-face-lift",
    treatmentName: "HIFU Face Lift",
    treatmentSlug: "hifu",
    caption: "6 weeks post-treatment — visible lift and firming",
    before: { src: legacyAsset("/img/before/clientbefore.webp"), alt: "Before HIFU treatment" },
    after: { src: legacyAsset("/img/before/clientafter.webp"), alt: "After HIFU treatment" },
  },
  {
    id: "co2-laser-resurfacing",
    treatmentName: "CO2 Laser Resurfacing",
    treatmentSlug: "co2-laser",
    caption: "Dramatic acne scar improvement after 3 sessions",
    before: { src: legacyAsset("/img/before/before.webp"), alt: "Before CO2 Laser" },
    after: { src: legacyAsset("/img/before/after.webp"), alt: "After CO2 Laser" },
  },
];
