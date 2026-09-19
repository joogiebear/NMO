import { TiltCard } from "@/components/motion";
import { Button, Eyebrow, Photo } from "./ui";
import type { NmoEvent } from "@/content/events";
import { clean, eventDateParts, formatEventDate } from "@/lib/format";

/**
 * The next event gets the poster treatment; everything else stays a quiet
 * card. That contrast is what tells a first-time visitor where to go — if
 * every event shouts, none of them do.
 */
export function EventPoster({
  event,
  wide = false,
}: {
  event: NmoEvent;
  /** Set on a full-width row so the poster splits rather than leaving dead space. */
  wide?: boolean;
}) {
  const parts = eventDateParts(event.date);

  return (
    <article
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-[#4A2080] to-plum-deep border border-orchid/25 shadow-lift text-paper min-h-[440px] ${
        wide ? "lg:grid lg:grid-cols-[1fr_0.8fr]" : "flex flex-col"
      }`}
    >
      <div aria-hidden="true" className="halftone-light absolute inset-0" />

      <div className={wide ? "relative flex flex-col" : "contents"}>
      <div className="relative flex items-start justify-between gap-4 p-7 pb-0">
        {parts ? (
          <div className="flex flex-col items-center rounded-xl bg-gold-bright text-plum-deep px-4 py-2.5 min-w-[74px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
              {parts.month}
            </span>
            <span className="font-display text-[2.1rem] font-bold leading-none tabular">
              {parts.day}
            </span>
          </div>
        ) : (
          <span className="rounded-xl bg-gold-bright text-plum-deep px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em]">
            Date to be announced
          </span>
        )}
        {event.tagline ? (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/70 text-right pt-1.5 max-w-[14ch]">
            {event.tagline}
          </span>
        ) : null}
      </div>

      {!wide ? (
        <div
          aria-hidden="true"
          className="relative flex-grow min-h-[110px] flex items-center justify-center"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-paper/30"
          >
            <rect x="2.5" y="5" width="19" height="14.5" rx="2" />
            <circle cx="12" cy="12.2" r="3.6" />
            <path d="M8 5l1.4-2.2h5.2L16 5" />
          </svg>
        </div>
      ) : null}

      <div className="relative mt-auto p-7 flex flex-col gap-3">
        <h3 className="font-display text-[2.1rem] sm:text-[2.5rem] font-bold leading-[0.98] tracking-[-0.03em] text-paper">
          {event.name}
        </h3>
        <p className="text-[15px] text-paper/70">
          {clean(event.venue)}
          {event.address ? ` · ${clean(event.address)}` : ""}
        </p>
        <p className="text-paper/85 leading-relaxed max-w-[46ch]">
          {event.description}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          {event.ticketUrl ? (
            <Button href={event.ticketUrl} variant="gold">
              Get tickets
            </Button>
          ) : (
            <Button href="/get-involved#volunteer" variant="gold">
              Help run it
            </Button>
          )}
        </div>
      </div>
      </div>

      {wide ? (
        <div className="relative hidden lg:block">
          {event.photo ? (
            <Photo src={event.photo} alt={event.name} fill className="rounded-none" />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-end gap-2 p-7 bg-plum-deep/35">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-paper/45"
              >
                <rect x="2.5" y="5" width="19" height="14.5" rx="2" />
                <circle cx="12" cy="12.2" r="3.6" />
                <path d="M8 5l1.4-2.2h5.2L16 5" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
                Photo
              </span>
              <span className="text-sm text-paper/60 leading-snug max-w-[30ch]">
                A wide shot of the block, full. This is the slot that photo is for.
              </span>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}

/** Everything that isn't next. Quiet on purpose. */
export function EventCard({ event }: { event: NmoEvent }) {
  return (
    <TiltCard className="rounded-3xl h-full">
    <article className="rounded-3xl bg-card/80 backdrop-blur-sm border border-line overflow-hidden flex flex-col h-full">
      {event.photo ? (
        <Photo
          src={event.photo}
          alt={event.name}
          ratio="16/9"
          className="rounded-none"
        />
      ) : (
        <div className="halftone bg-gold-tint h-[168px] flex items-end p-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
            Photo · {event.name}
          </span>
        </div>
      )}
      <div className="p-6 flex flex-col gap-2.5 flex-grow">
        <Eyebrow>{formatEventDate(event.date)}</Eyebrow>
        <h3 className="text-2xl">{event.name}</h3>
        <p className="text-[15px] text-muted">
          {clean(event.venue)}
          {event.time ? ` · ${event.time}` : ""}
        </p>
        <p className="text-ink-soft leading-relaxed">{event.description}</p>
        <div className="mt-auto pt-3">
          {event.ticketUrl ? (
            <Button href={event.ticketUrl} variant="ghost">
              Get tickets
            </Button>
          ) : (
            <Button href="/get-involved#volunteer" variant="ghost">
              Help run it
            </Button>
          )}
        </div>
      </div>
    </article>
    </TiltCard>
  );
}
