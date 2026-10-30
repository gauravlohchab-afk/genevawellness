import { renderOg } from "@/lib/og";
import { clinicGallery } from "@/content/site";

export const alt = "Geneva Wellness Institute gallery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Gallery",
    title: "Inside Geneva Wellness",
    subtitle: "Our treatment suites, rituals and technology.",
    photo: clinicGallery[0].src,
  });
}
