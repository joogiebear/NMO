import "server-only";
import { db, ensureSchema } from "@/lib/db";

/**
 * Everything sent through the site's forms — nominations, volunteer sign-ups,
 * sponsorship inquiries and messages — kept where the board can read it in
 * /admin, whether or not email delivery is ever set up.
 *
 * Nominations describe a family's illness and finances. They live only in the
 * private database and are only ever shown behind the admin sign-in.
 */

export type SubmissionKind = "nomination" | "volunteer" | "sponsor" | "message";

export type Submission = {
  id: number;
  kind: SubmissionKind;
  fields: Record<string, string>;
  handled: boolean;
  createdAt: string;
};

/** Returns false (rather than throwing) when there is nowhere to store it. */
export async function saveSubmission(
  kind: SubmissionKind,
  fields: Record<string, string>,
): Promise<boolean> {
  const sql = db();
  if (!sql) return false;
  await ensureSchema(sql);
  await sql`insert into submissions (kind, fields) values (${kind}, ${sql.json(fields)})`;
  return true;
}

export async function listSubmissions(limit = 200): Promise<Submission[]> {
  const sql = db();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql<
    { id: string; kind: SubmissionKind; fields: Record<string, string>; handled: boolean; created_at: Date }[]
  >`select id, kind, fields, handled, created_at from submissions
    order by handled asc, id desc limit ${limit}`;
  return rows.map((r) => ({
    id: Number(r.id),
    kind: r.kind,
    fields: r.fields,
    handled: r.handled,
    createdAt: r.created_at.toISOString(),
  }));
}

export async function countUnhandled(): Promise<number> {
  const sql = db();
  if (!sql) return 0;
  await ensureSchema(sql);
  const [row] = await sql<{ n: string }[]>`select count(*) as n from submissions where not handled`;
  return Number(row?.n ?? 0);
}

export async function setHandled(id: number, handled: boolean): Promise<void> {
  const sql = db();
  if (!sql) return;
  await ensureSchema(sql);
  await sql`update submissions set handled = ${handled} where id = ${id}`;
}
