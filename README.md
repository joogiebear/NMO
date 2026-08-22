# Nina Mastro Organization — website

A rebuild of [ninam.org](https://www.ninam.org/) off Squarespace and onto a
self-hosted Next.js site, designed to make giving and helping as easy and as
welcoming as possible.

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4, tokens defined once in `app/globals.css`
- **Hosting:** built for Vercel's free tier (nonprofits pay nothing at this scale)
- **Content:** plain files in `content/` — no CMS, no logins, no monthly fee

There is also a standalone design concept at `concepts/homepage-concept.html`
(the original pitch page). Open it in a browser; it is not part of the app.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript, no emit
```

> **Note:** fonts are loaded from Google Fonts with a `<link>` in
> `app/layout.tsx` rather than through `next/font`, so the site builds in
> environments without outbound access to fonts.googleapis.com. If you would
> rather self-host them (slightly faster, no third-party request), drop the
> `.woff2` files into `public/fonts` and switch to `next/font/local`.

---

## Editing the site without touching code

Everything a non-developer needs is in `content/`. Each file is commented.

| File | What it controls |
| --- | --- |
| `content/site.ts` | Org name, contact details, EIN, the four impact numbers, this year's family, giving methods, sponsor tiers, volunteer roles |
| `content/recipients.ts` | The families helped each year — the `/recipients` page |
| `content/events.ts` | Events. Anything with a future date (or no date) shows under "Coming up"; past dates move to "Past events" automatically |
| `content/board.ts` | Board members. Leave the list empty and the section hides itself |
| `content/sponsors.ts` | Sponsor thank-yous. Empty list hides the section |

Photos go in `public/` (for example `public/photos/2025-family.jpg`) and are
referenced as `/photos/2025-family.jpg`. Anywhere a photo hasn't been added
yet, the site draws a labeled placeholder rather than a broken image.

Edits can be made through GitHub's web editor — no local setup — and Vercel
redeploys automatically on every commit to `main`.

---

## Launch checklist

Search the repo for `TODO_` to find every placeholder. As of this commit:

- [ ] `content/site.ts` — real contact email, mailing address, Venmo handle, Zelle email
- [ ] `content/site.ts` — confirm the impact numbers, and decide whether the board
      can stand behind a "100% of proceeds go to the family" claim (it is the
      single most persuasive line a small charity can put on a page)
- [ ] `content/site.ts` — fill in `currentCampaign` with this year's family, or set
      `active: false` between campaigns
- [ ] `content/recipients.ts` — add each year's family, with permission
- [ ] `content/events.ts` — real dates, addresses and ticket links
- [ ] `content/board.ts` — names, roles and photos
- [ ] Add photos to `public/` — Nina, the Block Party, a check handover
- [ ] Set the form delivery env vars (below) so nominations reach a human
- [ ] Point the `ninam.org` DNS at Vercel and let the Squarespace plan lapse

---

## Forms

Nominations, volunteer sign-ups, sponsorship inquiries and contact messages all
post to `app/api/form/route.ts`, which forwards them wherever you point it:

| Env var | Effect |
| --- | --- |
| `RESEND_API_KEY` + `FORMS_TO_EMAIL` | Emails each submission (Resend's free tier covers this many times over) |
| `FORMS_WEBHOOK_URL` | Posts JSON to any webhook — Zapier, Make, a Google Sheet |

Set them in Vercel → Project → Settings → Environment Variables. Until one is
set, the forms fail politely and tell people to email instead — nothing is
silently swallowed. A hidden honeypot field blocks the usual spam bots.

---

## Deploying

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework is
   detected automatically, no build settings to change.
3. Add the environment variables from `.env.example`.
4. Add `ninam.org` and `www.ninam.org` as domains and update the DNS records
   Vercel gives you.

---

## Worth doing next

- **Online card giving.** Venmo, Zelle and checks cover the people who already
  know you. A card button converts the ones who don't. [Zeffy](https://www.zeffy.com/)
  is genuinely free for nonprofits; [Givebutter](https://givebutter.com/) and
  Stripe are the other common choices. Drop it in as a fourth method in
  `content/site.ts` and a primary button in the hero.
- **A real photo set.** Every placeholder replaced with a face is worth more
  than any copy change on this list.
- **Recipient stories with permission.** The archive is the proof behind
  "$95,000 to 21 families".
- **A visual editor**, if editing files ever becomes the bottleneck — Sanity or
  Contentful both have free nonprofit tiers and would slot in behind `content/`.
