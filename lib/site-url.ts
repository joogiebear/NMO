/**
 * The site's absolute base URL, used for canonical links, social cards,
 * the sitemap and robots.txt.
 *
 * Resolved in order of preference:
 *   1. NEXT_PUBLIC_SITE_URL   — set this once the real domain is live
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   3. VERCEL_URL             — this specific deployment (preview builds)
 *   4. the production domain  — local development and any other environment
 *
 * Environment variables are treated as missing when blank: Vercel supplies
 * declared-but-unset variables as empty strings, and `??` does not catch those.
 */
const FALLBACK_URL = "https://www.ninam.org";

function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function withProtocol(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl(): string {
  const candidate = firstNonEmpty(
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  );

  if (!candidate) return FALLBACK_URL;

  try {
    return new URL(withProtocol(candidate)).origin;
  } catch {
    return FALLBACK_URL;
  }
}

export const siteUrl = getSiteUrl();
