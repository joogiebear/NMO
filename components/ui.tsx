import Link from "next/link";
import type { ReactNode } from "react";

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
  const tones = {
    paper: "bg-paper text-ink",
    band: "bg-band text-ink",
    plum: "bg-plum text-paper",
    wash: "warm-wash text-ink",
  };
  return (
    <section
      id={id}
      className={`${tones[tone]} py-16 sm:py-20 lg:py-28 ${className}`}
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
    plum: "text-plum",
    paper: "text-paper/80",
  };
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.16em] ${tones[tone]}`}
    >
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
      className={`flex flex-col gap-4 max-w-2xl ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.9rem]">{title}</h2>
      {lede ? (
        <p
          className={`text-lg leading-relaxed ${tone === "paper" ? "text-paper/85" : "text-ink-soft"}`}
        >
          {lede}
        </p>
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
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold no-underline transition-[transform,background-color,border-color,color] duration-150 hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed";

const buttonVariants = {
  primary: "bg-plum text-paper shadow-soft hover:bg-plum-deep",
  gold: "bg-gold-bright text-plum-deep shadow-soft hover:bg-gold hover:text-paper",
  ghost: "border-2 border-line-strong text-ink hover:border-plum hover:text-plum",
  onPlum: "border-2 border-paper/45 text-paper hover:bg-paper hover:text-plum",
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

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          className={classes}
          href={href}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card border border-line rounded-2xl p-6 sm:p-7 shadow-soft ${className}`}
    >
      {children}
    </div>
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
        className={`flex flex-col justify-end gap-2.5 p-8 bg-[linear-gradient(200deg,#E2CFEC_0%,#F6DFB6_56%,#EADFD4_100%)] ${className}`}
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
