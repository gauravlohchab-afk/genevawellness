import { renderOg } from "@/lib/og";
import { aboutPage } from "@/content/site";

export const alt = "About Geneva Wellness Institute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "About Us", title: "Meet Our Aesthetic Specialists", subtitle: aboutPage.intro, photo: aboutPage.image.src });
}
