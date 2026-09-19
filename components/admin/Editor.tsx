"use client";

import { useState, useTransition } from "react";
import { saveSection, type ActionResult } from "@/app/admin/actions";
import {
  getSection,
  type Field,
  type FormRecord,
  type FormValue,
  type SectionKey,
} from "@/lib/admin-schema";

const input =
  "w-full rounded-xl border border-line-strong bg-ground-2 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-orchid focus:outline-none transition-colors";

/* ------------------------------------------------------------------ photos */

const MAX_EDGE = 1800;

/** Shrinks a phone photo in the browser so uploads are quick on event-night wifi. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  // Logos are often transparent PNGs; photos compress far better as JPEG.
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), type, 0.86),
  );
}

function PhotoField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await shrink(file);
      const body = new FormData();
      body.append("file", new File([blob], "photo", { type: blob.type }));
      const res = await fetch("/admin/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed.");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-24 h-24 rounded-xl object-cover border border-line-strong" />
      ) : (
        <div className="w-24 h-24 rounded-xl photo-slot border border-dashed border-line-strong" />
      )}
      <div className="flex flex-col gap-2">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-line-strong px-5 py-2 text-[15px] font-semibold text-ink hover:border-orchid hover:text-orchid transition-colors">
          {busy ? "Uploading…" : value ? "Choose a different photo" : "Choose a photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={busy}
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="self-start text-[14px] text-muted underline hover:text-ink"
          >
            Remove photo
          </button>
        ) : null}
        {error ? <p className="text-[14px] text-gold">{error}</p> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ fields */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: FormValue;
  onChange: (v: FormValue) => void;
}) {
  if (field.type === "hidden") return null;

  if (field.type === "lines") {
    const lines = Array.isArray(value) ? value : [];
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-[14px] font-semibold text-ink">{field.label}</span>
        <textarea
          rows={Math.max(4, lines.length + 1)}
          className={`${input} resize-y`}
          value={lines.join("\n")}
          placeholder={field.placeholder}
          // Kept as typed until it is saved; the server trims and drops blank lines.
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
        {field.help ? <span className="text-[14px] text-muted">{field.help}</span> : null}
      </label>
    );
  }

  if (field.type === "toggle") {
    return (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-5 h-5 accent-orchid"
        />
        <span className="flex flex-col">
          <span className="font-semibold text-ink">{field.label}</span>
          {field.help ? <span className="text-[14px] text-muted">{field.help}</span> : null}
        </span>
      </label>
    );
  }

  // The photo picker carries its own <label> for the file input, and labels
  // must not nest — inside one, "Remove photo" would reopen the file dialog.
  if (field.type === "photo") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[14px] font-semibold text-ink">{field.label}</span>
        <PhotoField value={String(value ?? "")} onChange={onChange} />
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-ink">
        {field.label}
        {field.required ? <span className="text-gold"> *</span> : null}
      </span>
      {field.type === "textarea" ? (
        <textarea
          rows={4}
          className={`${input} resize-y`}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={input}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
          inputMode={field.type === "number" ? "numeric" : undefined}
          min={field.type === "number" ? 0 : undefined}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(field.type === "number" ? Number(e.target.value) : e.target.value)
          }
        />
      )}
      {field.help ? <span className="text-[14px] text-muted">{field.help}</span> : null}
    </label>
  );
}

function RecordFields({
  fields,
  record,
  onChange,
}: {
  fields: Field[];
  record: FormRecord;
  onChange: (next: FormRecord) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={record[field.name]}
          onChange={(v) => onChange({ ...record, [field.name]: v })}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

function blank(fields: Field[]): FormRecord {
  const record: FormRecord = {};
  for (const f of fields) {
    record[f.name] =
      f.type === "toggle" ? false : f.type === "number" ? 0 : f.type === "lines" ? [] : "";
  }
  if ("year" in record) record.year = new Date().getFullYear();
  return record;
}

export function Editor({
  sectionKey,
  initial,
}: {
  sectionKey: SectionKey;
  initial: FormRecord | FormRecord[];
}) {
  const def = getSection(sectionKey)!;
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function update(next: FormRecord | FormRecord[]) {
    setValue(next);
    setDirty(true);
    setResult(null);
  }

  function save() {
    startTransition(async () => {
      const res = await saveSection(sectionKey, value);
      setResult(res);
      if (res.ok) setDirty(false);
    });
  }

  const list = Array.isArray(value) ? value : null;

  function move(from: number, to: number) {
    if (!list || to < 0 || to >= list.length) return;
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    update(next);
    setOpen(to);
  }

  return (
    <div className="flex flex-col gap-6 pb-28">
      {list ? (
        <>
          <button
            type="button"
            onClick={() => {
              update([blank(def.fields), ...list]);
              setOpen(0);
            }}
            className="self-start rounded-full bg-plum px-6 py-3 font-semibold text-paper hover:bg-[#8345C4] transition-colors"
          >
            + Add {def.itemLabel}
          </button>

          {list.length === 0 ? (
            <p className="text-muted">Nothing here yet.</p>
          ) : (
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {list.map((record, i) => {
                const title = String(record[def.itemTitleField ?? "name"] || `New ${def.itemLabel}`);
                const isOpen = open === i;
                return (
                  <li key={i} className="rounded-2xl border border-line bg-card/80 overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="flex items-baseline gap-3 min-w-0">
                        {"year" in record ? (
                          <span className="font-mono text-[13px] text-gold tabular">{String(record.year)}</span>
                        ) : null}
                        <span className="font-display text-xl truncate">{title}</span>
                      </span>
                      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-orchid shrink-0">
                        {isOpen ? "Close" : "Edit"}
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="flex flex-col gap-6 border-t border-line px-5 py-6">
                        <RecordFields
                          fields={def.fields}
                          record={record}
                          onChange={(next) => update(list.map((r, j) => (j === i ? next : r)))}
                        />
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                          <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="underline text-muted hover:text-ink disabled:opacity-40 disabled:no-underline">
                            Move up
                          </button>
                          <button type="button" onClick={() => move(i, i + 1)} disabled={i === list.length - 1} className="underline text-muted hover:text-ink disabled:opacity-40 disabled:no-underline">
                            Move down
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Remove “${title}”? You can undo this from the history.`)) {
                                update(list.filter((_, j) => j !== i));
                                setOpen(null);
                              }
                            }}
                            className="underline text-gold hover:text-gold-bright ml-auto"
                          >
                            Remove this {def.itemLabel}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-card/80 px-5 py-6 sm:px-7">
          <RecordFields fields={def.fields} record={value as FormRecord} onChange={update} />
        </div>
      )}

      {/* Save bar — always reachable with a thumb. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/90 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto w-[92%] py-3.5 flex items-center justify-between gap-4">
          <p
            role="status"
            className={`text-[15px] ${result ? (result.ok ? "text-orchid" : "text-gold") : "text-muted"}`}
          >
            {result?.message ?? (dirty ? "You have unsaved changes." : "Everything is saved.")}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="shrink-0 rounded-full bg-gold-bright px-7 py-3 font-semibold text-plum-deep hover:bg-[#FFD68A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
