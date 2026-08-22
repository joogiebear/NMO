import type { NmoEvent } from "@/content/events";

/** "Saturday, September 12, 2026" — or a friendly fallback if unannounced. */
export function formatEventDate(date: string): string {
  if (!date) return "Date to be announced";
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "Date to be announced";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Short stacked form for list rows: { month: "SEP", day: "12" } */
export function eventDateParts(date: string): { month: string; day: string } | null {
  if (!date) return null;
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
  };
}

/** Undated events count as upcoming — they are things we do every year. */
export function isUpcoming(event: NmoEvent): boolean {
  if (!event.date) return true;
  const d = new Date(`${event.date}T23:59:59`);
  if (Number.isNaN(d.getTime())) return true;
  return d.getTime() >= Date.now();
}

export function splitEvents(events: NmoEvent[]) {
  const upcoming = events.filter(isUpcoming);
  const past = events
    .filter((e) => !isUpcoming(e))
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

export function usd(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Strips the TODO_ marker so placeholder content still reads cleanly. */
export function clean(value: string): string {
  return value.replace(/^TODO_/, "");
}
