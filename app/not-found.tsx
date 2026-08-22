import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="warm-wash">
      <Container className="py-24 sm:py-32 flex flex-col gap-5 items-start max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Page not found
        </p>
        <h1 className="text-4xl sm:text-5xl">
          We can&apos;t find that one.
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">
          The page may have moved. Try the home page, or head straight to the part
          most people are looking for.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button href="/" variant="primary" size="lg">
            Back to the home page
          </Button>
          <Button href="/give" variant="ghost" size="lg">
            Ways to give
          </Button>
        </div>
      </Container>
    </section>
  );
}
