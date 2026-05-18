"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guard";
import type { ReportStatus } from "@/lib/types";

/** Moderator/admin decision on a queue item. RBAC enforced server-side. */
export async function decideModeration(
  id: string,
  decision: Extract<ReportStatus, "approved" | "rejected">
): Promise<{ ok: boolean; message: string }> {
  const actor = await requireRole("moderator", "/admin/moderation");

  if (!hasSupabaseEnv())
    return { ok: true, message: `Item ${decision} (demo).` };

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("moderation_queue")
    .update({ status: decision, assigned_to: actor.id })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  await supabase.rpc("log_audit", {
    p_action: `moderation.${decision}`,
    p_target: `moderation_queue:${id}`,
    p_meta: {},
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/moderator/queue");
  return { ok: true, message: `Item ${decision}.` };
}
