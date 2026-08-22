import Link from "next/link";
import { Container } from "./ui";
import { site } from "@/content/site";
import { hasStore } from "@/lib/format";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/story", label: "Nina's Story" },
      { href: "/recipients", label: "Families We've Helped" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/give", label: "Donate" },
      { href: "/get-involved#nominate", label: "Nominate a family" },
      { href: "/get-involved#volunteer", label: "Volunteer" },
      { href: "/get-involved#sponsor", label: "Sponsor an event" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const email = site.contact.email.replace("TODO_", "");
  const storeUrl = hasStore(site.store.url) ? site.store.url : null;

  return (
    <footer className="bg-plum-deep text-paper">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid place-items-center w-10 h-10 rounded-full bg-gold-bright text-plum-deep font-display text-lg font-semibold"
              >
                N
              </span>
              <span className="font-display text-lg font-semibold">
                Nina Mastro Organization
              </span>
            </div>
            <p className="text-paper/75 text-[15px] max-w-[34ch] leading-relaxed">
              Raising money in honor of our friend Nina, and handing it
              directly to a family fighting cancer.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-paper/60 mb-4">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="no-underline text-paper/85 hover:text-gold-bright text-[15px]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                {col.title === "Help" && storeUrl ? (
                  <li>
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline text-paper/85 hover:text-gold-bright text-[15px]"
                    >
                      {site.store.label}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-paper/60 mb-4">
              Reach us
            </h3>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-[15px] text-paper/85">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="no-underline text-paper/85 hover:text-gold-bright break-all"
                >
                  {email}
                </a>
              </li>
              {site.social.facebook ? (
                <li>
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline text-paper/85 hover:text-gold-bright"
                  >
                    Facebook
                  </a>
                </li>
              ) : null}
              {site.social.instagram ? (
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline text-paper/85 hover:text-gold-bright"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
              <li>{site.city}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/15 flex flex-wrap gap-x-6 gap-y-2 justify-between text-[13px] text-paper/60">
          <span>
            © {year} {site.name}. A registered 501(c)(3) non-profit · EIN{" "}
            <span className="tabular">{site.ein}</span>
          </span>
          <span>Donations are tax-deductible. Receipts on request.</span>
        </div>
      </Container>
    </footer>
  );
}
