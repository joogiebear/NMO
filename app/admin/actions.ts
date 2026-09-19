"use server";

import { redirect } from "next/navigation";
import { fromForm } from "@/lib/admin-forms";
import { getSection, sanitize } from "@/lib/admin-schema";
import {
  allowLoginAttempt,
  clearLoginAttempts,
  endSession,
  passwordMatches,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getContent, getHistoryVersion, saveContent, type ContentMap } from "@/lib/content";
import { setHandled } from "@/lib/inbox";

export type ActionResult = { ok: boolean; message: string };

export async function login(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!(await allowLoginAttempt())) {
    return { ok: false, message: "Too many tries. Wait fifteen minutes and try again." };
  }
  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    return { ok: false, message: "That password isn’t right." };
  }
  await clearLoginAttempts();
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export async function saveSection(key: string, payload: unknown): Promise<ActionResult> {
  await requireAdmin();
  const def = getSection(key);
  if (!def) return { ok: false, message: "Unknown section." };

  const cleaned = sanitize(def, payload);
  if (!cleaned.ok) return { ok: false, message: cleaned.error };

  try {
    await saveContent(def.key, fromForm(def.key, cleaned.value), `Edited “${def.title}”`);
    return { ok: true, message: "Saved. It’s live on the site now." };
  } catch (err) {
    console.error("[admin] save failed:", err);
    return { ok: false, message: "Couldn’t save just now. Nothing was changed — try again." };
  }
}

/** The event-night shortcut: change one number without opening the full form. */
export async function setRaised(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const raised = Math.round(Number(String(formData.get("raised") ?? "").replace(/[^\d.]/g, "")));
  if (!Number.isFinite(raised) || raised < 0) {
    return { ok: false, message: "Enter the total as a number, like 12400." };
  }
  try {
    const campaign = await getContent("campaign", { strict: true });
    await saveContent("campaign", { ...campaign, raised }, `Total raised set to $${raised.toLocaleString("en-US")}`);
    return { ok: true, message: `Updated to $${raised.toLocaleString("en-US")}. It’s live now.` };
  } catch (err) {
    console.error("[admin] setRaised failed:", err);
    return { ok: false, message: "Couldn’t save just now. Try again." };
  }
}

export async function markSubmission(formData: FormData): Promise<void> {
  await requireAdmin();
  await setHandled(Number(formData.get("id")), formData.get("handled") === "true");
  revalidatePath("/admin/inbox");
}

export async function restoreVersion(formData: FormData): Promise<void> {
  await requireAdmin();
  const version = await getHistoryVersion(Number(formData.get("id")));
  if (!version) return;
  const def = getSection(version.key);
  await saveContent(
    version.key,
    version.data as ContentMap[typeof version.key],
    `Restored an earlier version of “${def?.title ?? version.key}”`,
  );
  redirect("/admin?restored=1");
}
