# Updating the website

You don't need to know anything about code. Everything is done from one page,
on your phone or a computer.

## Signing in

1. Go to **/admin** on the website (for example `ninam.org/admin`).
2. Type the password. Whoever looks after the site can give it to you.
3. You stay signed in on that device for two weeks.

## The thing you'll do most: update the total

Right at the top of the admin page is **Update the total raised**. Type the new
number, press **Update total**, and the home page changes straight away. You
can type it however you like — `12400`, `12,400` or `$12,400` all work.

The progress bar only shows once a goal is set. Set it under
**This year's family**.

## Everything else

| Section | What it changes |
| --- | --- |
| This year's family | The family on the home page, their story, photo, goal and total |
| The big numbers | "$95,000+ given away", "21 families" — the totals in the header |
| Events | Add an event, change a date. Past events move down on their own |
| Families we've helped | The timeline on the Families page |
| Sponsors | The thank-you list on the home page |
| Board members | Names, roles and photos on the Our Story page |
| Ways to give | Your Venmo handle, Zelle email and check instructions |

In each one: tap an entry to open it, change what you need, then press the gold
**Save changes** button at the bottom. It's live as soon as it says "Saved."

**Photos:** tap **Choose a photo** and pick one from your phone. It's shrunk
automatically, so big photos are fine.

## If you make a mistake

Nothing is ever really lost. At the bottom of the admin page, **Recent changes**
lists every save. Press **Restore this version** next to the one you want back.

## What you can't break

The forms only accept the right kind of thing in each box, so there is no way
to knock the site over from here. If a page ever says "We couldn't load that
just now", nothing was changed — wait a minute and try again.

---

## For whoever looks after the site

- The admin is off until both `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are
  set on the Railway `web` service. Changing `ADMIN_PASSWORD` changes the
  password; changing `ADMIN_SESSION_SECRET` signs everyone out.
- Content lives in the Railway Postgres service (`content`, `content_history`,
  `media` tables, created automatically). The files in `content/` are the
  defaults shown for any section nobody has saved yet.
- What is editable, and how each field is checked, is defined in one place:
  `lib/admin-schema.ts`.
