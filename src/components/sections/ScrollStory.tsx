"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BookButton from "@/components/booking/BookButton";
import { ArrowRight } from "@/components/Icons";
import SmartImage from "@/components/SmartImage";
import { imageAttrs } from "@/lib/assets";
import type { featureStories } from "@/content/site";

type Story = (typeof featureStories)[number];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Pinned scroll story: on wide screens the image stage sticks while the copy scrolls past,
 * and each chapter wipes its photo in over the last. On small screens every chapter keeps
 * its own photo inline, so nothing depends on the sticky stage.
 */
export default function ScrollStory({ stories }: { stories: Story[] }) {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // The chapter crossing the middle of the viewport is the active one.
  useEffect(() => {
    const steps = Array.from(stepsRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Overall progress through the story drives the progress rail.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = stepsRef.current;
      if (!el || !stageRef.current) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max((vh / 2 - r.top) / r.height, 0), 1);
      stageRef.current.style.setProperty("--story-p", p.toFixed(4));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <section className="scroll-story" aria-label="Featured treatment areas">
      <div className="container scroll-story__grid">
        <div className="scroll-story__steps" ref={stepsRef}>
          {stories.map((s, i) => (
            <article className={`scroll-story__step${i === active ? " is-active" : ""}`} data-step={i} key={s.heading}>
              <SmartImage src={s.image.src} alt={s.image.alt} frame="media scroll-story__inline" reveal />
              <div className="scroll-story__copy">
                <span className="story__index">
                  {pad(i + 1)} — {s.eyebrow}
                </span>
                <h2 className="h2">{s.heading}</h2>
                <p className="lede">{s.body}</p>
                <div className="btn-row btn-row--link">
                  <BookButton className="btn" source={`home-story-${i + 1}`}>
                    {i === 0 ? "Book a Laser Session" : "Book Consultation"}
                  </BookButton>
                  <Link href={s.cta.href} className="link-arrow">
                    {s.cta.label} <ArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="scroll-story__stage" ref={stageRef} aria-hidden="true">
          <div className="scroll-story__frame">
            {stories.map((s, i) => (
              <div
                key={s.heading}
                className={`scroll-story__layer${i <= active ? " is-shown" : ""}${i === active ? " is-active" : ""}`}
                style={{ zIndex: i + 1 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image.src} {...imageAttrs(s.image.src)} sizes="55vw" alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
            ))}
            <div className="scroll-story__caption">
              <span key={active}>{stories[active].eyebrow}</span>
            </div>
          </div>
          <div className="scroll-story__meta">
            <span className="scroll-story__count">
              <b key={active}>{pad(active + 1)}</b> / {pad(stories.length)}
            </span>
            <span className="scroll-story__rail">
              <i />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
