"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./ui";

const inputClasses =
  "w-full rounded-xl border-2 border-line bg-card px-4 py-3 text-ink placeholder:text-muted/70 focus:border-plum focus:outline-none transition-colors";

export function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  hint,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-gold" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="text-muted font-normal"> (optional)</span>
        )}
      </span>
      {hint ? <span className="text-[13.5px] text-muted leading-snug">{hint}</span> : null}
      <input
        className={inputClasses}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  required = false,
  rows = 5,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-gold" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="text-muted font-normal"> (optional)</span>
        )}
      </span>
      {hint ? <span className="text-[13.5px] text-muted leading-snug">{hint}</span> : null}
      <textarea
        className={`${inputClasses} resize-y`}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
}

export function CheckboxGroup({
  legend,
  name,
  options,
}: {
  legend: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <fieldset className="flex flex-col gap-2.5 border-0 p-0 m-0">
      <legend className="text-[14px] font-semibold text-ink mb-1">{legend}</legend>
      {options.map((option) => (
        <label key={option} className="flex items-start gap-3 text-[15.5px] text-ink-soft">
          <input
            type="checkbox"
            name={name}
            value={option}
            className="mt-1.5 w-4 h-4 accent-orchid"
          />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function SubmitForm({
  kind,
  children,
  submitLabel,
  successMessage,
  fallbackEmail,
}: {
  kind: string;
  children: ReactNode;
  submitLabel: string;
  successMessage: string;
  fallbackEmail: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload: Record<string, string | string[]> = { kind };
    for (const [key, value] of data.entries()) {
      if (typeof value !== "string") continue;
      const existing = payload[key];
      if (existing === undefined) payload[key] = value;
      else if (Array.isArray(existing)) existing.push(value);
      else payload[key] = [existing as string, value];
    }

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setState("done");
        form.reset();
      } else {
        setState("error");
        setMessage(body.error ?? "Something went wrong on our end.");
      }
    } catch {
      setState("error");
      setMessage("We couldn't reach the server.");
    }
  }

  if (state === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border-2 border-plum bg-plum-tint p-6 flex flex-col gap-2"
      >
        <h3 className="text-xl text-orchid">Got it — thank you.</h3>
        <p className="text-ink-soft leading-relaxed">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      {children}

      {/* Spam trap — real people never fill this in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Leave this blank
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" variant="primary" size="lg" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : submitLabel}
        </Button>
        <p className="text-[14px] text-muted">
          Or email us at{" "}
          <a href={`mailto:${fallbackEmail}`} className="text-orchid font-medium">
            {fallbackEmail}
          </a>
        </p>
      </div>

      {state === "error" ? (
        <p role="alert" className="text-[15px] text-orchid bg-plum-tint rounded-xl px-4 py-3">
          {message} Please email us at{" "}
          <a href={`mailto:${fallbackEmail}`} className="font-semibold underline">
            {fallbackEmail}
          </a>{" "}
          and we&apos;ll pick it up from there.
        </p>
      ) : null}
    </form>
  );
}
