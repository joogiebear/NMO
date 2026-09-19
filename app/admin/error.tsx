"use client";

/**
 * Shown when the admin cannot read the real content (the database is briefly
 * unreachable). It deliberately offers no form: see getContent's strict mode.
 */
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col gap-5 max-w-md">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">Site admin</p>
      <h1 className="text-4xl">We couldn&apos;t load that just now.</h1>
      <p className="text-ink-soft leading-relaxed">
        Nothing has been changed or lost. Give it a moment and try again — and if it keeps
        happening, let whoever looks after the site know.
      </p>
      <button
        type="button"
        onClick={reset}
        className="self-start rounded-full bg-gold-bright px-7 py-3 font-semibold text-plum-deep hover:bg-[#FFD68A] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
