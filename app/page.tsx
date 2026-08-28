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
import { EventCard, EventPoster } from "@/components/EventCards";
import { recipients } from "@/content/recipients";
import { sponsors } from "@/content/sponsors";
import { clean, hasStore, splitEvents, usd } from "@/lib/format";

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
      <section className="relative overflow-hidden bg-paper grain border-b border-line">
        <div className="relative mx-auto max-w-[1600px] grid lg:grid-cols-[1fr_44%] items-stretch">
          {/* Photo leads on a phone, sits to the side on a laptop, and bleeds
              off the right edge rather than sitting inside the container. */}
          <div className="order-1 lg:order-2 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[640px]">
            <Photo
              variant="panel"
              fill
              alt="Nina"
              label="Portrait, 3:4, natural color. Her face is the first thing anyone should see."
              className="absolute inset-0 lg:items-end lg:text-right"
              priority
            />
          </div>

          <div className="order-2 lg:order-1 relative z-10 w-[92%] lg:w-auto mx-auto lg:mx-0 lg:ml-[max(4vw,2.5rem)] lg:mr-0 py-14 sm:py-16 lg:py-24 flex flex-col gap-6">
            <Eyebrow>
              Chicago · In memory of Nina Mastro · Since {site.founded}
            </Eyebrow>
            <h1 className="text-[2.7rem] sm:text-[3.4rem] lg:text-[5.1rem] leading-[0.99] tracking-[-0.03em]">
              Cancer takes enough.
              <br />
              <span className="text-plum">
                It shouldn&apos;t take the rent, too.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-ink-soft max-w-[40ch] leading-relaxed">
              We&apos;re a group of lifelong Chicago friends who lost Nina to
              pancreatic cancer. Every year we throw a party and hand everything we
              raise to one family.
            </p>

            {/* One button, not two competing ones. */}
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-1">
              <Button href="/give" variant="primary" size="lg">
                Donate
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 8h11M9.5 4l4 4-4 4" />
                </svg>
              </Button>
              <Link
                href="/get-involved"
                className="font-semibold text-ink-soft no-underline border-b-2 border-gold-bright pb-0.5 hover:text-plum"
              >
                Other ways to help
              </Link>
            </div>

            {/* The numbers ride on the seam, and $95,000 is finally the
                biggest thing on the page. */}
            <div className="mt-4 lg:mt-8 lg:w-[118%] bg-card rounded-2xl shadow-lift overflow-hidden grid grid-cols-2 sm:grid-cols-[1.5fr_1fr_1fr]">
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-0.5 px-7 py-6 bg-plum">
                <span className="font-display text-[2.6rem] sm:text-[3.1rem] font-semibold leading-none tracking-[-0.02em] text-paper tabular">
                  {impact.headline.value}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/70">
                  {impact.headline.label}
                </span>
              </div>
              {impact.secondary.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col gap-0.5 px-6 py-6 border-t sm:border-t-0 border-line ${
                    i === 0 ? "sm:border-r" : ""
                  }`}
                >
                  <span className="font-display text-[2.2rem] font-semibold leading-tight tracking-[-0.02em] text-ink tabular">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-gold"
              >
                <path d="M2.5 8.5l3.5 3.5 7.5-8" />
              </svg>
              <span>Registered 501(c)(3)</span>
              <span aria-hidden="true">·</span>
              <span className="tabular">EIN {site.ein}</span>
              <span aria-hidden="true">·</span>
              <span>Every gift is tax-deductible</span>
            </p>
          </div>
        </div>
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
            <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <EventPoster event={nextEvents[0]} />
              {nextEvents.length > 1 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {nextEvents.slice(1, 3).map((event) => (
                    <EventCard key={event.slug} event={event} />
                  ))}
                </div>
              ) : null}
            </div>
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
