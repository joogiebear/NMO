import type { Metadata } from "next";
import { Field, SubmitForm, TextArea } from "@/components/Form";
import { Card, Container, PageHeader, Section } from "@/components/ui";
import { site } from "@/content/site";
import { clean } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Nina Mastro Organization — a Chicago 501(c)(3) supporting families facing the financial burden of cancer.",
};

export default function ContactPage() {
  const email = clean(site.contact.email);
  const address = site.contact.mailingAddress.map(clean);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="There’s a person on the other end of this."
        lede={
          <>
            Questions about giving, an event, a nomination, or your company&apos;s
              matching form — write to us and one of us will answer.
          </>
        }
      />

      <Section tone="paper">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
          <Card tilt={false}>
            <SubmitForm
              kind="message"
              submitLabel="Send message"
              successMessage="Thanks for writing. We'll get back to you as soon as we can."
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
              <Field label="What's this about?" name="subject" />
              <TextArea label="Your message" name="message" required rows={7} />
            </SubmitForm>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-2">
              <h2 className="text-xl">Email</h2>
              <a
                href={`mailto:${email}`}
                className="text-orchid font-semibold break-all no-underline hover:text-gold"
              >
                {email}
              </a>
            </Card>
            <Card className="flex flex-col gap-2">
              <h2 className="text-xl">Mail a check</h2>
              <address className="not-italic text-ink-soft leading-relaxed">
                {address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </Card>
            <Card className="flex flex-col gap-2">
              <h2 className="text-xl">Charity details</h2>
              <p className="text-ink-soft leading-relaxed">
                {site.name} is a registered 501(c)(3) non-profit organization in{" "}
                {site.city}.
              </p>
              <p className="text-ink-soft">
                EIN <span className="tabular font-semibold">{site.ein}</span>
              </p>
            </Card>
            {site.social.facebook ? (
              <Card className="flex flex-col gap-2">
                <h2 className="text-xl">Follow along</h2>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orchid font-semibold no-underline hover:text-gold"
                >
                  Facebook
                </a>
              </Card>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
