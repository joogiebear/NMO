# Design working files

Source artboards for the design review canvas, published at
`claude.ai/code/artifact/a918c690-c173-4a79-bdf0-e773ca226eb1`.

## What's here

`canvas/` holds one `.dc.html` file per artboard plus `canvas.json`, which
positions them on the shared canvas and carries the margin notes.

| Artboard | What it argues |
| --- | --- |
| `HeroNow.dc.html` | The hero as it ships today, for honest comparison |
| `Main.dc.html` | Proposed hero — bleeding photo panel, one CTA, numbers on the seam |
| `MobileHome.dc.html` | Phone view, where most traffic lands from Facebook |
| `PhotoSystem.dc.html` | Four photo roles, crops and treatments, plus a shot list |
| `TypeAndSurfaces.dc.html` | Type weight range vs. a display-face swap; four grounds |
| `EventsRework.dc.html` | Events as posters rather than a timetable |

Every value in these files is lifted from `app/globals.css` — no new colors,
no new fonts beyond the one alternative shown as an explicit option.

## Regenerating the canvas

The published `.html` is a generated bundle (~2.5 MB, gitignored). Rebuild it
from these files with the `/design` skill, which re-seeds a fresh copy of the
canvas editor from `canvas/`.

## Status

None of this is applied to the live site. It's a proposal — decide which
pieces are worth building into the Next.js app in `app/`.
