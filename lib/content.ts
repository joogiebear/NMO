import "server-only";
import { unstable_cache, updateTag } from "next/cache";
import { connection } from "next/server";
import { board, type BoardMember } from "@/content/board";
import { events, type NmoEvent } from "@/content/events";
import { recipients, type Recipient } from "@/content/recipients";
import { sponsors, type Sponsor } from "@/content/sponsors";
import { currentCampaign, givingMethods, impact } from "@/content/site";
import { db, ensureSchema } from "@/lib/db";

/**
 * The parts of the site the organization edits for itself, through /admin.
 *
 * Each key is one JSON document in Postgres, shaped exactly like the matching
 * export in content/. Those files are still the source of the *defaults*: a key
 * nobody has saved yet, a missing DATABASE_URL, or a database that is down all
 * fall back to them, so the site never renders empty because of the admin.
 */

export type Campaign = {
  active: boolean;
  year: number;
  recipientName: string;
  headline: string;
  story: string;
  goal: number;
  raised: number;
  photo: string;
};

export type Impact = {
  headline: { value: string; label: string };
  secondary: { value: string; label: string }[];
};

export type GivingMethod = {
  id: string;
  name: string;
  blurb: string;
  detail: string;
  href: string;
  note: string;
};

export type ContentMap = {
  campaign: Campaign;
  impact: Impact;
  events: NmoEvent[];
  recipients: Recipient[];
  sponsors: Sponsor[];
  board: BoardMember[];
  giving: GivingMethod[];
};

export type ContentKey = keyof ContentMap;

export const contentDefaults: ContentMap = {
  campaign: { ...currentCampaign },
  impact: {
    headline: { ...impact.headline },
    secondary: impact.secondary.map((s) => ({ ...s })),
  },
  events,
  recipients,
  sponsors,
  board,
  giving: givingMethods.map((m) => ({ ...m })),
};

export function isContentKey(key: string): key is ContentKey {
  return Object.prototype.hasOwnProperty.call(contentDefaults, key);
}

const tag = (key: ContentKey) => `content:${key}`;

async function readRow(key: ContentKey): Promise<unknown | null> {
  const sql = db();
  if (!sql) return null;
  await ensureSchema(sql);
  const rows = await sql<{ data: unknown }[]>`select data from content where key = ${key}`;
  return rows[0]?.data ?? null;
}

/**
 * Reads one document. Rendering waits for a real request (connection()), so a
 * deploy never bakes the defaults into static HTML; the query itself is cached
 * until the next save calls updateTag().
 */
export async function getContent<K extends ContentKey>(
  key: K,
  { strict = false }: { strict?: boolean } = {},
): Promise<ContentMap[K]> {
  await connection();
  try {
    const cached = unstable_cache(() => readRow(key), ["content", key], { tags: [tag(key)] });
    const data = await cached();
    return (data as ContentMap[K] | null) ?? contentDefaults[key];
  } catch (err) {
    // The public site would rather show defaults than an error page. The admin
    // must not: an editor that silently opened on the defaults would overwrite
    // the real content with them on the next save.
    if (strict) throw err;
    console.error(`[content] falling back to defaults for "${key}":`, err);
    return contentDefaults[key];
  }
}

export type HistoryEntry = { id: number; key: ContentKey; note: string; savedAt: string };

/**
 * Writes a document and records it in the history. The first save of a key
 * also records what was there before — the file default — so "put it back the
 * way it was" is always possible.
 */
export async function saveContent<K extends ContentKey>(
  key: K,
  data: ContentMap[K],
  note: string,
): Promise<void> {
  const sql = db();
  if (!sql) throw new Error("The database is not connected, so changes cannot be saved.");
  await ensureSchema(sql);
  const json = JSON.parse(JSON.stringify(data));
  await sql.begin(async (tx) => {
    const existing = await tx`select 1 from content where key = ${key}`;
    if (existing.length === 0) {
      const original = JSON.parse(JSON.stringify(contentDefaults[key]));
      await tx`insert into content_history (key, data, note) values (${key}, ${tx.json(original)}, 'Original version')`;
    }
    await tx`
      insert into content (key, data) values (${key}, ${tx.json(json)})
      on conflict (key) do update set data = excluded.data, updated_at = now()`;
    await tx`insert into content_history (key, data, note) values (${key}, ${tx.json(json)}, ${note})`;
    // Keep the most recent 60 versions per section.
    await tx`
      delete from content_history where key = ${key} and id not in (
        select id from content_history where key = ${key} order by id desc limit 60
      )`;
  });
  updateTag(tag(key));
}

export async function listHistory(limit = 25): Promise<HistoryEntry[]> {
  const sql = db();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql<{ id: string; key: string; note: string; saved_at: Date }[]>`
    select id, key, note, saved_at from content_history order by id desc limit ${limit}`;
  return rows
    .filter((r) => isContentKey(r.key))
    .map((r) => ({
      id: Number(r.id),
      key: r.key as ContentKey,
      note: r.note,
      savedAt: r.saved_at.toISOString(),
    }));
}

export async function getHistoryVersion(
  id: number,
): Promise<{ key: ContentKey; data: unknown } | null> {
  const sql = db();
  if (!sql) return null;
  await ensureSchema(sql);
  const rows = await sql<{ key: string; data: unknown }[]>`
    select key, data from content_history where id = ${id}`;
  const row = rows[0];
  return row && isContentKey(row.key) ? { key: row.key, data: row.data } : null;
}
