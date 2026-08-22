import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Receives every form on the site (nominations, volunteers, sponsors, messages)
 * and forwards it wherever the organization wants it.
 *
 * Delivery is pluggable so nobody has to touch this file:
 *   RESEND_API_KEY + FORMS_TO_EMAIL  → sends an email
 *   FORMS_WEBHOOK_URL                → posts JSON anywhere (Zapier, Make, Sheets)
 *
 * With neither configured the route fails politely and the form tells the
 * visitor to email instead — nothing is silently dropped.
 */

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 5000;
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
    return NextResponse.json(
      { ok: false, error: "We couldn't deliver that message." },
      { status: 502 },
    );
  }

  console.warn("[form] no delivery method configured — submission not stored.\n", body);
  return NextResponse.json(
    { ok: false, error: "Our form isn't connected yet." },
    { status: 503 },
  );
}
