/**
 * Events, newest first. Anything with a date in the future automatically
 * shows up under "Coming up"; everything else moves to "Past events".
 *
 * Dates are ISO format: "2026-09-12". Leave `date` empty for
 * "date to be announced" — the site handles it gracefully.
 */

export type NmoEvent = {
  slug: string;
  name: string;
  /** ISO date "YYYY-MM-DD", or "" if not announced yet. */
  date: string;
  /** Optional, e.g. "1:00 – 8:00 PM" */
  time?: string;
  venue: string;
  address?: string;
  description: string;
  /** Optional line shown on the featured poster, e.g. "Our biggest day of the year". */
  tagline?: string;
  /** Optional ticket or RSVP link. */
  ticketUrl?: string;
  photo?: string;
};

export const events: NmoEvent[] = [
  {
    slug: "block-party",
    name: "The Annual Block Party",
    tagline: "Our biggest day of the year",
    date: "",
    venue: "Shinnick's Pub",
    address: "[street address], Chicago, IL",
    description:
      "Live bands, raffle baskets stacked to the ceiling, and the whole neighborhood on one block. Bring your family, bring cash for the raffle, stay for the last set.",
  },
  {
    slug: "purplestride",
    name: "PurpleStride Chicago",
    date: "",
    venue: "Chicago",
    description:
      "Team NMO walks every year for pancreatic cancer research, in Nina's name. Anyone can join the team — walk with us, or sponsor someone who is.",
  },
  {
    slug: "bunco-night",
    name: "Bunco Night",
    date: "",
    venue: "[venue]",
    description:
      "Dice, prizes, and a room full of people who knew her. An easy first event if you've never been to one of ours.",
  },
  {
    slug: "parade",
    name: "Neighborhood Parade",
    date: "",
    venue: "Chicago",
    description:
      "We walk the route together every year. Bring the kids, bring the dog, wear purple.",
  },
];
