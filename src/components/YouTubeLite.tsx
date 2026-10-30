"use client";

import { useState } from "react";
import { Play } from "./Icons";

/** Click-to-load YouTube embed: no third-party scripts until the visitor asks for the video. */
export default function YouTubeLite({
  id,
  title,
  thumb = "hqdefault",
  poster,
}: {
  id: string;
  title: string;
  thumb?: "hqdefault" | "maxresdefault";
  /** Own cover image instead of YouTube's thumbnail. */
  poster?: string;
}) {
  const [active, setActive] = useState(false);
  return (
    <div className="yt">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="yt__btn" onClick={() => setActive(true)} aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster ?? `https://i.ytimg.com/vi/${id}/${thumb}.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
          <span className="yt__play">
            <Play />
          </span>
          <span className="yt__title">{title}</span>
        </button>
      )}
    </div>
  );
}
