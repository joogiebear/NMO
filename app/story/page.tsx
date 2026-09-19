import type { Metadata } from "next";
import { Button, Card, Container, Eyebrow, PageHeader, Photo, Section, SectionHead } from "@/components/ui";
import { board } from "@/content/board";
import { site } from "@/content/site";
import { clean } from "@/lib/format";

export const metadata: Metadata = {
  title: "Nina's Story",
  description:
    "How the Nina Mastro Organization started: a diagnosis in 2015, a first fundraiser in 2019, and a promise a group of Chicago friends made to each other.",
};

const namedBoard = board.filter((m) => !m.name.startsWith("TODO_"));

export default function StoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="It started with one friend, and a promise."
        lede={
          <>
            Nina Mastro was the kind of friend who showed up for everybody. When she
              needed people, they showed up for her — and they never stopped.
          </>
        }
      />

      <Section tone="paper">
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-6 text-[17.5px] text-ink-soft leading-relaxed max-w-[62ch]">
            <p>
              In <strong className="text-ink font-semibold">May 2015</strong>, Nina was
              diagnosed with pancreatic cancer. Her friends did what friends in this
              city do — they cooked, they drove, they sat in waiting rooms, they made
              each other laugh in hallways where laughing felt impossible.
            </p>
            <p>
              And they saw the other half of it, the half nobody warns you about. The
              parking. The co-pays. The shifts you can&apos;t work because you&apos;re
              at an appointment. The way a diagnosis quietly turns into a financial
              emergency while everyone&apos;s attention is somewhere else.
            </p>
            <p>
              After Nina died, her friends kept meeting up. Somewhere in that, an idea
              turned into a plan: throw the kind of party Nina would have loved, and
              give every dollar to a family who was living the part they had just
              watched up close.
            </p>
            <p>
              In <strong className="text-ink font-semibold">June 2019</strong>, they
              held the first event in her honor. One night. Over{" "}
              <strong className="text-ink font-semibold">$8,000</strong> raised. All of
              it handed to a family who needed it.
            </p>
            <blockquote className="border-l-4 border-gold-bright pl-5 font-display text-2xl italic text-ink leading-snug my-2">
              We&apos;re not a big foundation. We&apos;re her friends, and we throw one
              hell of a party for a reason.
            </blockquote>
            <p>
              That night became an organization. Since {site.founded}, the Nina Mastro
              Organization has raised and given away more than{" "}
              <strong className="text-ink font-semibold">$95,000</strong> and stood
              behind <strong className="text-ink font-semibold">21 families</strong>.
              The model hasn&apos;t changed: friends, a neighborhood, a band, a room
              full of raffle baskets — and one family who wakes up carrying a little
              less.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-28">
            <Photo alt="Nina" label="Nina — a photo the family loves" ratio="4/5" />
            <Card className="flex flex-col gap-2">
              <Eyebrow tone="plum">The short version</Eyebrow>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-[15.5px] text-ink-soft">
                <li>
                  <strong className="text-ink font-semibold tabular">2015</strong> —
                  Nina is diagnosed with pancreatic cancer.
                </li>
                <li>
                  <strong className="text-ink font-semibold tabular">2019</strong> —
                  Friends hold the first fundraiser. It raises $8,000+ in one night.
                </li>
                <li>
                  <strong className="text-ink font-semibold tabular">Today</strong> —
                  $95,000+ given to 21 families, one chosen every year.
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {namedBoard.length > 0 ? (
        <Section tone="band">
          <Container className="flex flex-col gap-10">
            <SectionHead
              eyebrow="The people behind it"
              title="Her friends, still showing up."
              lede="Nobody here draws a salary. This is what we do after work and on weekends."
            />
            <ul className="list-none p-0 m-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {namedBoard.map((member) => (
                <li key={member.name} className="flex flex-col gap-3">
                  <Photo
                    src={member.photo}
                    alt={clean(member.name)}
                    label={clean(member.role)}
                    ratio="1/1"
                  />
                  <div>
                    <h3 className="text-lg">{clean(member.name)}</h3>
                    <p className="text-[14px] uppercase tracking-[0.08em] text-gold font-semibold">
                      {member.role}
                    </p>
                  </div>
                  {member.bio ? (
                    <p className="text-[15px] text-muted leading-relaxed">{member.bio}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section tone="plum">
        <Container className="flex flex-col gap-6 items-start max-w-3xl">
          <h2 className="text-3xl sm:text-4xl text-paper">
            Nina would have told you to come to the party.
          </h2>
          <p className="text-lg text-paper/85 max-w-[50ch] leading-relaxed">
            So come to the party. Or give what you can. Or tell us about a family who
            needs us next.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button href="/give" variant="gold" size="lg">
              Donate
            </Button>
            <Button href="/events" variant="onPlum" size="lg">
              See our events
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
