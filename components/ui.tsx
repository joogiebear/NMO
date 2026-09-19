import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic, Reveal, RevealText, TiltCard } from "@/components/motion";

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const width =
    size === "narrow" ? "max-w-3xl" : size === "wide" ? "max-w-7xl" : "max-w-6xl";
  return <div className={`${width} mx-auto w-[92%] ${className}`}>{children}</div>;
}

export function Section({
  children,
  id,
  tone = "paper",
  className = "",
}: {
  children: ReactNode;
  id?: string;
  tone?: "paper" | "band" | "plum" | "wash";
  className?: string;
}) {
  // Sections no longer paint a flat ground of their own. Each one names the
  // colour the *page* should settle on while it has focus, and GroundShift
  // cross-fades the body to it.
  const tones = {
    paper: "text-ink",
    band: "text-ink border-y border-line/60",
    plum: "warm-wash text-paper",
    wash: "warm-wash text-ink",
  };
  const grounds = {
    paper: "#0D0812",
    band: "#1A0D26",
    plum: "#2B1247",
    wash: "#120A18",
  };
  return (
    <section
      id={id}
      data-ground={grounds[tone]}
      className={`relative ${tones[tone]} py-20 sm:py-24 lg:py-36 ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "plum" | "paper";
}) {
  const tones = {
    gold: "text-gold",
    plum: "text-orchid",
    paper: "text-paper/80",
  };
  return (
    <p
      className={`font-mono text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] flex items-center gap-3 ${tones[tone]}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  tone = "gold",
  center = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  tone?: "gold" | "plum" | "paper";
  center?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-5 max-w-3xl ${center ? "mx-auto text-center items-center" : ""}`}
    >
      {eyebrow ? (
        <Reveal y={16}>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <h2 className="text-[2.4rem] sm:text-5xl lg:text-[4rem]">
        <RevealText text={title} />
      </h2>
      {lede ? (
        <Reveal delay={0.15} y={24}>
          <p
            className={`text-lg leading-relaxed max-w-[58ch] ${tone === "paper" ? "text-paper/85" : "text-ink-soft"}`}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "gold" | "ghost" | "onPlum";
  size?: "md" | "lg";
  className?: string;
  disabled?: boolean;
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold no-underline transition-[background-color,border-color,color,box-shadow] duration-300 disabled:opacity-60 disabled:cursor-not-allowed";

const buttonVariants = {
  primary: "bg-plum text-paper shadow-soft hover:bg-[#8345C4] hover:shadow-glow-orchid",
  gold: "bg-gold-bright text-plum-deep shadow-soft hover:bg-[#FFD68A] hover:shadow-glow-gold",
  ghost: "border border-line-strong text-ink hover:border-orchid hover:text-orchid hover:shadow-glow-orchid",
  onPlum: "border border-paper/45 text-paper hover:bg-paper hover:text-plum-deep",
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled,
}: ButtonProps) {
  const sizing = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-[15px]";
  const classes = `${buttonBase} ${buttonVariants[variant]} ${sizing} ${className}`;

  const external = href?.startsWith("http") || href?.startsWith("mailto:");
  const control = !href ? (
    <button className={classes} type={type} disabled={disabled}>
      {children}
    </button>
  ) : external ? (
    <a
      className={classes}
      href={href}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  ) : (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );

  return <Magnetic className="shrink-0">{control}</Magnetic>;
}

export function Card({
  children,
  className = "",
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  /** Turn the lean off for cards people type into; the cursor light stays. */
  tilt?: boolean;
}) {
  return (
    <TiltCard
      tilt={tilt}
      className={`bg-card/80 backdrop-blur-sm border border-line rounded-3xl p-6 sm:p-8 shadow-soft ${className}`}
    >
      {children}
    </TiltCard>
  );
}

/**
 * The opening of every page except home: drifting light, a mono eyebrow, and
 * a headline that rises in word by word. `children` sits under the lede —
 * trust bullets on /give, jump links on /get-involved.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      data-ground="#120A18"
      className="relative overflow-hidden grain border-b border-line"
    >
      <div aria-hidden="true" className="aurora" />
      <div aria-hidden="true" className="halftone absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <Container className="relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="flex flex-col gap-6 max-w-4xl">
          <Reveal y={16}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <h1 className="text-[2.9rem] sm:text-6xl lg:text-[5.4rem] leading-[0.96] tracking-[-0.04em]">
            <RevealText text={title} delay={0.1} />
          </h1>
          {lede ? (
            <Reveal delay={0.35} y={24}>
              <p className="text-lg sm:text-xl text-ink-soft leading-relaxed max-w-[54ch]">
                {lede}
              </p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal delay={0.5} y={20}>
              {children}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/**
 * Stands in for a real photograph until one is dropped into /public.
 * If `src` is set it renders the actual image instead.
 */
export function Photo({
  src,
  alt,
  label,
  ratio = "4/5",
  className = "",
  priority = false,
  variant = "slot",
  fill = false,
}: {
  src?: string;
  alt: string;
  label?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  /** "slot" is the dashed placeholder; "panel" is a full-bleed field. */
  variant?: "slot" | "panel";
  /** Fill the parent instead of holding an aspect ratio. */
  fill?: boolean;
}) {
  const sizing = fill
    ? { width: "100%", height: "100%" }
    : { aspectRatio: ratio };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`w-full h-full object-cover ${variant === "slot" ? "rounded-2xl" : ""} ${className}`}
        style={sizing}
      />
    );
  }

  if (variant === "panel") {
    return (
      <div
        className={`flex flex-col justify-end gap-2.5 p-8 bg-[linear-gradient(200deg,#3A1D57_0%,#5A2E4A_52%,#2A1609_100%)] ${className}`}
        style={sizing}
        role="img"
        aria-label={`Photo placeholder: ${alt}`}
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
          aria-hidden="true"
          className="text-muted/70"
        >
          <rect x="2.5" y="5" width="19" height="14.5" rx="2" />
          <circle cx="12" cy="12.2" r="3.6" />
          <path d="M8 5l1.4-2.2h5.2L16 5" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Photo
        </span>
        <span className="text-sm text-muted leading-snug max-w-[34ch]">
          {label ?? alt}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`photo-slot rounded-2xl border border-dashed border-line-strong flex flex-col justify-end gap-1 p-5 ${className}`}
      style={sizing}
      role="img"
      aria-label={`Photo placeholder: ${alt}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        Photo slot
      </span>
      <span className="text-sm text-muted leading-snug">{label ?? alt}</span>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 text-[17.5px] leading-relaxed text-ink-soft max-w-[62ch] [&_strong]:text-ink [&_strong]:font-semibold">
      {children}
    </div>
  );
}
