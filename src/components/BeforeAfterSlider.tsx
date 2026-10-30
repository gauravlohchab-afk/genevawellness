"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BeforeAfterPair } from "@/content/beforeAfter";
import { Drag } from "./Icons";

/**
 * Comparison slider for one matched before/after pair. Works with mouse drag, touch
 * drag (vertical page scrolling still works), click-to-position and keyboard
 * (arrows, Page Up/Down, Home/End) through an ARIA slider.
 */
export default function BeforeAfterSlider({ pair }: { pair: BeforeAfterPair }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState<{ before?: boolean; after?: boolean }>({});

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, setFromClientX]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      PageDown: pos - 10,
      PageUp: pos + 10,
      Home: 0,
      End: 100,
    };
    if (e.key in map) {
      e.preventDefault();
      setPos(Math.min(100, Math.max(0, map[e.key])));
    }
  };

  // Touch: start dragging only on a mostly-horizontal gesture so vertical scrolling still works.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      e.preventDefault();
      setFromClientX(e.clientX);
      setDragging(true);
    } else {
      touchStart.current = { x: e.clientX, y: e.clientY };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || !touchStart.current || dragging) return;
    const dx = Math.abs(e.clientX - touchStart.current.x);
    const dy = Math.abs(e.clientY - touchStart.current.y);
    if (dx > 6 && dx > dy) {
      setDragging(true);
      setFromClientX(e.clientX);
    } else if (dy > 10) {
      touchStart.current = null;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && touchStart.current && !dragging) setFromClientX(e.clientX); // tap to position
    touchStart.current = null;
  };

  const Missing = ({ label }: { label: string }) => (
    <div className="img-missing">
      <strong>Original image</strong>
      <span>{label}</span>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`ba${dragging ? " is-dragging" : ""}`}
      style={{ ["--pos" as string]: `${pos}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="ba__layer ba__layer--after">
        {failed.after ? (
          <Missing label={pair.after.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pair.after.src}
            alt={pair.after.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed((f) => ({ ...f, after: true }))}
          />
        )}
      </div>
      <div className="ba__layer ba__layer--before">
        {failed.before ? (
          <Missing label={pair.before.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pair.before.src}
            alt={pair.before.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed((f) => ({ ...f, before: true }))}
          />
        )}
      </div>
      <span className="ba__label ba__label--before" aria-hidden="true">
        Before
      </span>
      <span className="ba__label ba__label--after" aria-hidden="true">
        After
      </span>
      <div className="ba__handle" aria-hidden="true" />
      <button
        type="button"
        className="ba__knob"
        role="slider"
        aria-label={`${pair.treatmentName}: drag to compare before and after`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before image shown`}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(true);
        }}
      >
        <Drag />
      </button>
    </div>
  );
}
