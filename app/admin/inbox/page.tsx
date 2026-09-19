import Link from "next/link";
import { markSubmission } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { listSubmissions, type SubmissionKind } from "@/lib/inbox";

const KIND: Record<SubmissionKind, string> = {
  nomination: "Family nomination",
  volunteer: "Volunteer sign-up",
  sponsor: "Sponsorship inquiry",
  message: "Message",
};

const when = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Chicago",
});

const label = (key: string) =>
  key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default async function AdminInboxPage() {
  await requireAdmin();
  const submissions = await listSubmissions();
  const waiting = submissions.filter((s) => !s.handled).length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Link
          href="/admin"
          className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted no-underline hover:text-orchid"
        >
          ← All sections
        </Link>
        <h1 className="text-4xl sm:text-5xl">Messages &amp; nominations</h1>
        <p className="text-lg text-ink-soft">
          {submissions.length === 0
            ? "Nothing has come in yet. When someone fills in a form on the site, it shows up here."
            : waiting > 0
              ? `${waiting} waiting for someone to pick up. Newest first.`
              : "All caught up."}
        </p>
      </header>

      <ul className="list-none p-0 m-0 flex flex-col gap-4">
        {submissions.map((s) => {
          const email = s.fields.email;
          const name = s.fields.your_name || s.fields.name || s.fields.business_name;
          return (
            <li
              key={s.id}
              className={`rounded-2xl border px-5 py-5 sm:px-7 sm:py-6 flex flex-col gap-4 ${
                s.handled ? "border-line bg-card/40 opacity-70" : "border-orchid/40 bg-card/80"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                    {KIND[s.kind] ?? s.kind}
                  </span>
                  {name ? <span className="font-display text-xl">{name}</span> : null}
                </span>
                <span className="font-mono text-[12px] text-muted">
                  {when.format(new Date(s.createdAt))}
                </span>
              </div>

              <dl className="m-0 grid gap-x-6 gap-y-3 sm:grid-cols-[180px_1fr]">
                {Object.entries(s.fields)
                  .filter(([, value]) => value.trim() !== "")
                  .map(([key, value]) => (
                    <div key={key} className="contents">
                      <dt className="text-[14px] font-semibold text-muted">{label(key)}</dt>
                      <dd className="m-0 text-ink-soft whitespace-pre-wrap break-words">{value}</dd>
                    </div>
                  ))}
              </dl>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="rounded-full bg-plum px-5 py-2 text-[15px] font-semibold text-paper no-underline hover:bg-[#8345C4] transition-colors"
                  >
                    Reply by email
                  </a>
                ) : null}
                <form action={markSubmission}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="handled" value={String(!s.handled)} />
                  <button type="submit" className="text-[15px] text-orchid underline hover:text-gold-bright">
                    {s.handled ? "Mark as not done" : "Mark as done"}
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
