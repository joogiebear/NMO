import type { Metadata } from "next";
import { Button, Card, Container, Eyebrow, Photo, Section, SectionHead } from "@/components/ui";
import { events } from "@/content/events";
import { clean, formatEventDate, splitEvents } from "@/lib/format";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The Block Party at Shinnick's Pub, PurpleStride, Bunco night and more. Come out, bring people — that's how the money gets raised.",
};

export default function EventsPage() {
  const { upcoming, past } = splitEvents(events);

  return (
    <>
      <section className="warm-wash border-b border-line">
        <Container className="py-14 sm:py-20">
          <div className="flex flex-col gap-5 max-w-3xl">
            <Eyebrow>Events</Eyebrow>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem]">
              Come out. Bring people. That&apos;s the whole ask.
            </h1>
            <p className="text-lg sm:text-xl text-ink-soft leading-relaxed max-w-[54ch]">
              Our fundraising happens in bars, on blocks and on parade routes — in
              person, in Chicago, all year long. You don&apos;t need to know anybody to
              turn up. You&apos;ll know people by the end of it.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="paper">
        <Container className="flex flex-col gap-10">
          <SectionHead eyebrow="Coming up" title="What's next" />
          {upcoming.length === 0 ? (
            <Card>
              <p className="text-ink-soft">
                Nothing on the calendar right this minute — check back soon, or follow
                us on Facebook and we&apos;ll shout when the next one is set.
              </p>
            </Card>
          ) : (
            <ul className="list-none p-0 m-0 grid gap-7 lg:grid-cols-2">
              {upcoming.map((event) => (
                <li key={event.slug}>
                  <Card className="flex flex-col gap-4 h-full">
                    <Photo
                      src={event.photo}
                      alt={event.name}
                      label={`${event.name} — a photo from last year`}
                      ratio="16/9"
                    />
                    <div className="flex flex-col gap-2">
                      <Eyebrow>{formatEventDate(event.date)}</Eyebrow>
                      <h3 className="text-2xl">{event.name}</h3>
                      <p className="text-[15px] text-muted">
                        {clean(event.venue)}
                        {event.address ? ` · ${clean(event.address)}` : ""}
                        {event.time ? ` · ${event.time}` : ""}
                      </p>
                    </div>
                    <p className="text-ink-soft leading-relaxed">{event.description}</p>
                    <div className="mt-auto pt-2 flex flex-wrap gap-3">
                      {event.ticketUrl ? (
                        <Button href={event.ticketUrl} variant="primary">
                          Get tickets
                        </Button>
                      ) : null}
                      <Button href="/get-involved#volunteer" variant="ghost">
                        Help run it
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {past.length > 0 ? (
        <Section tone="band">
          <Container className="flex flex-col gap-8">
            <SectionHead eyebrow="Already happened" title="Past events" />
            <ul className="list-none p-0 m-0 flex flex-col border-t border-line-strong">
              {past.map((event) => (
                <li
                  key={event.slug}
                  className="grid gap-2 sm:grid-cols-[200px_1fr] sm:gap-6 py-5 border-b border-line-strong"
                >
                  <span className="text-[14px] font-semibold text-gold uppercase tracking-[0.06em]">
                    {formatEventDate(event.date)}
                  </span>
                  <div>
                    <h3 className="text-xl">{event.name}</h3>
                    <p className="text-[15px] text-muted">{clean(event.venue)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section tone="plum">
        <Container className="flex flex-col gap-6 items-start max-w-3xl">
          <h2 className="text-3xl sm:text-4xl text-paper">Can&apos;t make it out?</h2>
          <p className="text-lg text-paper/85 max-w-[50ch] leading-relaxed">
            Plenty of people give from wherever they are, and plenty send a raffle
            basket instead of showing up. Both count.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/give" variant="gold" size="lg">
              Donate instead
            </Button>
            <Button href="/get-involved#sponsor" variant="onPlum" size="lg">
              Sponsor an event
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
