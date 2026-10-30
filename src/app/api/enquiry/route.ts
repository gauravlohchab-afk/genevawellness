import { NextResponse } from "next/server";
import { getClinic } from "@/content/clinics";
import { emptyEnquiry, formatSchedule, validateEnquiry, type EnquiryInput } from "@/lib/enquiry";

/**
 * Booking endpoint. Validates on the server, then forwards the lead to the clinic's
 * leads API: POST {LEADS_API_URL}/api/leads?type=call|booking&center={LEADS_CENTER}.
 * Consultation requests go in as type=call, direct bookings as type=booking.
 * Without LEADS_CENTER it answers 503 "not_configured", and the form tells the visitor
 * plainly instead of pretending the request was sent.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEADS_API_URL = (process.env.LEADS_API_URL ?? "https://miraculous-serenity-production-5d5a.up.railway.app").replace(/\/$/, "");

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  const input: EnquiryInput = {
    ...emptyEnquiry,
    mode: body.mode === "booking" ? "booking" : "consultation",
    fullName: str(body.fullName, 200),
    email: str(body.email, 250),
    phone: str(body.phone, 40),
    treatment: str(body.treatment, 120),
    message: str(body.message, 2500),
    age: str(body.age, 5),
    schedule: str(body.schedule, 40),
    paymentMethod: str(body.paymentMethod, 60),
    clinicId: str(body.clinicId, 60),
    consent: body.consent === true,
    website: str(body.website, 200),
  };

  // Honeypot filled: accept silently so bots learn nothing, but forward nothing.
  if (input.website) return NextResponse.json({ ok: true });

  const errors = validateEnquiry(input);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const center = process.env.LEADS_CENTER;
  if (!center) {
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const booking = input.mode === "booking";
  const clinic = input.clinicId ? getClinic(input.clinicId) : undefined;
  const notes = [
    booking ? "" : input.message.trim(),
    booking ? `Preferred schedule: ${formatSchedule(input.schedule)}` : "",
    clinic ? `Preferred clinic: ${clinic.name}` : "",
  ].filter(Boolean);

  // Field names follow the leads API (it requires fullname, email, phone, treatment,
  // plus schedule for bookings). The picked schedule is Philippine time.
  const payload = {
    fullname: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    treatment: input.treatment,
    message: notes.join("\n"),
    ...(booking && {
      schedule: `${input.schedule}:00+08:00`,
      age: input.age ? Number(input.age) : undefined,
      payment_method: input.paymentMethod || undefined,
    }),
    clinic: clinic?.name,
    source: str(body.source, 120),
  };

  const url = `${LEADS_API_URL}/api/leads?type=${booking ? "booking" : "call"}&center=${encodeURIComponent(center)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Leads API responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  } catch (err) {
    console.error("[enquiry] delivery failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
