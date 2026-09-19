import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Photo upload for the admin. The browser has already resized the image
 * (components/admin/Editor.tsx), so what arrives here is small; it is stored
 * in Postgres and served back from /media/<id>.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  // Same-origin only: the session cookie alone should not be enough.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "Bad request." }, { status: 403 });
  }

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No photo was sent." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG or WebP photo." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That photo is too large." }, { status: 413 });
  }

  const sql = db();
  if (!sql) {
    return NextResponse.json({ error: "Photo storage isn’t connected." }, { status: 503 });
  }
  await ensureSchema(sql);
  const bytes = Buffer.from(await file.arrayBuffer());
  const [row] = await sql<{ id: string }[]>`
    insert into media (mime, bytes) values (${file.type}, ${bytes}) returning id`;
  return NextResponse.json({ url: `/media/${row.id}` });
}
