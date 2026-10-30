"use client";

import { useEffect, useRef, useState } from "react";
import { imageAttrs } from "@/lib/assets";

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Wrapper class, e.g. "media ratio-4x5 media--zoom". */
  frame?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  reveal?: boolean;
}

/**
 * Image with a reserved frame (no layout shift) and an honest fallback: if an original
 * asset fails to load, the frame says which image is missing instead of showing a
 * broken icon or a stand-in photo.
 */
export default function SmartImage({
  src,
  alt,
  className,
  frame = "media",
  priority,
  sizes,
  width,
  height,
  reveal = false,
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const auto = imageAttrs(src);

  useEffect(() => {
    const img = ref.current;
    // Catch errors that fired before hydration.
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  return (
    <div className={frame} data-reveal={reveal ? "media" : undefined}>
      {failed ? (
        <div className="img-missing" role="img" aria-label={alt}>
          <strong>Original image</strong>
          <span>{alt}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={className}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          srcSet={auto.srcSet}
          sizes={auto.srcSet ? (sizes ?? "(max-width: 760px) 100vw, 50vw") : sizes}
          width={width ?? auto.width}
          height={height ?? auto.height}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
