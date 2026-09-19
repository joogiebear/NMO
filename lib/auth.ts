import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin sign-in: one shared password (ADMIN_PASSWORD) and a signed, expiring
 * session cookie (ADMIN_SESSION_SECRET). Both are Railway variables; if either
 * is missing the admin is simply switched off.
 *
 * Every admin page and every server action calls requireAdmin() itself — a
 * check in the layout alone would not run again on client-side navigation.
 */

const COOKIE = "nmo_admin";
const SESSION_DAYS = 14;

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function sign(value: string): string {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  // Hash first so the comparison is constant-time regardless of input length.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(input, expected as string);
}

export async function startSession(): Promise<void> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const value = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires),
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

/* ---------------------------------------------------------------- throttle */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** True if this client may try a password now; counts the attempt. */
export async function allowLoginAttempt(): Promise<boolean> {
  const key = await clientKey();
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}

export async function clearLoginAttempts(): Promise<void> {
  attempts.delete(await clientKey());
}
