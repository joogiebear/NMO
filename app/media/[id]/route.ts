import { db, ensureSchema } from "@/lib/db";

/** Serves a photo uploaded through the admin. Ids never change, so cache hard. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = db();
  if (!sql || !/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  await ensureSchema(sql);
  const [row] = await sql<{ mime: string; bytes: Buffer }[]>`
    select mime, bytes from media where id = ${id}`;
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.bytes), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
