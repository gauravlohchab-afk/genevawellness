import { renderOg } from "@/lib/og";
import { treatmentCategories } from "@/content/treatments";

export const alt = "Treatments at Geneva Wellness Institute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Our Treatments",
    title: "Premium Non-Invasive Treatments",
    subtitle: "Face & skin, body contouring, and hair & scalp care.",
    photo: treatmentCategories[0].image.src,
  });
}
