import Link from "next/link";
import { logout, restoreVersion } from "@/app/admin/actions";
import { RaisedForm } from "@/components/admin/forms";
import { getSection, sections } from "@/lib/admin-schema";
import { requireAdmin } from "@/lib/auth";
import { getContent, listHistory } from "@/lib/content";
import { countUnhandled } from "@/lib/inbox";
import { usd } from "@/lib/format";

const when = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Chicago",
});

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ restored?: string }>;
}) {
  await requireAdmin();
  const [{ restored }, campaign, history, waiting] = await Promise.all([
    searchParams,
    getContent("campaign", { strict: true }),
    listHistory(),
    countUnhandled(),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">Site admin</p>
          <h1 className="text-4xl sm:text-5xl">What would you like to update?</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="text-[15px] text-muted underline hover:text-ink">
            Sign out
          </button>
        </form>
      </header>

      {restored ? (
        <p role="status" className="rounded-xl border border-orchid/40 bg-plum-tint px-5 py-4 text-orchid">
          Restored. The earlier version is live on the site again.
        </p>
      ) : null}

      <section className="rounded-3xl border border-gold/30 bg-gold-tint/60 px-6 py-7 sm:px-8 flex flex-col gap-4">
        <h2 className="text-2xl sm:text-3xl">Update the total raised</h2>
        <p className="text-ink-soft">
          For {campaign.recipientName.replace(/^TODO_/, "") || "this year’s family"}.
          {campaign.goal > 0
            ? ` The goal is ${usd(campaign.goal)}.`
            : " Set a goal under “This year’s family” to show the progress bar."}
        </p>
        <RaisedForm raised={campaign.raised} />
      </section>

      <Link
        href="/admin/inbox"
        className="group flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-orchid/30 bg-plum-tint/60 px-6 py-6 sm:px-8 no-underline transition-colors hover:border-orchid"
      >
        <span className="flex flex-col gap-1">
          <span className="font-display text-2xl sm:text-3xl text-ink">Messages &amp; nominations</span>
          <span className="text-ink-soft">
            Everything people send through the website lands here.
          </span>
        </span>
        <span
          className={`rounded-full px-4 py-1.5 font-mono text-[13px] ${
            waiting > 0 ? "bg-orchid text-plum-deep font-semibold" : "border border-line-strong text-muted"
          }`}
        >
          {waiting > 0 ? `${waiting} new` : "Nothing new"}
        </span>
      </Link>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl sm:text-3xl">Everything else</h2>
        <ul className="list-none p-0 m-0 grid gap-3 sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.key}>
              <Link
                href={`/admin/${s.key}`}
                className="group flex h-full flex-col gap-1.5 rounded-2xl border border-line bg-card/80 px-5 py-5 no-underline transition-colors hover:border-orchid"
              >
                <span className="font-display text-xl text-ink group-hover:text-orchid transition-colors">
                  {s.title}
                </span>
                <span className="text-[15px] text-muted leading-snug">{s.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl sm:text-3xl">Recent changes</h2>
        <p className="text-muted text-[15px]">
          Made a mistake? Put any section back the way it was.
        </p>
        {history.length === 0 ? (
          <p className="text-muted">No changes yet.</p>
        ) : (
          <ul className="list-none p-0 m-0 flex flex-col">
            {history.map((h, i) => (
              <li
                key={h.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line py-3.5"
              >
                <span className="flex flex-col">
                  <span className="text-ink">{h.note || getSection(h.key)?.title}</span>
                  <span className="font-mono text-[12px] text-muted">
                    {when.format(new Date(h.savedAt))}
                  </span>
                </span>
                {i === 0 ? (
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                    Current
                  </span>
                ) : (
                  <form action={restoreVersion}>
                    <input type="hidden" name="id" value={h.id} />
                    <button
                      type="submit"
                      className="text-[15px] text-orchid underline hover:text-gold-bright"
                    >
                      Restore this version
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
