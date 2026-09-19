import type { Metadata } from "next";
import { Button, Card, Container, Eyebrow, PageHeader, Photo, Section } from "@/components/ui";
import { recipients } from "@/content/recipients";
import { clean } from "@/lib/format";

export const metadata: Metadata = {
  title: "Families We've Helped",
  description:
    "Since 2019 the Nina Mastro Organization has given more than $95,000 to 21 families facing the financial weight of cancer. These are their stories.",
};

export default function RecipientsPage() {
  const sorted = [...recipients].sort((a, b) => b.year - a.year);

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
          {sorted.length === 0 ? (
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
            <ul className="list-none p-0 m-0 flex flex-col gap-8">
              {sorted.map((r) => (
                <li key={`${r.year}-${r.name}`}>
                  <Card className="grid gap-7 md:grid-cols-[240px_1fr] md:gap-9 items-start">
                    <Photo
                      src={r.photo}
                      alt={clean(r.name)}
                      label={`${r.year} recipient`}
                      ratio="1/1"
                    />
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-display text-3xl font-semibold text-orchid tabular">
                          {r.year}
                        </span>
                        <h2 className="text-2xl">{clean(r.name)}</h2>
                        {r.amount ? (
                          <span className="rounded-full bg-gold-tint text-gold px-3 py-1 text-[13px] font-semibold tabular">
                            {r.amount} raised
                          </span>
                        ) : null}
                      </div>
                      {r.diagnosis ? (
                        <p className="text-[14px] uppercase tracking-[0.08em] text-muted font-semibold">
                          {r.diagnosis}
                        </p>
                      ) : null}
                      <p className="text-ink-soft leading-relaxed max-w-[62ch]">
                        {clean(r.story)}
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
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
