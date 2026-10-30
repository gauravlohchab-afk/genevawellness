/**
 * Booking form model and validation, shared by the browser form and the /api/enquiry
 * route so both apply exactly the same rules.
 *
 * Two modes, matching the popup's tabs and the leads API's two lead types:
 * - "consultation" (type=call): name, email, phone, treatment, message.
 * - "booking" (type=booking): name, age, treatment, contact number, email, preferred
 *   schedule and payment method.
 * The leads API requires fullname, email, phone and treatment for both, plus schedule
 * for bookings. The clinic is never asked for here; it is pre-filled when the popup is
 * opened from a clinic's own button and passed along with the lead.
 */
import { getClinic } from "@/content/clinics";
import { formOnlyTreatments, treatments } from "@/content/treatments";

export type BookingMode = "consultation" | "booking";

export interface EnquiryInput {
  mode: BookingMode;
  fullName: string;
  email: string;
  phone: string;
  treatment: string;
  message: string;
  age: string;
  schedule: string;
  paymentMethod: string;
  clinicId: string;
  consent: boolean;
  /** Honeypot: real visitors never fill this in. */
  website?: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export const NOT_SURE = "Not sure yet — please advise";
export const OTHER = "Other";

export const treatmentOptions = [...treatments.map((t) => t.name), ...formOnlyTreatments, NOT_SURE, OTHER];

export const paymentMethods = ["Cash", "Credit / Debit Card", "GCash", "Maya", "Bank Transfer"];

export const emptyEnquiry: EnquiryInput = {
  mode: "consultation",
  fullName: "",
  email: "",
  phone: "",
  treatment: "",
  message: "",
  age: "",
  schedule: "",
  paymentMethod: "",
  clinicId: "",
  consent: false,
  website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Value of an <input type="datetime-local">, e.g. 2026-11-05T14:30. */
const SCHEDULE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** Accepts PH mobiles (09XX… / +639XX…), PH landlines and international numbers. */
export function isValidPhone(raw: string) {
  const v = raw.replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(v)) return false;
  if (v.startsWith("09")) return v.length === 11;
  if (v.startsWith("+639") || v.startsWith("639")) return v.replace("+", "").length === 12;
  const digits = v.replace("+", "");
  return digits.length >= 7 && digits.length <= 15;
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const e: EnquiryErrors = {};
  const booking = input.mode === "booking";

  const name = input.fullName.trim();
  if (!name || name.length < 2 || name.length > 120) e.fullName = "Please enter your full name.";

  const email = input.email.trim();
  if (!email) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email) || email.length > 200) e.email = "Please enter a valid email address, like name@example.com.";

  if (!input.phone.trim()) e.phone = "Please enter your phone number.";
  else if (!isValidPhone(input.phone)) e.phone = "Please enter a valid phone number, like 0915 396 0593 or +63 915 396 0593.";

  if (!input.treatment) e.treatment = "Please choose a treatment, or pick “Not sure yet”.";
  else if (!treatmentOptions.includes(input.treatment)) e.treatment = "Please choose a treatment from the list.";

  if (booking) {
    if (input.age) {
      const age = Number(input.age);
      if (!Number.isInteger(age) || age < 13 || age > 110) e.age = "Please enter your age in years.";
    }
    if (!input.schedule) e.schedule = "Please choose your preferred date and time.";
    else if (!SCHEDULE_RE.test(input.schedule)) e.schedule = "Please choose a date and time from the picker.";
    else if (new Date(input.schedule).getTime() < Date.now() - 60_000) e.schedule = "Please choose a date and time in the future.";
    if (input.paymentMethod && !paymentMethods.includes(input.paymentMethod)) e.paymentMethod = "Please choose a payment method from the list.";
  } else {
    if (!input.message.trim()) e.message = "Please tell us a little about your concerns or questions.";
    else if (input.message.length > 2000) e.message = "Please keep your message under 2,000 characters.";
  }

  if (!input.consent) e.consent = "Please confirm you agree to the Privacy Policy so we can contact you.";
  return e;
}

/** Field order per mode, used to focus the first invalid field. */
export const fieldOrder = (mode: BookingMode): (keyof EnquiryInput)[] =>
  mode === "booking"
    ? ["fullName", "age", "treatment", "phone", "email", "schedule", "paymentMethod", "consent"]
    : ["fullName", "email", "phone", "treatment", "message", "consent"];

/** "2026-11-05T14:30" → "Thu, 5 Nov 2026, 2:30 PM" (the clinic's local time, as picked). */
export function formatSchedule(value: string) {
  if (!SCHEDULE_RE.test(value)) return value;
  const [d, t] = value.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [h, min] = t.split(":").map(Number);
  const date = new Date(Date.UTC(y, m - 1, day, h, min));
  return date.toLocaleString("en-PH", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export type SubmitResult =
  | { status: "success" }
  | { status: "not_configured" }
  | { status: "invalid"; errors: EnquiryErrors }
  | { status: "error"; message: string };

/** Browser-side submission service. The endpoint holds the API details; nothing sensitive lives here. */
export async function submitEnquiry(input: EnquiryInput, source: string): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, source }),
    });
  } catch {
    return { status: "error", message: "We couldn't reach our server. Please check your connection and try again." };
  }
  const data = (await res.json().catch(() => ({}))) as { code?: string; errors?: EnquiryErrors };
  if (res.ok) return { status: "success" };
  if (res.status === 503 && data.code === "not_configured") return { status: "not_configured" };
  if (res.status === 400 && data.errors) return { status: "invalid", errors: data.errors };
  return { status: "error", message: "Something went wrong while sending your request. Your details are still here, so please try again." };
}

/** Pre-filled WhatsApp message used as a fallback channel. */
export function whatsappText(input: Partial<EnquiryInput>) {
  const booking = input.mode === "booking";
  const lines = [`Hello, I came from the website and would like to ${booking ? "book a treatment" : "book a consultation"}.`];
  if (input.treatment) lines.push(`Treatment: ${input.treatment}`);
  const clinic = input.clinicId ? getClinic(input.clinicId) : undefined;
  if (clinic) lines.push(`Clinic: ${clinic.shortName}`);
  if (booking && input.schedule) lines.push(`Preferred schedule: ${formatSchedule(input.schedule)}`);
  if (input.fullName) lines.push(`Name: ${input.fullName}`);
  return encodeURIComponent(lines.join("\n"));
}
