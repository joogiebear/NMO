/**
 * The families we've helped, newest first.
 *
 * This page is the proof behind the numbers. A name and two honest sentences
 * beat a photo gallery every time — always with the family's permission.
 */

export type Recipient = {
  year: number;
  /** However the family wants to be named. "The Ruiz Family", "Danny", etc. */
  name: string;
  /** Optional — the diagnosis, if the family is comfortable sharing it. */
  diagnosis?: string;
  /** Two or three sentences. Plain language. */
  story: string;
  /** Optional — what the gift covered. */
  amount?: string;
  /** Optional photo in /public, e.g. "/photos/2024-recipient.jpg" */
  photo?: string;
};

export const recipients: Recipient[] = [
  {
    year: 2019,
    name: "TODO_First recipient",
    story:
      "TODO — our first event, in June 2019, raised more than $8,000 in a single night. Write two or three sentences here about the family it went to.",
    amount: "$8,000+",
  },
  // Add each year above this line, newest first.
  // {
  //   year: 2020,
  //   name: "The Example Family",
  //   diagnosis: "Stage 3 breast cancer",
  //   story: "Two or three sentences.",
  //   amount: "$12,400",
  //   photo: "/photos/2020.jpg",
  // },
];
