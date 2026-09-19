import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/forms";
import { adminConfigured, isAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">Site admin</p>
      <h1 className="text-4xl sm:text-5xl">Sign in to update the site.</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="text-ink-soft leading-relaxed">
          The admin isn&apos;t switched on yet. Whoever looks after the site needs to set{" "}
          <code className="font-mono text-[14px] text-orchid">ADMIN_PASSWORD</code> and{" "}
          <code className="font-mono text-[14px] text-orchid">ADMIN_SESSION_SECRET</code> on the
          server.
        </p>
      )}
    </div>
  );
}
