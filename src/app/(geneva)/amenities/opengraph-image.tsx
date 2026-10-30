import { renderOg } from "@/lib/og";
import { amenityCount } from "@/content/amenities";

export const alt = "Amenities at Geneva Wellness Institute, Alabang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Clinic Guide · Alabang",
    title: "Amenities",
    subtitle: `${amenityCount} spaces, from arrival to the sauna.`,
    photo: "/images/clinic-storefront.webp",
  });
}
