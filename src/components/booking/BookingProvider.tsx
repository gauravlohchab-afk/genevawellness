"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { emptyEnquiry, type BookingMode, type EnquiryInput } from "@/lib/enquiry";
import BookingModal from "./BookingModal";

export type Brand = "geneva" | "lavee";

export interface OpenOptions {
  treatment?: string;
  /** Which tab the popup opens on. Defaults to the last one used, then "consultation". */
  mode?: BookingMode;
  clinicId?: string;
  brand?: Brand;
  /** Where the visitor opened the form from, sent with the enquiry. */
  source?: string;
}

interface Ctx {
  open: (opts?: OpenOptions) => void;
}

const BookingContext = createContext<Ctx | null>(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
};

/**
 * Optional first-visit prompt. Off by default; when on, it opens once per browser after
 * the delay and never again, and never on top of another open dialog.
 */
const FIRST_VISIT_PROMPT = { enabled: false, delayMs: 20_000, storageKey: "gwi-enquiry-prompted" };

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});
  // Kept here, not in the modal, so closing the dialog never throws away what was typed.
  const [draft, setDraft] = useState<EnquiryInput>(emptyEnquiry);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (o: OpenOptions = {}) => {
      lastTrigger.current = document.activeElement as HTMLElement | null;
      const brand: Brand = o.brand ?? (pathname?.startsWith("/lavee") ? "lavee" : "geneva");
      setOpts({ ...o, brand });
      setDraft((d) => ({
        ...d,
        mode: o.mode ?? d.mode,
        treatment: o.treatment ?? d.treatment,
        clinicId: o.clinicId ?? d.clinicId ?? "",
      }));
      setIsOpen(true);
    },
    [pathname]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => lastTrigger.current?.focus?.());
  }, []);

  useEffect(() => {
    if (!FIRST_VISIT_PROMPT.enabled) return;
    let seen = true;
    try {
      seen = localStorage.getItem(FIRST_VISIT_PROMPT.storageKey) === "1";
    } catch {
      /* storage unavailable: treat as seen so we never nag */
    }
    if (seen) return;
    const t = window.setTimeout(() => {
      if (document.querySelector("[role='dialog']")) return;
      try {
        localStorage.setItem(FIRST_VISIT_PROMPT.storageKey, "1");
      } catch {}
      open({ source: "first-visit-prompt" });
    }, FIRST_VISIT_PROMPT.delayMs);
    return () => window.clearTimeout(t);
  }, [open]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {isOpen && (
        <BookingModal
          brand={opts.brand ?? "geneva"}
          source={opts.source ?? pathname ?? "/"}
          draft={draft}
          setDraft={setDraft}
          onClose={close}
        />
      )}
    </BookingContext.Provider>
  );
}
