import { site } from "./site";

/**
 * The common questions at the bottom of the Ways to Give page. These are the
 * starting answers; once someone edits them in /admin, those versions win.
 */

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Is my donation tax-deductible?",
    a: `Yes. We're a registered 501(c)(3) non-profit, EIN ${site.ein}. Ask us for a receipt any time and we'll send one — for a check, we mail it back automatically.`,
  },
  {
    q: "Can I give in someone's memory, or in their honor?",
    a: "Please do. Put the name in the note when you send it, or email us, and we'll make sure it's recognized properly.",
  },
  {
    q: "Does my employer match gifts?",
    a: "Many do, and it's the easiest way to double what you give. Send your company's matching form to us and we'll fill in our side.",
  },
  {
    q: "I can't give money right now.",
    a: "That's completely fine, and there's still a lot you can do. Come to an event, put together a raffle basket, nominate a family, buy something from the shop, or just share us with people who might give.",
  },
];

/** The words at the top of the home page. */
export const hero = {
  line1: "Cancer takes enough.",
  line2: "It shouldn’t take the rent, too.",
  intro:
    "We're a group of lifelong Chicago friends who lost Nina to pancreatic cancer. Every year we throw a party and hand everything we raise to one family.",
};
