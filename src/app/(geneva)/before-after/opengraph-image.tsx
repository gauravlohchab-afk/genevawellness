import { renderOg } from "@/lib/og";
import { beforeAfterPairs } from "@/content/beforeAfter";

export const alt = "Before and after results at Geneva Wellness Institute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Real Results",
    title: "Before & After Results",
    subtitle: "HIFU, CO2 laser and more, from Geneva Wellness clients.",
    photo: beforeAfterPairs[0].after.src,
  });
}
