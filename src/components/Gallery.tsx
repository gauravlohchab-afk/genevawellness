"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SmartImage from "./SmartImage";
import { ChevronLeft, ChevronRight, Close } from "./Icons";

type Img = { src: string; alt: string };

export default function Gallery({ images }: { images: Img[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    document.body.classList.add("is-locked");
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        // Keep focus inside the three lightbox controls.
        const btns = Array.from(document.querySelectorAll<HTMLElement>(".lightbox button"));
        const i = btns.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [index, close, step]);

  return (
    <>
      <div className="gallery">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={(e) => {
              opener.current = e.currentTarget;
              setIndex(i);
            }}
            aria-label={`Open ${img.alt}`}
          >
            <SmartImage src={img.src} alt={img.alt} frame="media media--zoom" />
          </button>
        ))}
      </div>
      {index !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery viewer" onClick={(e) => e.target === e.currentTarget && close()}>
          <button ref={closeBtn} type="button" className="lightbox__btn lightbox__close" onClick={close} aria-label="Close gallery">
            <Close />
          </button>
          <button type="button" className="lightbox__btn lightbox__prev" onClick={() => step(-1)} aria-label="Previous image">
            <ChevronLeft />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index].src} alt={images[index].alt} />
          <button type="button" className="lightbox__btn lightbox__next" onClick={() => step(1)} aria-label="Next image">
            <ChevronRight />
          </button>
          <p className="lightbox__count" aria-live="polite">
            {index + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
