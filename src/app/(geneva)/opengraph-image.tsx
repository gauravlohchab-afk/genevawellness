import { renderOg } from "@/lib/og";
import { hero } from "@/content/site";

export const alt = "Geneva Wellness Institute — aesthetic clinic in Alabang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Aesthetic Clinic · Alabang",
    title: "Transformative Wellness & Aesthetic Treatments",
    subtitle: "Laser, HIFU, anti-aging, body contouring and hair restoration.",
    photo: hero.image.src,
  });
}
