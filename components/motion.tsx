"use client";

/**
 * Every moving part of the site lives here, as thin client wrappers around
 * server-rendered children. Pages and components/ui.tsx stay server components;
 * only these leaves hydrate.
 *
 * Reduced motion: <MotionProvider> sets reducedMotion="user", which drops the
 * transform half of every declarative animation. The pointer- and scroll-driven
 * effects (parallax, magnetic, tilt) are not "animations" as far as Motion is
 * concerned, so they check the preference themselves.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/* ------------------------------------------------------------------ reveal */

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
}) {
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline reveal: each word rises out of its own mask, staggered. The full
 * string is kept for screen readers; the animated words are decorative.
 */
export function RevealText({
  text,
  className = "",
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className={className}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] pr-[0.06em] -mr-[0.06em]"
          >
            <motion.span
              className="reveal inline-block will-change-transform"
              variants={{
                hidden: { y: "110%", opacity: 0, rotate: 4 },
                shown: { y: "0%", opacity: 1, rotate: 0 },
              }}
              transition={{ duration: 1.05, ease: EASE }}
            >
              {word}
            </motion.span>
            {/* inline-blocks swallow the space between words; put it back */}
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </>
  );
}

/* ---------------------------------------------------------------- parallax */

const SceneProgress = createContext<MotionValue<number> | null>(null);

/** How much of the requested travel a layer actually gets on this device. */
function useParallaxScale() {
  const reduced = useReducedMotion();
  const scale = useRef(0);
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)");
    const update = () => {
      scale.current = reduced ? 0 : narrow.matches ? 0.4 : 1;
    };
    update();
    narrow.addEventListener("change", update);
    return () => narrow.removeEventListener("change", update);
  }, [reduced]);
  return scale;
}

export function ParallaxScene({
  children,
  className = "",
  ground,
}: {
  children: ReactNode;
  className?: string;
  /** Page colour to settle on while this scene has focus — see GroundShift. */
  ground?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  return (
    <section ref={ref} className={className} data-ground={ground}>
      <SceneProgress.Provider value={scrollYProgress}>
        {children}
      </SceneProgress.Provider>
    </section>
  );
}

/**
 * One plane of a ParallaxScene. `speed` is the distance in px the plane has
 * travelled by the time the scene has scrolled away: positive lags behind the
 * scroll (reads as further away), negative runs ahead of it (reads as closer).
 */
export function ParallaxLayer({
  children,
  className = "",
  speed = 0,
  scaleTo = 1,
  fadeTo = 1,
}: {
  children?: ReactNode;
  className?: string;
  speed?: number;
  scaleTo?: number;
  fadeTo?: number;
}) {
  const fallback = useMotionValue(0);
  const progress = useContext(SceneProgress) ?? fallback;
  const amount = useParallaxScale();
  const y = useTransform(progress, (p) => p * speed * amount.current);
  const scale = useTransform(
    progress,
    (p) => 1 + (scaleTo - 1) * p * (amount.current ? 1 : 0),
  );
  // The fade belongs to the desktop scene, where the whole hero leaves at
  // once. On a phone the hero is several screens tall and people are still
  // reading it at p = 0.5, so it holds until late and only on full-travel devices.
  const opacity = useTransform(progress, (p) => {
    const late = Math.max(0, (p - 0.45) / 0.55);
    return 1 + (fadeTo - 1) * late * (amount.current === 1 ? 1 : 0);
  });
  return (
    <motion.div className={className} style={{ y, scale, opacity }}>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- magnetic */

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 };

/** Pulls its child toward the cursor while the cursor is over it. */
export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (box.left + box.width / 2)) * strength);
    y.set((e.clientY - (box.top + box.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.span>
  );
}

/* -------------------------------------------------------------------- tilt */

const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.5 };
const MAX_TILT = 6;

/**
 * A surface that leans toward the cursor and is lit from wherever the cursor
 * is. The light is CSS (.glow-card in globals.css) fed by --mx / --my.
 */
export function TiltCard({
  children,
  className = "",
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const box = el.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width;
    const py = (e.clientY - box.top) / box.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (!tilt || reduced) return;
    rotateY.set((px - 0.5) * 2 * MAX_TILT);
    rotateX.set((0.5 - py) * 2 * MAX_TILT);
  }
  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className={`glow-card ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- count up */

/** Counts the numeric part of a value like "$95,000" or "21" up from zero. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)([\d,]+)(.*)$/);
    if (!inView || reduced || !match) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const controls = animate(0, target, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (n) =>
        setShown(`${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

/* -------------------------------------------------------------------- rail */

/**
 * A vertical line that draws itself as its contents scroll past — the spine of
 * the /recipients timeline. Children position their own nodes against it; the
 * rail sits at the container's left edge.
 */
export function ScrollRail({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-px bg-line-strong/60"
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-orchid via-gold-bright to-gold shadow-glow-gold"
        style={{ scaleY }}
      />
      {children}
    </div>
  );
}

/** A timeline node that lights up the first time it scrolls into view. */
export function RailNode({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`reveal block rounded-full bg-gold-bright shadow-glow-gold ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -30% 0px" }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    />
  );
}

/* ------------------------------------------------------------ page chrome */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-orchid via-gold-bright to-gold"
      style={{ scaleX }}
    />
  );
}

/**
 * Cross-fades the page ground as sections take focus. Any element carrying
 * data-ground="<colour>" claims the page while it crosses the middle of the
 * viewport; body's background-color transition does the rest.
 */
export function GroundShift() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const sections = document.querySelectorAll<HTMLElement>("[data-ground]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ground = (entry.target as HTMLElement).dataset.ground;
            if (ground) root.style.setProperty("--ground-live", ground);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      root.style.removeProperty("--ground-live");
    };
  }, [pathname]);
  return null;
}
