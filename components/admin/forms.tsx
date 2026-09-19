"use client";

import { useActionState } from "react";
import { login, setRaised } from "@/app/admin/actions";

const input =
  "w-full rounded-xl border border-line-strong bg-ground-2 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-orchid focus:outline-none transition-colors";
const goldButton =
  "rounded-full bg-gold-bright px-7 py-3 font-semibold text-plum-deep hover:bg-[#FFD68A] transition-colors disabled:opacity-50";

export function LoginForm() {
  const [result, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[14px] font-semibold text-ink">Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={input}
        />
      </label>
      {result && !result.ok ? (
        <p role="alert" className="text-[15px] text-gold">
          {result.message}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={`${goldButton} self-start`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

/** The event-night shortcut on the dashboard: one number, one button. */
export function RaisedForm({ raised }: { raised: number }) {
  const [result, action, pending] = useActionState(setRaised, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-3xl text-gold-bright">$</span>
        <input
          name="raised"
          inputMode="numeric"
          defaultValue={raised || ""}
          placeholder="12400"
          aria-label="Total raised so far, in dollars"
          className={`${input} max-w-[12rem] text-xl tabular`}
        />
        <button type="submit" disabled={pending} className={goldButton}>
          {pending ? "Updating…" : "Update total"}
        </button>
      </div>
      {result ? (
        <p role="status" className={`text-[15px] ${result.ok ? "text-orchid" : "text-gold"}`}>
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
