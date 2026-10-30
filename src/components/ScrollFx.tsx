"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-linked motion: a reading-progress bar and gentle parallax on [data-parallax]
 * elements (the value is the speed, e.g. "0.12"; negative moves against the scroll).
 * Parallax writes the CSS `translate` property, so it never fights reveal transforms.
 * Reduced motion skips it entirely.
 */
export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let items: { el: HTMLElement; speed: number; shift: number }[] = [];
    const collect = () => {
      items = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) => ({
        el,
        speed: Number(el.dataset.parallax) || 0,
        shift: items.find((i) => i.el === el)?.shift ?? 0,
      }));
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = root.scrollHeight - vh;
      root.style.setProperty("--scroll-progress", String(max > 0 ? y / max : 0));
      for (const item of items) {
        const r = item.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        // Rest position: centred in the viewport, or the top of the page for hero elements.
        const centre = r.top - item.shift + y + r.height / 2;
        const rest = Math.max(centre - vh / 2, 0);
        item.shift = (rest - y) * item.speed;
        item.el.style.translate = `0 ${item.shift.toFixed(1)}px`;
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    collect();
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const mo = new MutationObserver(() => {
      collect();
      request();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      mo.disconnect();
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
}
