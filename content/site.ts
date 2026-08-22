/**
 * Site-wide facts and contact details.
 *
 * Everything a non-developer needs to change lives in this `content/` folder.
 * Edit the values below, save, and the site updates everywhere they appear.
 *
 * Values written as TODO_* are placeholders — replace them before launch.
 * See README.md → "Launch checklist".
 */

export const site = {
  name: "Nina Mastro Organization",
  shortName: "NMO",
  tagline: "One family at a time.",
  /** One sentence, used for search results and social shares. */
  description:
    "A Chicago 501(c)(3) started by Nina Mastro's friends. Every dollar we raise goes directly to a family carrying the financial weight of cancer.",
  city: "Chicago, IL",
  founded: 2019,
  ein: "84-2055686",

  contact: {
    email: "TODO_info@ninam.org",
    /** Optional. Leave as an empty string to hide it. */
    phone: "",
    mailingAddress: [
      "Nina Mastro Organization",
      "TODO_Street Address",
      "Chicago, IL TODO_ZIP",
    ],
  },

  /**
   * The merch shop lives on whatever platform you already sell through — this
   * site links out to it rather than replacing it.
   *
   * Paste the store URL below and a Shop link appears in the header, the footer
   * and on the Ways to Give page. Leave it empty and all of that stays hidden.
   */
  store: {
    url: "", // e.g. "https://ninam-shop.myshopify.com" or your Bonfire / Square page
    label: "Shop",
    headline: "T-shirts, hoodies and the rest.",
    blurb:
      "Wear it to the Block Party — every order puts money toward this year's family.",
  },

  social: {
    facebook: "https://www.facebook.com/thenmorg/",
    instagram: "", // e.g. "https://www.instagram.com/thenmorg/"
  },
} as const;

/**
 * The headline numbers. These do the most persuading on the whole site,
 * so keep them current — update after every event and every gift.
 *
 * Only claim what the board can stand behind. If every dollar raised really
 * does reach the family, say so here ("100%" / "Of proceeds go to the family")
 * — it is the single most convincing thing a small charity can put on a page.
 */
export const impact = [
  { value: "$95,000+", label: "Donated since 2019" },
  { value: "21", label: "Families supported" },
  { value: "1", label: "Recipient family chosen each year" },
  { value: "501(c)(3)", label: "Every gift is tax-deductible" },
] as const;

/**
 * The family we are currently raising for.
 *
 * Set `active: false` between campaigns and the site quietly hides this
 * section instead of showing an empty one.
 */
export const currentCampaign = {
  active: true,
  year: new Date().getFullYear(),
  /** First name or family name, however the recipient prefers to be known. */
  recipientName: "TODO_[family name]",
  headline: "This year, we're raising for [family name].",
  story:
    "TODO — two or three sentences in plain language: who they are, what they're facing, and what this money will take off their plate. Written the way you would tell a friend at the bar, not the way a grant application reads.",
  /** Set `goal` to 0 to hide the progress bar. */
  goal: 0,
  raised: 0,
  photo: "", // e.g. "/photos/2026-family.jpg"
} as const;

/** How people can actually send money. Order matters — easiest first. */
export const givingMethods = [
  {
    id: "venmo",
    name: "Venmo",
    blurb: "The fastest way to give. About fifteen seconds from your phone.",
    detail: "TODO_@NMO-Venmo-Handle",
    href: "", // e.g. "https://venmo.com/u/NMO-Handle"
    note: "Add a note if you'd like it counted toward a specific event.",
  },
  {
    id: "zelle",
    name: "Zelle / Bank Quick Pay",
    blurb: "No processing fees, so the full amount reaches the family.",
    detail: "TODO_donate@ninam.org",
    href: "",
    note: "Send from your bank's app using the email above.",
  },
  {
    id: "check",
    name: "Check by mail",
    blurb: "Made out to the Nina Mastro Organization.",
    detail: "See mailing address below",
    href: "",
    note: "We mail a receipt back for your records.",
  },
] as const;

/** Suggested gift amounts. Keep them low enough that anyone can join in. */
export const giftAmounts = [25, 50, 100, 250] as const;

/**
 * Business sponsorship levels for the Block Party and other events.
 * Local businesses fund a real share of the year — make it easy to say yes.
 */
export const sponsorTiers = [
  {
    name: "Friend",
    amount: "$100",
    perks: ["Named on the sponsor board at the event", "Thanked on social media"],
  },
  {
    name: "Supporter",
    amount: "$250",
    perks: [
      "Everything in Friend",
      "Your logo on the event flyer",
      "Listed on this website for the year",
    ],
  },
  {
    name: "Champion",
    amount: "$500+",
    perks: [
      "Everything in Supporter",
      "Banner at the Block Party",
      "Named from the stage between sets",
    ],
  },
] as const;

/** Ways to help that cost nothing but time. */
export const volunteerRoles = [
  "Set up and tear down at the Block Party",
  "Run the raffle table",
  "Donate or put together a raffle basket",
  "Sell tickets to your block, your office, your team",
  "Walk with us at PurpleStride",
  "Photography at events",
] as const;
