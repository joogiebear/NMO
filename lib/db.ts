import "server-only";
import postgres from "postgres";

/**
 * One shared Postgres client. Returns null when DATABASE_URL is not set, which
 * is the normal state for local development and for `next build` — everything
 * that reads content falls back to the files in content/ in that case.
 */

type Sql = ReturnType<typeof postgres>;
const globalForDb = globalThis as unknown as { nmoSql?: Sql; nmoSchema?: Promise<void> };

export function db(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  globalForDb.nmoSql ??= postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 5,
    onnotice: () => {},
  });
  return globalForDb.nmoSql;
}

/** Creates the tables on first use, so there is no separate migration step. */
export function ensureSchema(sql: Sql): Promise<void> {
  globalForDb.nmoSchema ??= (async () => {
    await sql`
      create table if not exists content (
        key        text primary key,
        data       jsonb not null,
        updated_at timestamptz not null default now()
      )`;
    await sql`
      create table if not exists content_history (
        id       bigserial primary key,
        key      text not null,
        data     jsonb not null,
        note     text not null default '',
        saved_at timestamptz not null default now()
      )`;
    await sql`create index if not exists content_history_key on content_history (key, id desc)`;
    await sql`
      create table if not exists media (
        id         uuid primary key default gen_random_uuid(),
        mime       text not null,
        bytes      bytea not null,
        created_at timestamptz not null default now()
      )`;
  })().catch((err) => {
    globalForDb.nmoSchema = undefined;
    throw err;
  });
  return globalForDb.nmoSchema;
}
