import { renderOg } from "@/lib/og";
import { about } from "@/content/site";

export const alt = "Client testimonials for Geneva Wellness Institute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Client Stories",
    title: "Client Testimonials",
    subtitle: "Real stories from clients who transformed their confidence.",
    photo: about.images[1].src,
  });
}
