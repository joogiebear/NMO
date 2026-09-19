import "server-only";
import type { FormRecord, SectionKey } from "@/lib/admin-schema";
import type { ContentMap, Impact } from "@/lib/content";

/**
 * Most sections are stored in the same flat shape the form edits. The big
 * numbers are the exception — nested in storage, flat in the form — so they
 * are translated here, on the server, in both directions.
 */

export function toForm<K extends SectionKey>(key: K, data: ContentMap[K]): FormRecord | FormRecord[] {
  if (key === "impact") {
    const impact = data as Impact;
    return {
      headlineValue: impact.headline.value,
      headlineLabel: impact.headline.label,
      stat1Value: impact.secondary[0]?.value ?? "",
      stat1Label: impact.secondary[0]?.label ?? "",
      stat2Value: impact.secondary[1]?.value ?? "",
      stat2Label: impact.secondary[1]?.label ?? "",
    };
  }
  return data as unknown as FormRecord | FormRecord[];
}

export function fromForm<K extends SectionKey>(
  key: K,
  form: FormRecord | FormRecord[],
): ContentMap[K] {
  if (key === "impact") {
    const f = form as FormRecord;
    const impact: Impact = {
      headline: { value: String(f.headlineValue), label: String(f.headlineLabel) },
      secondary: [
        { value: String(f.stat1Value), label: String(f.stat1Label) },
        { value: String(f.stat2Value), label: String(f.stat2Label) },
      ].filter((s) => s.value !== ""),
    };
    return impact as ContentMap[K];
  }
  return form as unknown as ContentMap[K];
}
