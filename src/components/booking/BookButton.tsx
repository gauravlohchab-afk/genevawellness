"use client";

import type { ReactNode } from "react";
import { useBooking, type OpenOptions } from "./BookingProvider";

export default function BookButton({
  children = "Book a Consultation",
  className = "btn",
  ...opts
}: OpenOptions & { children?: ReactNode; className?: string }) {
  const { open } = useBooking();
  return (
    <button type="button" className={className} onClick={() => open(opts)} aria-haspopup="dialog">
      {children}
    </button>
  );
}
