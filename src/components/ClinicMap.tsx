import { Pin } from "./Icons";

/**
 * Google Maps embed for a clinic, pinned to its location. Uses the clinic's official embed
 * link when there is one, otherwise a search for its address. Loads lazily, so maps further
 * down the page don't slow the first paint. Clinics without a confirmed address show a
 * placeholder rather than a guessed location.
 */
export default function ClinicMap({ embedUrl, query, name }: { embedUrl?: string; query: string | null; name: string }) {
  const src = embedUrl ?? (query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : null);
  if (!src) {
    return (
      <div className="map-cta">
        <Pin />
        <p>The map will appear here once this clinic&apos;s address is confirmed.</p>
      </div>
    );
  }
  return (
    <iframe
      src={src}
      title={`Map showing ${name}`}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
