import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site admin",
  robots: { index: false, follow: false },
};

// Never prerender: at build time there is no password and no cookie, and the
// "switched off" state would be frozen into static HTML.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl mx-auto w-[92%] py-12 sm:py-16">{children}</div>;
}
