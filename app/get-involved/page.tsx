import type { Metadata } from "next";
import { CheckboxGroup, Field, SubmitForm, TextArea } from "@/components/Form";
import { Card, Container, PageHeader, Section, SectionHead } from "@/components/ui";
import { site, volunteerRoles } from "@/content/site";
import { clean } from "@/lib/format";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Nominate a family, volunteer at an event, or sponsor as a local business. Three ways to help the Nina Mastro Organization that don't all involve writing a check.",
};

const jump = [
  { href: "#nominate", label: "Nominate a family" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "#sponsor", label: "Sponsor as a business" },
];

export default function GetInvolvedPage() {
  const email = clean(site.contact.email);

  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="You don’t have to know us to help us."
        lede={
          <>
            Most of the people who work our events had never met Nina. They came
              once, liked the room, and kept coming back. Here&apos;s where to start.
          </>
        }
      >
        <ul className="list-none p-0 m-0 flex flex-wrap gap-3 pt-2">
          {jump.map((j) => (
            <li key={j.href}>
              <a
                href={j.href}
                className="inline-block rounded-full border-2 border-line-strong px-5 py-2 text-[15px] font-semibold no-underline text-ink hover:border-plum hover:text-orchid"
              >
                {j.label}
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      {/* ------------------------------------------------------------ nominate */}
      <Section tone="paper" id="nominate">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <SectionHead
              eyebrow="Nominate a family"
              title="Tell us who needs us next."
              lede="Anyone can nominate — you don't need a connection to us, and the family doesn't need to know you did it."
            />
            <Card className="flex flex-col gap-3">
              <h3 className="text-lg">What helps us most</h3>
              <p className="text-[15.5px] text-ink-soft leading-relaxed">
                Give us the full picture of the financial need: what the diagnosis is,
                what treatment looks like, what it&apos;s costing them, and what
                you&apos;ve seen it do to their day-to-day. The board reads every
                nomination, and honestly, the detailed ones are the ones we can act on.
              </p>
              <p className="text-[15.5px] text-muted leading-relaxed">
                We choose one recipient per year, so not every nomination can be
                approved. We&apos;re sorry in advance for that — it&apos;s the hardest
                part of this.
              </p>
            </Card>
          </div>

          <Card tilt={false}>
            <SubmitForm
              kind="nomination"
              submitLabel="Submit nomination"
              successMessage="Your nomination is with the board. We read every one, and we'll be in touch if we need more detail."
              fallbackEmail={email}
            >
              <Field label="Your name" name="your_name" required autoComplete="name" />
              <Field
                label="Your email"
                name="email"
                type="email"
                required
                autoComplete="email"
                hint="So we can come back to you with questions."
              />
              <Field label="Your phone" name="phone" type="tel" autoComplete="tel" />
              <Field label="Who are you nominating?" name="nominee" required />
              <Field
                label="How do you know them?"
                name="relationship"
                placeholder="Neighbor, coworker, sister-in-law…"
              />
              <Field label="Their diagnosis" name="diagnosis" />
              <TextArea
                label="Tell us their story"
                name="story"
                required
                rows={7}
                hint="What are they facing, and what is it costing them? Write it the way you'd tell a friend."
              />
              <TextArea
                label="Anything else we should know"
                name="notes"
                rows={3}
              />
            </SubmitForm>
          </Card>
        </Container>
      </Section>

      {/* ----------------------------------------------------------- volunteer */}
      <Section tone="band" id="volunteer">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <SectionHead
              eyebrow="Volunteer"
              title="An afternoon of your time goes a long way."
              lede="No experience, no commitment, no meetings. Turn up, we'll tell you where to stand."
            />
          </div>
          <Card tilt={false}>
            <SubmitForm
              kind="volunteer"
              submitLabel="Count me in"
              successMessage="Perfect — we'll email you before the next event with the details."
              fallbackEmail={email}
            >
              <Field label="Your name" name="your_name" required autoComplete="name" />
              <Field
                label="Your email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
              <Field label="Your phone" name="phone" type="tel" autoComplete="tel" />
              <CheckboxGroup
                legend="What sounds like you?"
                name="roles"
                options={volunteerRoles}
              />
              <TextArea
                label="Anything you'd rather do, or need us to know"
                name="notes"
                rows={3}
              />
            </SubmitForm>
          </Card>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- sponsor */}
      <Section tone="paper" id="sponsor">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 items-start">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <SectionHead
              eyebrow="Sponsor"
              title="Local businesses keep this thing running."
              lede="A banner at the block party, your logo on the flyer, your name said out loud between sets — and a family that gets the benefit."
            />
            <Card className="flex flex-col gap-2">
              <h3 className="text-lg">Not a business?</h3>
              <p className="text-[15.5px] text-ink-soft leading-relaxed">
                Families and individuals sponsor too, and donating a raffle basket is
                one of the most useful things anyone does for us. Use this form for
                that as well.
              </p>
            </Card>
          </div>
          <Card tilt={false}>
            <SubmitForm
              kind="sponsor"
              submitLabel="Talk to us about sponsoring"
              successMessage="Thank you — someone will be in touch this week to sort out the details."
              fallbackEmail={email}
            >
              <Field label="Your name" name="your_name" required autoComplete="name" />
              <Field label="Business or family name" name="organization" />
              <Field
                label="Your email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
              <Field label="Your phone" name="phone" type="tel" autoComplete="tel" />
              <Field
                label="What are you thinking?"
                name="interest"
                placeholder="Champion, Supporter, Friend, a raffle basket, something else…"
              />
              <TextArea label="Anything else" name="notes" rows={4} />
            </SubmitForm>
          </Card>
        </Container>
      </Section>
    </>
  );
}
