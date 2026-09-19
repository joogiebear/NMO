import { NextResponse } from "next/server";
import { site } from "@/content/site";
import { saveSubmission, type SubmissionKind } from "@/lib/inbox";

/**
 * Receives every form on the site (nominations, volunteers, sponsors, messages)
 * and forwards it wherever the organization wants it.
 *
 * Every submission is first saved to the admin inbox (/admin/inbox). On top of
 * that, delivery is pluggable so nobody has to touch this file:
 *   RESEND_API_KEY + FORMS_TO_EMAIL  → also sends an email
 *   FORMS_WEBHOOK_URL                → also posts JSON anywhere (Zapier, Make, Sheets)
 *
 * A submission counts as received if it reached the inbox *or* was delivered.
 * Only if neither happened does the form tell the visitor to email instead —
 * nothing is silently dropped.
 */

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 5000;
const MAX_FIELDS = 40;

// The inbox is a database table, so the public form gets a simple per-visitor
// limit to stop anyone filling it. Generous enough for a real person.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const recent = new Map<string, { count: number; resetAt: number }>();

function tooMany(request: Request): boolean {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const entry = recent.get(key);
  if (!entry || entry.resetAt < now) {
    recent.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}
const LABELS: Record<string, string> = {
  nomination: "Family nomination",
  volunteer: "Volunteer sign-up",
  sponsor: "Sponsorship inquiry",
  message: "Message from the website",
};

type Payload = Record<string, string | string[]>;

function asText(value: string | string[]): string {
  return Array.isArray(value) ? value.join(", ") : value;
}

function render(kind: string, payload: Payload): string {
  const heading = LABELS[kind] ?? "Website form";
  const lines = Object.entries(payload)
    .filter(([key]) => key !== "kind" && key !== "company_website")
    .map(([key, value]) => {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `${label}:\n${asText(value)}`;
    });
  return [`${heading} — ${site.name}`, "", ...lines].join("\n\n");
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "We couldn't read that." }, { status: 400 });
  }

  // Honeypot: bots fill every field they find. Accept and discard silently.
  if (asText(payload.company_website ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const kind = asText(payload.kind ?? "message");
  if (!LABELS[kind]) {
    return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 400 });
  }

  if (Object.keys(payload).length > MAX_FIELDS) {
    return NextResponse.json({ ok: false, error: "We couldn't read that." }, { status: 400 });
  }

  const hasContent = Object.entries(payload).some(
    ([key, value]) => key !== "kind" && asText(value).trim() !== "",
  );
  if (!hasContent) {
    return NextResponse.json(
      { ok: false, error: "The form came through empty." },
      { status: 400 },
    );
  }

  for (const value of Object.values(payload)) {
    if (asText(value).length > MAX_FIELD_LENGTH) {
      return NextResponse.json(
        { ok: false, error: "That message is too long to send." },
        { status: 413 },
      );
    }
  }

  if (tooMany(request)) {
    return NextResponse.json(
      { ok: false, error: "That's a lot of messages — please email us instead." },
      { status: 429 },
    );
  }

  // Inbox first. A failure here is logged, not fatal: email may still deliver.
  let stored = false;
  try {
    const fields = Object.fromEntries(
      Object.entries(payload)
        .filter(([key]) => key !== "kind" && key !== "company_website")
        .map(([key, value]) => [key, asText(value)]),
    );
    stored = await saveSubmission(kind as SubmissionKind, fields);
  } catch (error) {
    console.error("[form] could not save to the inbox", error);
  }

  const body = render(kind, payload);
  const subject = `${LABELS[kind]} — ${site.shortName} website`;

  const webhookUrl = process.env.FORMS_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FORMS_TO_EMAIL;
  const fromEmail = process.env.FORMS_FROM_EMAIL ?? "website@ninam.org";

  try {
    if (resendKey && toEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${site.shortName} Website <${fromEmail}>`,
          to: [toEmail],
          reply_to: asText(payload.email ?? "") || undefined,
          subject,
          text: body,
        }),
      });
      if (!res.ok) throw new Error(`Email provider returned ${res.status}`);
      return NextResponse.json({ ok: true });
    }

    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, subject, text: body, fields: payload }),
      });
      if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
      return NextResponse.json({ ok: true });
    }
  } catch (error) {
    console.error("[form] delivery failed", error);
    // It is safely in the inbox even though the email did not go.
    if (stored) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: "We couldn't deliver that message." },
      { status: 502 },
    );
  }

  if (stored) return NextResponse.json({ ok: true });

  console.warn("[form] no inbox and no delivery method — submission not stored.\n", body);
  return NextResponse.json(
    { ok: false, error: "Our form isn't connected yet." },
    { status: 503 },
  );
}
