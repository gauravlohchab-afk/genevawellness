import { renderOg } from "@/lib/og";
import { lavee } from "@/content/lavee";

export const alt = "Lavee by Geneva Wellness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({ brand: "lavee", eyebrow: lavee.secondaryLine, title: lavee.fullName, subtitle: `${lavee.headline}.` });
}
