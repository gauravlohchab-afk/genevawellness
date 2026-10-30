"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/content/site";
import { lavee } from "@/content/lavee";

/** The supplied Geneva logo file, unaltered. Falls back to the plain name if the file can't load. */
export function GenevaLogo({ className = "logo-geneva" }: { className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span className="logo-fallback">
        Geneva <small>Wellness Institute</small>
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={brand.logo.src} alt={brand.logo.alt} className={className} width={127} height={77} onError={() => setFailed(true)} />;
}

type LaveeVariant = keyof typeof lavee.logos;

/** Lavee wordmark from the brand kit. Never recoloured or redrawn: pick the supplied variant. */
export function LaveeLogo({
  variant = "lavender",
  width = 200,
  className = "logo-lavee",
  alt = "Lavee",
  priority,
}: {
  variant?: LaveeVariant;
  width?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const file = lavee.logos[variant];
  const height = Math.round((width * file.height) / file.width);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={file.src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width, height: "auto" }}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/** Endorsed lockup (kit p.5): logo with "By Geneva / Wellness Institute" in Cinzel. */
export function LaveeLockup({ dark = false, width = 260, priority }: { dark?: boolean; width?: number; priority?: boolean }) {
  return (
    <div className={`lavee-lockup${dark ? " lavee-lockup--dark" : ""}`}>
      <LaveeLogo
        variant={dark ? "cream" : "lavender"}
        width={width}
        alt="Lavee by Geneva Wellness Institute"
        priority={priority}
      />
      <span className="lavee-lockup__endorse" aria-hidden="true">
        <span>
          {lavee.endorsement[0]}
          <br />
          {lavee.endorsement[1]}
        </span>
      </span>
    </div>
  );
}
