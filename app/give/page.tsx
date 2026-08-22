import type { Metadata } from "next";
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Section,
  SectionHead,
} from "@/components/ui";
import { giftAmounts, givingMethods, site, sponsorTiers } from "@/content/site";
import { clean, hasStore, usd } from "@/lib/format";

export const metadata: Metadata = {
  title: "Ways to Give",
  description:
    "Give by Venmo, bank quick pay or check. Every gift to the Nina Mastro Organization is tax-deductible and goes directly to a family fighting cancer.",
};

const faqs = [
  {
    q: "Where does my money actually go?",
    a: "To one family, chosen each year by our board from nominations sent in by people like you. We're volunteers — nobody here takes a salary from what you give.",
  },
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

export default function GivePage() {
  const email = clean(site.contact.email);
  const storeUrl = hasStore(site.store.url) ? site.store.url : null;

  return (
    <>
      <section className="warm-wash border-b border-line">
        <Container className="py-14 sm:py-20">
          <div className="flex flex-col gap-5 max-w-3xl">
            <Eyebrow>Ways to give</Eyebrow>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem]">
              Give however is easiest for you.
            </h1>
            <p className="text-lg sm:text-xl text-ink-soft leading-relaxed max-w-[54ch]">
              We take donations all year round, not just at events. Whatever you send
              goes toward the family we&apos;re raising for — and we&apos;ll get you a
              receipt for your taxes.
            </p>
            <ul className="list-none p-0 m-0 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-soft pt-1">
              <li className="flex items-center gap-2">
                <Check /> Registered 501(c)(3)
              </li>
              <li className="flex items-center gap-2">
                <Check /> Tax-deductible
              </li>
              <li className="flex items-center gap-2">
                <Check /> Run entirely by volunteers
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <Section tone="paper">
        <Container className="flex flex-col gap-10">
          <SectionHead
            eyebrow="Pick one"
            title="Three ways to send it."
            lede="No account to make, no login, no minimum. Whatever you have on you is welcome."
          />

          <ul className="list-none p-0 m-0 grid gap-6 lg:grid-cols-3">
            {givingMethods.map((method, i) => (
              <li key={method.id}>
                <Card className="flex flex-col gap-3 h-full">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gold tabular">
                    {i === 0 ? "Fastest" : i === 1 ? "No fees" : "By mail"}
                  </span>
                  <h3 className="text-2xl">{method.name}</h3>
                  <p className="text-ink-soft leading-relaxed">{method.blurb}</p>
                  <p className="rounded-xl bg-plum-tint text-plum font-semibold px-4 py-3 break-words">
                    {clean(method.detail)}
                  </p>
                  <p className="text-[14.5px] text-muted leading-relaxed">{method.note}</p>
                  {method.href ? (
                    <div className="mt-auto pt-2">
                      <Button href={method.href} variant="primary">
                        Give with {method.name}
                      </Button>
                    </div>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>

          <Card className="flex flex-col gap-4">
            <h3 className="text-xl">Not sure how much?</h3>
            <p className="text-ink-soft leading-relaxed max-w-[58ch]">
              There&apos;s no wrong number here. People give what a night out would
              have cost them, and it adds up fast when a whole neighborhood does it.
            </p>
            <ul className="list-none p-0 m-0 flex flex-wrap gap-3">
              {giftAmounts.map((amount) => (
                <li
                  key={amount}
                  className="rounded-full border-2 border-line-strong px-5 py-2 font-display text-lg font-semibold text-plum tabular"
                >
                  {usd(amount)}
                </li>
              ))}
              <li className="rounded-full border-2 border-dashed border-line-strong px-5 py-2 font-medium text-muted">
                or whatever you can
              </li>
            </ul>
          </Card>
        </Container>
      </Section>

      {storeUrl ? (
        <Section tone="paper" className="pt-0">
          <Container>
            <Card className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
              <div className="flex flex-col gap-2 max-w-[54ch]">
                <Eyebrow>Buy something instead</Eyebrow>
                <h3 className="text-2xl">Merch works as well as a donation.</h3>
                <p className="text-ink-soft leading-relaxed">
                  {site.store.headline} {site.store.blurb}
                </p>
              </div>
              <div className="shrink-0">
                <Button href={storeUrl} variant="primary" size="lg">
                  Visit the {site.store.label.toLowerCase()}
                </Button>
              </div>
            </Card>
          </Container>
        </Section>
      ) : null}

      <Section tone="band">
        <Container className="flex flex-col gap-10">
          <SectionHead
            eyebrow="For businesses"
            title="Put your name on the block party."
            lede="Local businesses fund a real share of our year. Your customers see it, and a family gets the benefit."
          />
          <ul className="list-none p-0 m-0 grid gap-6 md:grid-cols-3">
            {sponsorTiers.map((tier) => (
              <li key={tier.name}>
                <Card className="flex flex-col gap-4 h-full">
                  <div>
                    <h3 className="text-2xl">{tier.name}</h3>
                    <p className="font-display text-3xl font-semibold text-gold tabular">
                      {tier.amount}
                    </p>
                  </div>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-[15.5px] text-ink-soft">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex gap-2.5 items-start">
                        <span className="pt-1">
                          <Check />
                        </span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <Button href="/get-involved#sponsor" variant="ghost">
                      Sponsor at this level
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHead
            eyebrow="Questions people ask"
            title="The things you'd rather not have to ask."
          />
          <div className="flex flex-col">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border-b border-line py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-display text-xl font-semibold text-ink">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 mt-1 text-gold transition-transform duration-200 group-open:rotate-45"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M9 3v12M3 9h12"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="pt-3 text-ink-soft leading-relaxed max-w-[58ch]">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="plum">
        <Container className="flex flex-col gap-5 items-start max-w-3xl">
          <h2 className="text-3xl sm:text-4xl text-paper">Still have a question?</h2>
          <p className="text-lg text-paper/85 max-w-[48ch] leading-relaxed">
            Email a real person. One of us will write back — we always do.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={`mailto:${email}`} variant="gold" size="lg">
              {email}
            </Button>
            <Button href="/contact" variant="onPlum" size="lg">
              Send a message
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="text-gold shrink-0"
    >
      <path
        d="M2.5 8.5l3.5 3.5 7.5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
