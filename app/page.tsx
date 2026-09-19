import Link from "next/link";
import {
  CountUp,
  ParallaxLayer,
  ParallaxScene,
  Reveal,
  RevealText,
} from "@/components/motion";
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Photo,
  Section,
  SectionHead,
} from "@/components/ui";
import { site } from "@/content/site";
import { getContent, getSite } from "@/lib/content";
import { EventCard, EventPoster } from "@/components/EventCards";
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

export default async function HomePage() {
  // Everything the organization edits for itself comes through /admin.
  const [site, hero, currentCampaign, impact, events, recipients, sponsors] = await Promise.all([
    getSite(),
    getContent("hero"),
    getContent("campaign"),
    getContent("impact"),
    getContent("events"),
    getContent("recipients"),
    getContent("sponsors"),
  ]);
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
      {/* ---------------------------------------------------------------- hero
          Three planes, each a ParallaxLayer moving at its own rate as the scene
          scrolls away: light and the outlined name at the back, the portrait in
          the middle, the words and the numbers in front. */}
      <ParallaxScene
        ground="#0D0812"
        className="relative overflow-hidden grain border-b border-line"
      >
        {/* Back plane — slowest. */}
        <ParallaxLayer speed={260} className="absolute inset-0">
          <div aria-hidden="true" className="aurora" />
          <div
            aria-hidden="true"
            className="halftone absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]"
          />
        </ParallaxLayer>
        <ParallaxLayer
          speed={180}
          fadeTo={0}
          className="absolute inset-x-0 bottom-[-0.12em] pointer-events-none select-none font-display italic font-black leading-none text-outline text-[44vw] lg:text-[30vw] -ml-[2vw] whitespace-nowrap"
        >
          <span aria-hidden="true">Nina</span>
        </ParallaxLayer>

        <div className="relative mx-auto max-w-[1600px] grid lg:grid-cols-[1fr_42%] items-stretch lg:min-h-[calc(100svh-5rem)]">
          {/* Middle plane — the portrait. Leads on a phone, bleeds off the
              right edge on a laptop. */}
          <div className="order-1 lg:order-2 relative min-h-[300px] sm:min-h-[380px]">
            <ParallaxLayer
              speed={110}
              className="absolute inset-0 lg:top-10 lg:bottom-14 lg:left-6 overflow-hidden lg:rounded-l-[2.75rem] lg:border lg:border-r-0 lg:border-line-strong/70 shadow-lift"
            >
              <ParallaxLayer scaleTo={1.16} className="absolute inset-0">
                <Photo
                  variant="panel"
                  fill
                  alt="Nina"
                  label="Portrait, 3:4, natural color. Her face is the first thing anyone should see."
                  className="absolute inset-0 lg:items-end lg:text-right"
                  priority
                />
              </ParallaxLayer>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ground via-ground/10 to-transparent lg:from-ground/70"
              />
            </ParallaxLayer>
            {/* Loose light between the planes; runs ahead of the scroll. */}
            <ParallaxLayer
              speed={-160}
              className="hidden lg:block absolute -left-16 top-[56%] pointer-events-none"
            >
              <div
                aria-hidden="true"
                className="w-36 h-36 rounded-full border border-gold-bright/60 animate-float shadow-glow-gold"
              />
            </ParallaxLayer>
            <ParallaxLayer
              speed={-90}
              className="hidden lg:block absolute right-[14%] bottom-[18%] pointer-events-none"
            >
              <div
                aria-hidden="true"
                className="w-5 h-5 rounded-full bg-orchid animate-float [animation-delay:-4s] shadow-glow-orchid"
              />
            </ParallaxLayer>
          </div>

          {/* Front plane — the words. */}
          <ParallaxLayer
            speed={-70}
            fadeTo={0.15}
            className="order-2 lg:order-1 relative z-10 w-[92%] lg:w-auto mx-auto lg:mx-0 lg:ml-[max(4vw,2.5rem)] lg:mr-0 py-12 sm:py-16 lg:py-24 flex flex-col justify-center gap-7"
          >
            <Reveal y={16}>
              <Eyebrow>
                Chicago · In memory of Nina Mastro · Since {site.founded}
              </Eyebrow>
            </Reveal>
            <h1 className="font-black text-[3.05rem] sm:text-[4.4rem] lg:text-[clamp(3.8rem,5.35vw,6.2rem)] leading-[0.93] tracking-[-0.045em]">
              <RevealText text={hero.line1} delay={0.1} />
              {hero.line2 ? (
                <>
                  <br />
                  <RevealText
                    text={hero.line2}
                    delay={0.4}
                    className="italic font-normal text-orchid text-glow"
                  />
                </>
              ) : null}
            </h1>
            <Reveal delay={0.55} y={24}>
              <p className="text-lg sm:text-xl text-ink-soft max-w-[42ch] leading-relaxed">
                {hero.intro}
              </p>
            </Reveal>

            {/* One button, not two competing ones. */}
            <Reveal
              delay={0.65}
              y={20}
              className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-1"
            >
              <Button href="/give" variant="gold" size="lg">
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
                className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft no-underline border-b border-gold-bright pb-1 transition-colors duration-300 hover:text-gold-bright"
              >
                Other ways to help
              </Link>
            </Reveal>

            {/* The numbers ride on the seam, and $95,000 is the biggest thing
                on the page. */}
            <Reveal
              delay={0.75}
              className="mt-2 lg:mt-6 lg:w-[116%] bg-card/70 backdrop-blur-md border border-line-strong/60 rounded-3xl shadow-lift overflow-hidden grid grid-cols-2 sm:grid-cols-[1.5fr_1fr_1fr]"
            >
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5 px-7 py-6 bg-gradient-to-br from-plum to-[#3A1763]">
                <CountUp
                  value={impact.headline.value}
                  className="font-display text-[2.8rem] sm:text-[3.4rem] font-black leading-none tracking-[-0.03em] text-paper tabular"
                />
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-paper/70">
                  {impact.headline.label}
                </span>
              </div>
              {impact.secondary.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col gap-1.5 px-6 py-6 border-t sm:border-t-0 border-line ${
                    i === 0 ? "border-r" : ""
                  }`}
                >
                  <CountUp
                    value={stat.value}
                    className="font-display text-[2.3rem] font-bold leading-tight tracking-[-0.02em] text-ink tabular"
                  />
                  <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.85} y={12}>
              <p className="font-mono text-[12px] text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
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
            </Reveal>
          </ParallaxLayer>
        </div>
      </ParallaxScene>

      {/* ------------------------------------------------------------ marquee */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-b border-line bg-ground-2/60 py-5 sm:py-7"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {[
                `${impact.headline.value} ${impact.headline.label}`,
                ...impact.secondary.map((s) => `${s.value} ${s.label}`),
                site.tagline,
                `Chicago, since ${site.founded}`,
              ].map((item) => (
                <span key={item} className="flex items-center">
                  <span className="font-display italic text-3xl sm:text-5xl tracking-[-0.03em] text-ink/90 px-6 sm:px-10 whitespace-nowrap">
                    {item}
                  </span>
                  <span className="text-gold-bright text-xl sm:text-2xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ this year's family */}
      {currentCampaign.active ? (
        <Section tone="paper">
          <Container>
            <Reveal>
            <Card tilt={false} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10 items-center">
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
                      <span className="text-orchid tabular text-lg">
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
            </Reveal>
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
            {waysToHelp.map((way, i) => (
              <Reveal key={way.title} delay={i * 0.09} className="h-full">
              <Card className="flex flex-col gap-3 h-full">
                <h3 className="text-3xl sm:text-4xl">{way.title}</h3>
                <p className="text-ink-soft leading-relaxed">{way.body}</p>
                <Link
                  href={way.cta.href}
                  className="mt-auto pt-3 no-underline font-mono text-[13px] uppercase tracking-[0.12em] text-orchid transition-colors duration-300 hover:text-gold-bright"
                >
                  {way.cta.label} →
                </Link>
              </Card>
              </Reveal>
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
            <h2 className="text-[2.4rem] sm:text-5xl lg:text-[4rem]">
              <RevealText text="It started with one friend, and a promise." />
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
            ].map((s, i) => (
              <li key={s.step} className="border-t border-gold-bright/70">
                <Reveal delay={i * 0.12} className="flex flex-col gap-3 pt-6">
                <span className="font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-gold tabular">
                  {s.step}
                </span>
                <h3 className="text-xl">{s.title}</h3>
                <p className="text-muted leading-relaxed text-[15.5px]">{s.body}</p>
                </Reveal>
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
                      className="no-underline text-ink hover:text-orchid"
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
        <Container className="flex flex-col gap-8 items-start">
          <Eyebrow tone="paper">One family at a time</Eyebrow>
          <h2 className="font-black text-[3rem] sm:text-7xl lg:text-[7.5rem] leading-[0.9] tracking-[-0.05em] text-paper">
            <RevealText text="For as long" />
            <br />
            <RevealText text="as it takes." delay={0.2} className="italic font-normal text-gold-bright" />
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
