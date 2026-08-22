/**
 * Businesses and families who funded the year. Naming them is both a thank you
 * and an invitation — people give when they see their neighbors gave.
 *
 * Leave the array empty and the section hides itself.
 */

export type Sponsor = {
  name: string;
  /** "Champion" | "Supporter" | "Friend", or your own wording. */
  tier?: string;
  url?: string;
  /** Optional logo in /public, e.g. "/sponsors/business.png" */
  logo?: string;
};

export const sponsors: Sponsor[] = [
  // { name: "TODO_Local Business", tier: "Champion", url: "https://example.com" },
];
