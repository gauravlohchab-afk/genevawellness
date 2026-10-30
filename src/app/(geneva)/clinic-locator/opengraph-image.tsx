import { renderOg } from "@/lib/og";
import { aboutPage } from "@/content/site";

export const alt = "Find a Geneva Wellness Institute clinic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Clinic Locator",
    title: "Find Your Clinic",
    subtitle: "Our main clinic in Alabang and Lavee by Geneva Wellness.",
    photo: aboutPage.image.src,
  });
}
