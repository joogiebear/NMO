import Link from "next/link";
import { notFound } from "next/navigation";
import { Editor } from "@/components/admin/Editor";
import { toForm } from "@/lib/admin-forms";
import { getSection } from "@/lib/admin-schema";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/lib/content";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  await requireAdmin();
  const def = getSection((await params).section);
  if (!def) notFound();

  const initial = toForm(def.key, await getContent(def.key, { strict: true }));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Link
          href="/admin"
          className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted no-underline hover:text-orchid"
        >
          ← All sections
        </Link>
        <h1 className="text-4xl sm:text-5xl">{def.title}</h1>
        <p className="text-lg text-ink-soft">{def.blurb}</p>
        <a
          href={def.appearsOn.href}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-[15px] text-orchid underline hover:text-gold-bright"
        >
          See it on the {def.appearsOn.label} ↗
        </a>
      </header>
      <Editor sectionKey={def.key} initial={initial} />
    </div>
  );
}
