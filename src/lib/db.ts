import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ReportData } from "./report";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client (service-role key). RLS is enabled with no
 * policies, so the public anon key can't read or write anything.
 */
function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export interface ReportRow extends ReportData {
  id: string;
  title: string;
  createdAt: string;
}

export async function countRecentReports(userId: string, sinceMs = 86_400_000): Promise<number> {
  const { count, error } = await db()
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - sinceMs).toISOString());
  if (error) throw error;
  return count ?? 0;
}

export async function insertReport(userId: string, r: ReportData): Promise<string> {
  const { data, error } = await db()
    .from("reports")
    .insert({
      user_id: userId,
      question: r.question,
      title: r.plan.title,
      plan: r.plan,
      series: r.series,
      narrative: r.narrative,
      retrieved_at: r.retrievedAt,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

type Row = {
  id: string;
  question: string;
  title: string;
  plan: ReportData["plan"];
  series: ReportData["series"];
  narrative: ReportData["narrative"];
  retrieved_at: string;
  created_at: string;
};

const toReport = (r: Row): ReportRow => ({
  id: r.id,
  title: r.title,
  question: r.question,
  plan: r.plan,
  series: r.series,
  narrative: r.narrative,
  retrievedAt: r.retrieved_at,
  createdAt: r.created_at,
});

/** Public by link: anyone with the UUID can view a report. */
export async function getReport(id: string): Promise<(ReportRow & { userId: string }) | null> {
  const { data, error } = await db().from("reports").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...toReport(data as Row), userId: (data as { user_id: string }).user_id };
}

export async function listReports(userId: string) {
  const { data, error } = await db()
    .from("reports")
    .select("id,title,question,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as { id: string; title: string; question: string; created_at: string }[];
}

export async function deleteReport(userId: string, id: string): Promise<void> {
  const { error } = await db().from("reports").delete().eq("user_id", userId).eq("id", id);
  if (error) throw error;
}
