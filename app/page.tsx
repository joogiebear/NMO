import Link from "next/link";
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Photo,
  Section,
  SectionHead,
} from "@/components/ui";
import { currentCampaign, impact, site } from "@/content/site";
import { events } from "@/content/events";
import { recipients } from "@/content/recipients";
import { sponsors } from "@/content/sponsors";
import { clean, eventDateParts, hasStore, splitEvents, usd } from "@/lib/format";

const waysToHelp = [
  {
    title: "Give",
    body: "Venmo, your bank's quick pay, or a check in the mail. Any amount. Every dollar reaches the family we're raising for.",
    cta: { href: "/give", label: "Ways to give" },
  },
  {
    title: "Come to something",
    body: "The Block Party, Bunco night, the walk. Buy a raffle ticket, bring four friends. This is how most of the money actually gets raised.",
    cta: { href: "/events", label: "See what's coming up" },
  },
  {
    title: "Nominate a family",
    body: "You know someone who's drowning in bills behind a diagnosis. Tell us about them — anyone can nominate, and our board reads every one.",
    cta: { href: "/get-involved#nominate", label: "Submit a nomination" },
  },
  {
    title: "Lend a hand or a logo",
    body: "Help run the raffle table, put together a basket, or sponsor an event as a local business. It all lightens the load.",
    cta: { href: "/get-involved", label: "Get involved" },
  },
];

export default function HomePage() {
  const { upcoming } = splitEvents(events);
  const storeUrl = hasStore(site.store.url) ? site.store.url : null;
  const nextEvents = upcoming.slice(0, 3);
  const namedRecipients = recipients.filter((r) => !r.name.startsWith("TODO_"));

  const showProgress = currentCampaign.goal > 0;
  const pct = showProgress
    ? Math.min(100, Math.round((currentCampaign.raised / currentCampaign.goal) * 100))
    : 0;

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="warm-wash border-b border-line">
        <Container className="py-16 sm:py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <Eyebrow>In memory of Nina Mastro · Chicago · Since {site.founded}</Eyebrow>
              <h1 className="text-[2.6rem] sm:text-5xl lg:text-[4.1rem] leading-[1.03]">
                Cancer takes enough.
                <br />
                <span className="text-plum">It shouldn&apos;t take the rent, too.</span>
              </h1>
              <p className="text-lg sm:text-xl text-ink-soft max-w-[46ch] leading-relaxed">
                We&apos;re a group of lifelong Chicago friends who lost Nina to
                pancreatic cancer. Every year we throw a party, fill a room, and hand
                everything we raise to one family carrying the financial weight of
                this disease.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button href="/give" variant="primary" size="lg">
                  Donate
                </Button>
                <Button href="/get-involved" variant="ghost" size="lg">
                  Other ways to help
                </Button>
              </div>
              <p className="text-sm text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Registered 501(c)(3)</span>
                <span aria-hidden="true">·</span>
                <span className="tabular">EIN {site.ein}</span>
                <span aria-hidden="true">·</span>
                <span>Every gift is tax-deductible</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Photo
                alt="Nina"
                label="Nina — the photo everything is built around"
                ratio="2/3"
                className="col-span-1"
              />
              <div className="flex flex-col gap-4">
                <Photo alt="The Block Party crowd" label="The Block Party" ratio="4/3" />
                <Photo
                  alt="Handing over the check"
                  label="Handing it over"
                  ratio="4/3"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------------- impact */}
      <section className="bg-card border-b border-line">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-line lg:divide-y-0 lg:divide-x">
            {impact.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 py-8 px-4 sm:px-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-3xl sm:text-4xl lg:text-[2.7rem] font-semibold text-plum leading-none tabular">
                  {stat.value}
                </dd>
                <dd className="text-[13px] uppercase tracking-[0.07em] text-muted font-medium">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ------------------------------------------------------ this year's family */}
      {currentCampaign.active ? (
        <Section tone="paper">
          <Container>
            <Card className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10 items-center">
              <Photo
                src={currentCampaign.photo || undefined}
                alt={clean(currentCampaign.recipientName)}
                label="This year's family"
                ratio="4/3"
              />
              <div className="flex flex-col gap-5">
                <Eyebrow tone="plum">
                  {currentCampaign.year} · Who we&apos;re raising for
                </Eyebrow>
                <h2 className="text-3xl lg:text-4xl">
                  {clean(currentCampaign.headline)}
                </h2>
                <p className="text-ink-soft leading-relaxed max-w-[54ch]">
                  {clean(currentCampaign.story)}
                </p>

                {showProgress ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline text-sm font-semibold">
                      <span className="text-plum tabular text-lg">
                        {usd(currentCampaign.raised)} raised
                      </span>
                      <span className="text-muted tabular">
                        of {usd(currentCampaign.goal)} goal
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full bg-plum-tint overflow-hidden"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Fundraising progress"
                    >
                      <div
                        className="h-full rounded-full bg-gold-bright"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button href="/give" variant="primary">
                    Give to this family
                  </Button>
                  <Button href="/events" variant="ghost">
                    Come to an event instead
                  </Button>
                </div>
              </div>
            </Card>
          </Container>
        </Section>
      ) : null}

      {/* -------------------------------------------------------- ways to help */}
      <Section tone="band">
        <Container className="flex flex-col gap-12">
          <SectionHead
            eyebrow="How you can help"
            title="There's more than one way in."
            lede="Money helps most, but it isn't the only thing that matters. Pick whichever of these fits your week."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {waysToHelp.map((way) => (
              <Card key={way.title} className="flex flex-col gap-3">
                <h3 className="text-2xl">{way.title}</h3>
                <p className="text-ink-soft leading-relaxed">{way.body}</p>
                <Link
                  href={way.cta.href}
                  className="mt-auto pt-3 no-underline font-semibold text-plum hover:text-gold text-[15px]"
                >
                  {way.cta.label} →
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ the shop */}
      {storeUrl ? (
        <section className="bg-gold-tint border-y border-line">
          <Container className="py-10 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex flex-col gap-1.5 max-w-[52ch]">
              <Eyebrow>Wearing it counts too</Eyebrow>
              <h2 className="text-2xl sm:text-3xl">{site.store.headline}</h2>
              <p className="text-ink-soft leading-relaxed">{site.store.blurb}</p>
            </div>
            <Button href={storeUrl} variant="primary" size="lg" className="shrink-0">
              Visit the {site.store.label.toLowerCase()}
            </Button>
          </Container>
        </section>
      ) : null}

      {/* --------------------------------------------------------- story teaser */}
      <Section tone="paper">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 items-center">
          <Photo alt="Nina with her friends" label="Nina and the crew" ratio="4/5" />
          <div className="flex flex-col gap-6">
            <Eyebrow>Why we&apos;re here</Eyebrow>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.9rem]">
              It started with one friend, and a promise.
            </h2>
            <div className="flex flex-col gap-5 text-[17.5px] text-ink-soft leading-relaxed max-w-[58ch]">
              <p>
                In May 2015, Nina Mastro was diagnosed with pancreatic cancer. Her
                friends did what friends in this city do — they showed up, they
                cooked, they drove, they sat in waiting rooms. And they watched how
                fast the bills stack up behind a diagnosis.
              </p>
              <p>
                In June 2019, a group of her lifelong friends threw the first event in
                her honor. It raised over{" "}
                <strong className="text-ink font-semibold">$8,000</strong> in a single
                night, and it went straight to a family who needed it. That night
                became an organization.
              </p>
            </div>
            <blockquote className="border-l-4 border-gold-bright pl-5 font-display text-xl sm:text-2xl italic text-ink leading-snug max-w-[46ch]">
              Every dollar we raise goes directly to a person or family struggling
              under the financial burden of fighting cancer.
            </blockquote>
            <div>
              <Button href="/story" variant="ghost">
                Read Nina&apos;s story
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- events */}
      {nextEvents.length > 0 ? (
        <Section tone="band">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-wrap gap-6 items-end justify-between">
              <SectionHead
                eyebrow="Coming up"
                title="Come out. Bring people."
                lede="Our fundraising happens in bars, on blocks and on parade routes. Showing up is the ask."
              />
              <Button href="/events" variant="ghost">
                All events
              </Button>
            </div>
            <ul className="list-none p-0 m-0 flex flex-col border-t border-line-strong">
              {nextEvents.map((event) => {
                const parts = eventDateParts(event.date);
                return (
                  <li
                    key={event.slug}
                    className="grid gap-4 sm:grid-cols-[88px_1fr_auto] sm:gap-6 items-center py-6 border-b border-line-strong"
                  >
                    <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0 text-plum">
                      {parts ? (
                        <>
                          <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                            {parts.month}
                          </span>
                          <span className="font-display text-3xl font-semibold tabular leading-none">
                            {parts.day}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                          Date TBA
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl sm:text-2xl">{event.name}</h3>
                      <p className="text-muted text-[15px]">
                        {clean(event.venue)}
                        {event.address ? ` · ${clean(event.address)}` : ""}
                      </p>
                    </div>
                    <Button href="/events" variant="ghost">
                      Details
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* -------------------------------------------------- how we choose (trust) */}
      <Section tone="paper">
        <Container className="flex flex-col gap-12">
          <SectionHead
            eyebrow="Where the money goes"
            title="Nominated by a neighbor. Chosen by the board. Handed over in person."
            lede="We keep it deliberately simple, so the money moves fast and lands where it's needed."
          />
          <ol className="grid gap-8 md:grid-cols-3 list-none p-0 m-0">
            {[
              {
                step: "Step 01",
                title: "Someone nominates",
                body: "A neighbor, a coworker, a nurse, a cousin. Anyone can submit a nomination with the details of what the family is facing.",
              },
              {
                step: "Step 02",
                title: "The board reviews",
                body: "Our Board of Directors reads every nomination and selects one recipient for the year. Not all can be approved — but every one is read.",
              },
              {
                step: "Step 03",
                title: "We hand it over",
                body: "Everything raised across the year goes to that family. We tell you who they are and what your night out paid for.",
              },
            ].map((s) => (
              <li key={s.step} className="flex flex-col gap-3 pt-5 border-t-2 border-gold-bright">
                <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gold tabular">
                  {s.step}
                </span>
                <h3 className="text-xl">{s.title}</h3>
                <p className="text-muted leading-relaxed text-[15.5px]">{s.body}</p>
              </li>
            ))}
          </ol>
          {namedRecipients.length > 0 ? (
            <div>
              <Button href="/recipients" variant="ghost">
                Meet the families we&apos;ve helped
              </Button>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* ------------------------------------------------------------- sponsors */}
      {sponsors.length > 0 ? (
        <Section tone="band">
          <Container className="flex flex-col gap-8">
            <SectionHead
              eyebrow="Thank you"
              title="The businesses and families who funded the year."
              center
            />
            <ul className="list-none p-0 m-0 flex flex-wrap justify-center gap-3">
              {sponsors.map((s) => (
                <li
                  key={s.name}
                  className="bg-card border border-line rounded-full px-5 py-2.5 text-[15px] font-medium"
                >
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline text-ink hover:text-plum"
                    >
                      {s.name}
                    </a>
                  ) : (
                    s.name
                  )}
                </li>
              ))}
            </ul>
            <div className="text-center">
              <Button href="/get-involved#sponsor" variant="ghost">
                Become a sponsor
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------ closing CTA */}
      <Section tone="plum">
        <Container className="flex flex-col gap-6 items-start max-w-3xl">
          <Eyebrow tone="paper">One family at a time</Eyebrow>
          <h2 className="text-3xl sm:text-4xl lg:text-[3rem] text-paper">
            For as long as it takes.
          </h2>
          <p className="text-lg text-paper/85 max-w-[52ch] leading-relaxed">
            Give once, give every year, or just turn up to the Block Party and buy a
            raffle ticket. It all ends up in the same place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/give" variant="gold" size="lg">
              Donate
            </Button>
            <Button href="/get-involved#nominate" variant="onPlum" size="lg">
              Nominate a family
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
