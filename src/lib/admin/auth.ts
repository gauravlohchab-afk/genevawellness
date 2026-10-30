import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Single-admin password login. Set ADMIN_PASSWORD (and ideally ADMIN_SESSION_SECRET)
 * in the server environment. The session is a signed, httpOnly cookie; nothing secret
 * is ever sent to the browser.
 */
const COOKIE = "gwi_admin";
const SESSION_HOURS = 8;

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

const secret = () =>
  process.env.ADMIN_SESSION_SECRET || createHash("sha256").update(`gwi-session:${process.env.ADMIN_PASSWORD ?? ""}`).digest("hex");

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(input, expected!);
}

export async function createSession() {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const value = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.ADMIN_INSECURE_COOKIE !== "1",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminEnabled()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, sig] = value.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(expires));
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

// Basic brute-force protection: 5 failed attempts per IP per 15 minutes.
const attempts = new Map<string, { count: number; until: number }>();
export function loginBlocked(ip: string) {
  const a = attempts.get(ip);
  return Boolean(a && a.count >= 5 && a.until > Date.now());
}
export function recordFailure(ip: string) {
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || a.until < now) attempts.set(ip, { count: 1, until: now + 15 * 60_000 });
  else a.count++;
}
export function clearFailures(ip: string) {
  attempts.delete(ip);
}
