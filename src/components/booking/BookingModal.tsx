"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { contact, privacyPolicyHref } from "@/content/site";
import { formOnlyTreatments, treatmentCategories, treatmentsInCategory } from "@/content/treatments";
import {
  NOT_SURE,
  OTHER,
  fieldOrder,
  paymentMethods,
  submitEnquiry,
  validateEnquiry,
  whatsappText,
  type BookingMode,
  type EnquiryErrors,
  type EnquiryInput,
} from "@/lib/enquiry";
import { Check, Close, SocialIcon } from "../Icons";
import type { Brand } from "./BookingProvider";
import Select from "./Select";
import { imageAttrs } from "@/lib/assets";

/** Small line icons for fields and tabs (decorative). */
const ICONS = {
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  age: "M12 3v3m0 0a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3ZM5 21v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6M3 21h18M5 16c2.3 1.3 4.7 1.3 7 0s4.7-1.3 7 0",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  chat: "M4 5h16v11H9l-5 4Z",
} as const;

function FieldIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

const SHORT_ERRORS: Partial<Record<keyof EnquiryInput, string>> = {
  fullName: "Enter your full name",
  email: "Invalid email",
  phone: "Invalid number",
  age: "13–110 only",
  treatment: "Pick from the list",
  schedule: "Pick a future time",
  paymentMethod: "Pick from the list",
  message: "Too long",
};

type Status = "idle" | "submitting" | "success" | "not_configured" | "error";

interface Props {
  brand: Brand;
  source: string;
  draft: EnquiryInput;
  setDraft: React.Dispatch<React.SetStateAction<EnquiryInput>>;
  onClose: () => void;
}

const MODES: { id: BookingMode; label: string }[] = [
  { id: "consultation", label: "Consultation" },
  { id: "booking", label: "Direct Booking" },
];

/** Earliest pickable schedule: the next full hour, as a datetime-local value. */
function minSchedule() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
}

export default function BookingModal({ brand, source, draft, setDraft, onClose }: Props) {
  const uid = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [sentMode, setSentMode] = useState<BookingMode>(draft.mode);
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryInput, boolean>>>({});
  const mode = draft.mode;
  const booking = mode === "booking";

  const requestClose = useCallback(() => {
    if (closing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return onClose();
    setClosing(true);
    window.setTimeout(onClose, 280);
  }, [closing, onClose]);

  // Scroll lock (with scrollbar compensation), Escape to close, focus trap.
  useEffect(() => {
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevPad = body.style.paddingRight;
    body.classList.add("is-locked");
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>("[data-autofocus]") ?? dialog;
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusables.length) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.classList.remove("is-locked");
      body.style.paddingRight = prevPad;
    };
  }, [requestClose]);

  const update = <K extends keyof EnquiryInput>(key: K, value: EnquiryInput[K]) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    // Re-validate a field live once the visitor has interacted with it.
    if (touched[key] || errors[key]) {
      const all = validateEnquiry(next);
      setErrors((prev) => ({ ...prev, [key]: all[key] }));
    }
    if (status === "error" || status === "not_configured") setStatus("idle");
  };

  const blur = (key: keyof EnquiryInput) => {
    setTouched((t) => ({ ...t, [key]: true }));
    const all = validateEnquiry(draft);
    setErrors((prev) => ({ ...prev, [key]: all[key] }));
  };

  // Switching tabs keeps what was typed, but starts the new tab's checks fresh.
  const switchMode = (next: BookingMode) => {
    if (next === mode) return;
    setDraft((d) => ({ ...d, mode: next }));
    setErrors({});
    setTouched({});
    if (status !== "submitting") setStatus("idle");
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = mode === "consultation" ? "booking" : "consultation";
    switchMode(e.key === "Home" ? "consultation" : e.key === "End" ? "booking" : next);
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus());
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return; // guard against double submits
    const v = validateEnquiry(draft);
    const order = fieldOrder(mode);
    setErrors(v);
    setTouched(Object.fromEntries(order.map((k) => [k, true])));
    const firstBad = order.find((k) => v[k]);
    if (firstBad) {
      const el = dialogRef.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    const result = await submitEnquiry(draft, source);
    submitting.current = false;

    if (result.status === "success") {
      setSentMode(mode);
      setStatus("success");
      // Keep the visitor's contact details for a follow-up request; clear the rest.
      setDraft((d) => ({ ...d, treatment: "", message: "", schedule: "", paymentMethod: "", age: "" }));
    } else if (result.status === "invalid") {
      setErrors(result.errors);
      setStatus("idle");
    } else if (result.status === "not_configured") {
      setStatus("not_configured");
    } else {
      setErrorMsg(result.message);
      setStatus("error");
    }
  };

  const waHref = `https://wa.me/639153960593?text=${whatsappText(draft)}`;
  const errId = (k: string) => `${uid}-${k}-err`;
  const showErr = (k: keyof EnquiryInput) => (touched[k] || status !== "idle") && errors[k];
  const a11y = (k: keyof EnquiryInput) => ({
    id: `${uid}-${k}`,
    "data-field": k,
    "aria-invalid": !!showErr(k),
    "aria-describedby": showErr(k) ? errId(k) : undefined,
    onBlur: () => blur(k),
  });

  /** Label + control + inline error. A plain function (not a component) so inputs keep focus. */
  /** Short note shown beside the label (so errors never change the popup height); the full message is read out. */
  const shortError = (k: keyof EnquiryInput) => {
    const value = draft[k];
    if (value === "" || value === false) return "Required";
    return SHORT_ERRORS[k] ?? "Check this";
  };

  const field = (
    k: keyof EnquiryInput,
    label: string,
    control: React.ReactNode,
    opts: { required?: boolean; icon?: keyof typeof ICONS } = {}
  ) => (
    <div className={`field area-${k}${showErr(k) ? " has-error" : ""}`} key={k}>
      <div className="field__top">
        <label htmlFor={`${uid}-${k}`}>
          {label}
          {opts.required && <span className="req"> *</span>}
        </label>
        {showErr(k) && (
          <span className="field-error" id={errId(k)}>
            <span aria-hidden="true">{shortError(k)}</span>
            <span className="visually-hidden">{errors[k]}</span>
          </span>
        )}
      </div>
      <div className={`control${opts.icon ? " control--icon" : ""}`}>
        {opts.icon && <FieldIcon name={opts.icon} />}
        {control}
      </div>
    </div>
  );

  const selectProps = (k: keyof EnquiryInput) => ({
    id: `${uid}-${k}`,
    dataField: k,
    invalid: !!showErr(k),
    describedBy: showErr(k) ? errId(k) : undefined,
    onBlur: () => blur(k),
  });

  const treatmentSelect = (
    <Select
      {...selectProps("treatment")}
      value={draft.treatment}
      placeholder="Select a treatment"
      onChange={(v) => update("treatment", v)}
      groups={[
        ...treatmentCategories.map((cat) => ({ label: cat.name, options: treatmentsInCategory(cat.id).map((t) => t.name) })),
        { label: "Also available", options: [...formOnlyTreatments, NOT_SURE, OTHER] },
      ]}
    />
  );

  const nameInput = (
    <input
      {...a11y("fullName")}
      className="input"
      type="text"
      autoComplete="name"
      placeholder="Your full name"
      value={draft.fullName}
      onChange={(e) => update("fullName", e.target.value)}
      data-autofocus
      required
    />
  );
  const emailInput = (
    <input
      {...a11y("email")}
      className="input"
      type="email"
      inputMode="email"
      autoComplete="email"
      placeholder="your@email.com"
      value={draft.email}
      onChange={(e) => update("email", e.target.value)}
      required
    />
  );
  const phoneInput = (
    <input
      {...a11y("phone")}
      className="input"
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="09XX XXX XXXX"
      value={draft.phone}
      onChange={(e) => update("phone", e.target.value)}
      required
    />
  );

  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const panelId = `${uid}-panel`;
  const place = brand === "lavee" ? "Lavee by Geneva Wellness" : "Geneva Wellness Institute";

  return (
    <div className={`modal modal--booking${closing ? " is-closing" : ""}`} data-brand={brand}>
      <div className="modal__scrim" onClick={requestClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <aside className="booking-aside" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/skincare-ritual.webp" {...imageAttrs("/images/skincare-ritual.webp")} sizes="280px" alt="" />
          <div className="booking-aside__copy">
            <p className="booking-aside__brand">{place}</p>
            <p className="booking-aside__line">Your glow, our expertise.</p>
            <ul>
              <li>Free expert consultation</li>
              <li>15+ years of aesthetic care</li>
              <li>We reply within 24 hours</li>
            </ul>
          </div>
        </aside>
        <div className="booking-main">
        <div className="booking-head">
          <div className="booking-head__top">
            <div>
              <h2 id={titleId}>
                {status === "success" ? (
                  sentMode === "booking" ? (
                    <>
                      Booking <em>received</em>
                    </>
                  ) : (
                    <>
                      Consultation <em>requested</em>
                    </>
                  )
                ) : (
                  <>
                    Book your <em>{brand === "lavee" ? "session" : "treatment"}</em>
                  </>
                )}
              </h2>
              <p id={descId}>
                {status === "success"
                  ? "Thank you — we'll be in touch shortly."
                  : mode === "booking"
                    ? "Pick a time that suits you and we will confirm it."
                    : "Tell us your goals and an expert will guide you."}
              </p>
            </div>
            <button type="button" className="booking-close" onClick={requestClose} aria-label="Close booking form">
              <Close />
            </button>
          </div>

          {status !== "success" && (
            <div className="booking-tabs" role="tablist" aria-label="Booking type" data-mode={mode}>
              <span className="booking-tabs__thumb" aria-hidden="true" />
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${m.id}`}
                  aria-selected={mode === m.id}
                  aria-controls={panelId}
                  tabIndex={mode === m.id ? 0 : -1}
                  onClick={() => switchMode(m.id)}
                  onKeyDown={onTabKey}
                >
                  <FieldIcon name={m.id === "booking" ? "calendar" : "chat"} />
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="booking-body">
          {status === "success" ? (
            <div className="success" role="status">
              <div className="success__icon">
                <Check size={30} />
              </div>
              <p className="lede">
                {sentMode === "booking"
                  ? "We've received your booking request. Our team will contact you to confirm your schedule."
                  : "We've received your request. A team member will reach out to arrange your consultation."}
              </p>
              <button type="button" className="btn" onClick={requestClose} data-autofocus>
                Done
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              aria-busy={status === "submitting"}
              role="tabpanel"
              id={panelId}
              aria-labelledby={`${uid}-tab-${mode}`}
              key={mode}
              className="booking-form"
            >
              <div className={`booking-grid booking-grid--${mode}`}>
                {booking ? (
                  <>
                    {field("fullName", "Full Name", nameInput, { required: true, icon: "user" })}
                    {field(
                      "age",
                      "Age",
                      <input
                        {...a11y("age")}
                        className="input"
                        type="number"
                        inputMode="numeric"
                        min={13}
                        max={110}
                        placeholder="Age"
                        value={draft.age}
                        onChange={(e) => update("age", e.target.value)}
                      />,
                      { icon: "age" }
                    )}
                    {field("phone", "Contact #", phoneInput, { required: true, icon: "phone" })}
                    {field("email", "Email", emailInput, { required: true, icon: "mail" })}
                    {field("treatment", "Treatment", treatmentSelect, { required: true, icon: "sparkle" })}
                    {field(
                      "schedule",
                      "Preferred Schedule",
                      <input
                        {...a11y("schedule")}
                        className="input"
                        type="datetime-local"
                        min={minSchedule()}
                        step={900}
                        value={draft.schedule}
                        onChange={(e) => update("schedule", e.target.value)}
                        required
                      />,
                      { required: true, icon: "calendar" }
                    )}
                    {field(
                      "paymentMethod",
                      "Payment Method",
                      <Select
                        {...selectProps("paymentMethod")}
                        value={draft.paymentMethod}
                        placeholder="Select"
                        onChange={(v) => update("paymentMethod", v)}
                        groups={[{ options: paymentMethods }]}
                      />,
                      { icon: "card" }
                    )}
                  </>
                ) : (
                  <>
                    {field("fullName", "Full Name", nameInput, { required: true, icon: "user" })}
                    {field("email", "Email", emailInput, { required: true, icon: "mail" })}
                    {field("phone", "Phone", phoneInput, { required: true, icon: "phone" })}
                    {field("treatment", "Interest or Treatment", treatmentSelect, { required: true, icon: "sparkle" })}
                    {field(
                      "message",
                      "Message",
                      <textarea
                        {...a11y("message")}
                        className="input"
                        rows={2}
                        placeholder="Tell us about your concerns or questions..."
                        value={draft.message}
                        onChange={(e) => update("message", e.target.value)}
                        required
                      />,
                      { required: true }
                    )}
                  </>
                )}

                {/* Honeypot */}
                <div className="hp" aria-hidden="true">
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={draft.website ?? ""} onChange={(e) => update("website", e.target.value)} />
                  </label>
                </div>

                <div className={`field area-consent${showErr("consent") ? " has-error" : ""}`}>
                  <label className="check booking-consent">
                    <input
                      type="checkbox"
                      checked={draft.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      onBlur={() => blur("consent")}
                      aria-invalid={!!showErr("consent")}
                      aria-describedby={showErr("consent") ? errId("consent") : undefined}
                      data-field="consent"
                      required
                    />
                    <span>
                      I agree to the{" "}
                      <a href={privacyPolicyHref} target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>{" "}
                      and to being contacted about this request.
                    </span>
                  </label>
                  {showErr("consent") && (
                    <span className="visually-hidden" id={errId("consent")}>
                      {errors.consent}
                    </span>
                  )}
                </div>
              </div>

              <div aria-live="polite">
                {status === "not_configured" && (
                  <div className="form-alert" role="alert">
                    <strong>Online requests aren&apos;t connected yet, so this form could not send your details.</strong>
                    <span>
                      Nothing was sent and your details are still filled in. Please message us on WhatsApp or Messenger and we&apos;ll
                      book you in.
                    </span>
                    <div className="btn-row">
                      <a className="btn btn--sm" href={waHref} target="_blank" rel="noopener noreferrer">
                        <SocialIcon name="WhatsApp" size={16} /> WhatsApp us
                      </a>
                      <a className="btn btn--sm btn--ghost" href={contact.messenger.href} target="_blank" rel="noopener noreferrer">
                        <SocialIcon name="Messenger" size={16} /> Messenger
                      </a>
                    </div>
                  </div>
                )}
                {status === "error" && (
                  <div className="form-alert" role="alert">
                    <strong>{errorMsg}</strong>
                    <span>
                      You can also reach us on{" "}
                      <a href={waHref} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                      .
                    </span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn--block booking-submit" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Sending…
                  </>
                ) : booking ? (
                  "Confirm Booking"
                ) : (
                  "Request Consultation"
                )}
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
