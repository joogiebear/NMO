/**
 * What the admin can edit, described as data. The same definitions draw the
 * forms (components/admin/Editor.tsx) and clean what comes back on the server
 * (sanitize below), so a field cannot be editable without also being checked.
 *
 * No server-only imports here — the editor is a client component.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "url"
  | "photo"
  | "toggle"
  | "hidden";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
};

export type SectionKey =
  | "campaign"
  | "impact"
  | "events"
  | "recipients"
  | "sponsors"
  | "board"
  | "giving";

export type SectionDef = {
  key: SectionKey;
  title: string;
  /** One line under the title, in plain words. */
  blurb: string;
  /** Where the change shows up, so people can go and look. */
  appearsOn: { label: string; href: string };
  kind: "object" | "list";
  /** For lists: what one entry is called, and which field names it in the UI. */
  itemLabel?: string;
  itemTitleField?: string;
  fields: Field[];
};

export const sections: SectionDef[] = [
  {
    key: "campaign",
    title: "This year’s family",
    blurb: "Who you’re raising for right now, and how much has come in so far.",
    appearsOn: { label: "Home page", href: "/" },
    kind: "object",
    fields: [
      {
        name: "active",
        label: "Show this section on the home page",
        type: "toggle",
        help: "Turn off between campaigns and the section quietly hides itself.",
      },
      { name: "year", label: "Year", type: "number", required: true },
      {
        name: "recipientName",
        label: "Family or first name",
        type: "text",
        help: "However they’d like to be known — “The Ruiz Family”, “Danny”.",
      },
      {
        name: "headline",
        label: "Headline",
        type: "text",
        placeholder: "This year, we’re raising for the Ruiz family.",
      },
      {
        name: "story",
        label: "Their story",
        type: "textarea",
        help: "Two or three sentences, the way you’d tell a friend.",
      },
      {
        name: "goal",
        label: "Goal ($)",
        type: "number",
        help: "Leave at 0 to hide the progress bar.",
      },
      { name: "raised", label: "Raised so far ($)", type: "number" },
      { name: "photo", label: "Photo", type: "photo" },
    ],
  },
  {
    key: "impact",
    title: "The big numbers",
    blurb: "The totals at the top of the home page. Update these after every gift.",
    appearsOn: { label: "Home page", href: "/" },
    kind: "object",
    fields: [
      {
        name: "headlineValue",
        label: "Total given away",
        type: "text",
        placeholder: "$95,000+",
        required: true,
      },
      { name: "headlineLabel", label: "Its caption", type: "text", placeholder: "Given away since 2019" },
      { name: "stat1Value", label: "Second number", type: "text", placeholder: "21" },
      { name: "stat1Label", label: "Its caption", type: "text", placeholder: "Families" },
      { name: "stat2Value", label: "Third number", type: "text", placeholder: "1" },
      { name: "stat2Label", label: "Its caption", type: "text", placeholder: "Family each year" },
    ],
  },
  {
    key: "events",
    title: "Events",
    blurb: "Anything with a future date shows as “Coming up”. Past dates move down by themselves.",
    appearsOn: { label: "Events page", href: "/events" },
    kind: "list",
    itemLabel: "event",
    itemTitleField: "name",
    fields: [
      { name: "slug", label: "", type: "hidden" },
      { name: "name", label: "Event name", type: "text", required: true },
      { name: "date", label: "Date", type: "date", help: "Leave empty for “date to be announced”." },
      { name: "time", label: "Time", type: "text", placeholder: "1:00 – 8:00 PM" },
      { name: "venue", label: "Where", type: "text", placeholder: "Shinnick’s Pub" },
      { name: "address", label: "Address", type: "text" },
      { name: "tagline", label: "Short tagline", type: "text", placeholder: "Our biggest day of the year" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "ticketUrl", label: "Ticket or RSVP link", type: "url", placeholder: "https://…" },
      { name: "photo", label: "Photo", type: "photo" },
    ],
  },
  {
    key: "recipients",
    title: "Families we’ve helped",
    blurb: "One entry per family. Always with their permission.",
    appearsOn: { label: "Families page", href: "/recipients" },
    kind: "list",
    itemLabel: "family",
    itemTitleField: "name",
    fields: [
      { name: "year", label: "Year", type: "number", required: true },
      { name: "name", label: "Family or first name", type: "text", required: true },
      { name: "diagnosis", label: "Diagnosis (only if they’re comfortable sharing)", type: "text" },
      { name: "story", label: "Their story", type: "textarea", help: "Two or three sentences." },
      { name: "amount", label: "Amount given", type: "text", placeholder: "$12,400" },
      { name: "photo", label: "Photo", type: "photo" },
    ],
  },
  {
    key: "sponsors",
    title: "Sponsors",
    blurb: "Businesses and families to thank by name. Empty list hides the section.",
    appearsOn: { label: "Home page", href: "/" },
    kind: "list",
    itemLabel: "sponsor",
    itemTitleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "tier", label: "Level", type: "text", placeholder: "Champion, Supporter or Friend" },
      { name: "url", label: "Website", type: "url", placeholder: "https://…" },
      { name: "logo", label: "Logo", type: "photo" },
    ],
  },
  {
    key: "board",
    title: "Board members",
    blurb: "The people behind NMO. Faces build more trust than any mission statement.",
    appearsOn: { label: "Our Story page", href: "/story" },
    kind: "list",
    itemLabel: "board member",
    itemTitleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", placeholder: "President" },
      { name: "bio", label: "One sentence about them", type: "text" },
      { name: "photo", label: "Photo", type: "photo" },
    ],
  },
  {
    key: "giving",
    title: "Ways to give",
    blurb: "Your Venmo handle, Zelle email and check instructions.",
    appearsOn: { label: "Ways to Give page", href: "/give" },
    kind: "list",
    itemLabel: "way to give",
    itemTitleField: "name",
    fields: [
      { name: "id", label: "", type: "hidden" },
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Venmo" },
      { name: "blurb", label: "One line about it", type: "text" },
      { name: "detail", label: "Handle, email or instructions", type: "text", placeholder: "@NMO-Chicago" },
      { name: "href", label: "Link (optional)", type: "url", placeholder: "https://venmo.com/u/…" },
      { name: "note", label: "Small print", type: "text" },
    ],
  },
];

export function getSection(key: string): SectionDef | undefined {
  return sections.find((s) => s.key === key);
}

/* ---------------------------------------------------------------- cleaning */

export type FormRecord = Record<string, string | number | boolean>;

const MAX_TEXT = 4000;
const MAX_ITEMS = 200;
// Uploaded media, or a file someone committed under public/.
const PHOTO_PATH = /^\/(media\/[0-9a-f-]{36}|(photos|sponsors)\/[\w\-./]+)$/i;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function cleanField(field: Field, raw: unknown): string | number | boolean {
  switch (field.type) {
    case "toggle":
      return raw === true || raw === "true";
    case "number": {
      const n = Number(raw);
      return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
    }
    case "date": {
      const s = String(raw ?? "").trim();
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
    }
    case "url": {
      const s = String(raw ?? "").trim();
      return /^(https?:\/\/|mailto:)/i.test(s) ? s.slice(0, 500) : "";
    }
    case "photo": {
      const s = String(raw ?? "").trim();
      return PHOTO_PATH.test(s) ? s : "";
    }
    default:
      return String(raw ?? "").trim().slice(0, MAX_TEXT);
  }
}

function cleanRecord(def: SectionDef, raw: unknown): FormRecord {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: FormRecord = {};
  for (const field of def.fields) out[field.name] = cleanField(field, source[field.name]);
  // Hidden identifiers are filled in rather than typed.
  if ("slug" in out && !out.slug) out.slug = slugify(String(out.name ?? "")) || "event";
  if ("id" in out && !out.id) out.id = slugify(String(out.name ?? "")) || "method";
  return out;
}

/**
 * Turns whatever the browser sent into exactly the fields this section
 * defines, each coerced to its type. Returns an error message for a missing
 * required field instead of saving something half-filled.
 */
export function sanitize(
  def: SectionDef,
  raw: unknown,
): { ok: true; value: FormRecord | FormRecord[] } | { ok: false; error: string } {
  const records =
    def.kind === "list"
      ? (Array.isArray(raw) ? raw : []).slice(0, MAX_ITEMS).map((r) => cleanRecord(def, r))
      : [cleanRecord(def, raw)];

  for (const record of records) {
    for (const field of def.fields) {
      if (field.required && (record[field.name] === "" || record[field.name] === 0)) {
        return { ok: false, error: `“${field.label}” can’t be empty.` };
      }
    }
  }
  return { ok: true, value: def.kind === "list" ? records : records[0] };
}
