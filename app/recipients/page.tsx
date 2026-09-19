import type { Metadata } from "next";
import { Button, Card, Container, Eyebrow, PageHeader, Photo, Section } from "@/components/ui";
import { CountUp, RailNode, Reveal, ScrollRail } from "@/components/motion";
import type { Recipient } from "@/content/recipients";
import { getContent } from "@/lib/content";
import { clean, usd } from "@/lib/format";

const NODE = "absolute -left-[39px] md:-left-[63px] top-4 md:top-7 w-3.5 h-3.5";

type Stop =
  | { kind: "family"; recipient: Recipient; runningTotal: number }
  | { kind: "gap"; from: number; to: number };

/**
 * Oldest first, so the page reads as a story that builds. Each family carries
 * the running total up to and including their gift; any run of years with no
 * entry yet collapses into a single honest "being added" stop.
 */
function buildStops(all: Recipient[], thisYear: number): Stop[] {
  const sorted = [...all].sort((a, b) => a.year - b.year);
  const stops: Stop[] = [];
  let total = 0;
  let previous: number | null = null;
  for (const recipient of sorted) {
    if (previous !== null && recipient.year - previous > 1) {
      stops.push({ kind: "gap", from: previous + 1, to: recipient.year - 1 });
    }
    total += Number(recipient.amount?.replace(/[^\d]/g, "") ?? 0);
    stops.push({ kind: "family", recipient, runningTotal: total });
    previous = recipient.year;
  }
  if (previous !== null && thisYear - previous > 1) {
    stops.push({ kind: "gap", from: previous + 1, to: thisYear - 1 });
  }
  return stops;
}

export const metadata: Metadata = {
  title: "Families We've Helped",
  description:
    "Since 2019 the Nina Mastro Organization has given more than $95,000 to 21 families facing the financial weight of cancer. These are their stories.",
};

export default async function RecipientsPage() {
  const [recipients, impact] = await Promise.all([
    getContent("recipients"),
    getContent("impact"),
  ]);
  const stops = buildStops(recipients, new Date().getFullYear());

  return (
    <>
      <PageHeader
        eyebrow="Families we’ve helped"
        title="Every year has a name behind it."
        lede={
          <>
            Twenty-one families since 2019, and more than $95,000 handed over. These
              are the people that number is actually about — shared with their
              permission, in their words wherever we can.
          </>
        }
      />

      <Section tone="paper">
        <Container className="flex flex-col gap-10">
          {stops.length === 0 ? (
            <Card>
              <p className="text-ink-soft">
                Recipient stories are being added. In the meantime, you can read about{" "}
                <a href="/story" className="text-orchid font-semibold">
                  how this all started
                </a>
                .
              </p>
            </Card>
          ) : (
            <ScrollRail className="ml-2 md:ml-6">
              <ol className="list-none p-0 m-0 pl-8 md:pl-14 flex flex-col gap-16 md:gap-24">
                {stops.map((stop) =>
                  stop.kind === "gap" ? (
                    <li key={`gap-${stop.from}`} className="relative">
                      <RailNode className={`${NODE} !bg-line-strong !shadow-none`} />
                      <Reveal className="flex flex-col gap-2">
                        <span className="font-display italic text-4xl md:text-6xl text-muted tabular">
                          {stop.from === stop.to ? stop.from : `${stop.from} – ${stop.to}`}
                        </span>
                        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                          Stories being added — with each family&apos;s permission
                        </p>
                      </Reveal>
                    </li>
                  ) : (
                    <li key={`${stop.recipient.year}-${stop.recipient.name}`} className="relative">
                      <RailNode className={NODE} />
                      <Reveal className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                          <span className="font-display font-black text-6xl md:text-8xl leading-[0.85] tracking-[-0.04em] text-orchid text-glow tabular">
                            {stop.recipient.year}
                          </span>
                          {stop.runningTotal > 0 ? (
                            <span className="flex flex-col md:items-end gap-1">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                                Running total
                              </span>
                              <CountUp
                                value={usd(stop.runningTotal)}
                                className="font-display text-3xl md:text-4xl font-bold text-gold-bright tabular"
                              />
                            </span>
                          ) : null}
                        </div>
                        <Card className="grid gap-7 md:grid-cols-[220px_1fr] md:gap-9 items-start">
                          <Photo
                            src={stop.recipient.photo}
                            alt={clean(stop.recipient.name)}
                            label={`${stop.recipient.year} recipient`}
                            ratio="1/1"
                          />
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <h2 className="text-3xl md:text-4xl">{clean(stop.recipient.name)}</h2>
                              {stop.recipient.amount ? (
                                <span className="rounded-full bg-gold-tint border border-gold/30 text-gold px-3 py-1 font-mono text-[12px] tabular">
                                  {stop.recipient.amount} raised
                                </span>
                              ) : null}
                            </div>
                            {stop.recipient.diagnosis ? (
                              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
                                {stop.recipient.diagnosis}
                              </p>
                            ) : null}
                            <p className="text-ink-soft leading-relaxed max-w-[62ch]">
                              {clean(stop.recipient.story)}
                            </p>
                          </div>
                        </Card>
                      </Reveal>
                    </li>
                  ),
                )}

                {/* Where the line is heading: the real total, from content/site.ts. */}
                <li className="relative">
                  <RailNode className={`${NODE} !w-5 !h-5 -ml-[3px]`} />
                  <Reveal className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                      Today
                    </span>
                    <CountUp
                      value={impact.headline.value}
                      className="font-display font-black text-[4.2rem] md:text-[9rem] leading-[0.85] tracking-[-0.05em] text-paper tabular [font-variation-settings:'opsz'_40]"
                    />
                    <p className="text-lg text-ink-soft max-w-[48ch]">
                      {impact.headline.label}, to{" "}
                      {impact.secondary[0].value} {impact.secondary[0].label.toLowerCase()} — and
                      the line keeps going.
                    </p>
                  </Reveal>
                </li>
              </ol>
            </ScrollRail>
          )}
        </Container>
      </Section>

      <Section tone="band">
        <Container className="flex flex-col gap-5 items-start max-w-2xl">
          <Eyebrow tone="plum">Know someone?</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">
            Next year&apos;s family hasn&apos;t been chosen yet.
          </h2>
          <p className="text-lg text-ink-soft leading-relaxed">
            Anyone can nominate — a neighbor, a coworker, a nurse, a cousin. Tell us
            who they are and what they&apos;re carrying. Our board reads every single
            one.
          </p>
          <Button href="/get-involved#nominate" variant="primary" size="lg">
            Nominate a family
          </Button>
        </Container>
      </Section>
    </>
  );
}
