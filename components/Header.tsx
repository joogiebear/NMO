"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button, Container } from "./ui";
import { site } from "@/content/site";
import { hasStore } from "@/lib/format";

const links = [
  { href: "/story", label: "Our Story" },
  { href: "/recipients", label: "Families We've Helped" },
  { href: "/events", label: "Events" },
  { href: "/get-involved", label: "Get Involved" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const storeUrl = hasStore(site.store.url) ? site.store.url : null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-ground/60 backdrop-blur-xl backdrop-saturate-150 border-b border-line/70">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline text-ink min-w-0"
        >
          <span
            aria-hidden="true"
            className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-orchid to-plum text-paper font-display italic text-lg font-bold shrink-0 shadow-glow-orchid"
          >
            N
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[15px] sm:text-[17px] font-semibold tracking-tight leading-[1.15]">
              Nina Mastro Organization
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted whitespace-nowrap">
              Chicago · 501(c)(3)
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden lg:flex items-center gap-8 font-mono text-[12.5px] uppercase tracking-[0.14em]"
        >
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`no-underline font-medium border-b pb-1 transition-colors duration-300 ${
                  active
                    ? "text-orchid border-gold-bright"
                    : "text-ink-soft border-transparent hover:text-ink hover:border-gold-bright"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {storeUrl ? (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline font-medium border-b-2 border-transparent pb-0.5 text-ink-soft hover:text-ink hover:border-gold-bright"
            >
              {site.store.label}
            </a>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/give" variant="gold" className="px-4 sm:px-5">
            Donate
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="lg:hidden grid place-items-center w-11 h-11 rounded-full border-2 border-line-strong text-ink"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-nav"
          className="lg:hidden overflow-hidden border-t border-line bg-ground/95 backdrop-blur-xl"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Container className="flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="no-underline text-ink font-display text-2xl py-3.5 border-b border-line last:border-0"
              >
                {l.label}
              </Link>
            ))}
            {storeUrl ? (
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-ink font-display text-2xl py-3.5 border-b border-line"
              >
                {site.store.label}
              </a>
            ) : null}
            <Link
              href="/contact"
              className="no-underline text-ink font-display text-2xl py-3.5"
            >
              Contact
            </Link>
          </Container>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </header>
  );
}
