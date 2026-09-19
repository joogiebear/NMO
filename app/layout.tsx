import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GroundShift, MotionProvider, ScrollProgress } from "@/components/motion";
import { site } from "@/content/site";
import { getSite } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

/**
 * Fonts are linked rather than bundled through next/font so the site builds in
 * environments without outbound access to Google Fonts. To self-host them
 * instead, drop the .woff2 files into /public/fonts and swap this for
 * next/font/local — see README.md.
 */
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Contact details, social links and the shop link are edited in /admin.
  const live = await getSite();
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.name,
    alternateName: site.shortName,
    url: siteUrl,
    description: site.description,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chicago",
      addressRegion: "IL",
      addressCountry: "US",
    },
    sameAs: [live.social.facebook, live.social.instagram].filter(Boolean),
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_CSS} />
        <meta name="theme-color" content="#0D0812" />
        {/* Reveals start hidden and are shown by script; without script, show them. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-3 focus:left-3 focus:bg-plum focus:text-paper focus:px-5 focus:py-3 focus:rounded-full focus:no-underline"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ScrollProgress />
          <GroundShift />
          <Header store={{ url: live.store.url, label: live.store.label }} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
