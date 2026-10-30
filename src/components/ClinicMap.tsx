"use client";

import { useState } from "react";
import { Pin } from "./Icons";

/** Google Maps embed that loads only on request (keeps the page fast and avoids third-party cookies). */
export default function ClinicMap({ query, name }: { query: string | null; name: string }) {
  const [show, setShow] = useState(false);
  if (!query) {
    return (
      <div className="map-cta">
        <Pin />
        <p>The map will appear here once this clinic&apos;s address is confirmed.</p>
      </div>
    );
  }
  return show ? (
    <iframe
      src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
      title={`Map showing ${name}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  ) : (
    <div className="map-cta">
      <Pin />
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShow(true)}>
        Show map
      </button>
      <p>Loads Google Maps for {name}.</p>
    </div>
  );
}
