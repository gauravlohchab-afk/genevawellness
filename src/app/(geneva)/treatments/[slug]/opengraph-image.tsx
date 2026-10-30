import { renderOg } from "@/lib/og";
import { brand } from "@/content/site";
import { getCategory, getTreatment, treatments } from "@/content/treatments";

export const alt = "Treatment at Geneva Wellness Institute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return renderOg({ eyebrow: "Our Treatments", title: brand.name });
  return renderOg({ eyebrow: getCategory(t.category).name, title: t.name, subtitle: t.tagline, photo: t.image.src });
}
