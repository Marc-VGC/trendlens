import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { planQuestion, writeNarrative, type Usage } from "@/lib/ai";
import { countRecentReports, insertReport } from "@/lib/db";
import { sanitizePlan } from "@/lib/plan";
import { analystInput, statsForReport } from "@/lib/report";
import type { SeriesByIndicator } from "@/lib/types";
import { questionSchema } from "@/lib/validation";
import { verifyNarrative } from "@/lib/verify";
import { fetchSeries } from "@/lib/worldbank";

export const runtime = "nodejs";
export const maxDuration = 60;

const DAILY_LIMIT = Number(process.env.DAILY_REPORT_LIMIT ?? 15) || 15;

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const started = Date.now();
  const { userId } = await auth();
  if (!userId) return fail(401, "Please sign in first.");

  const body = questionSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return fail(400, body.error.issues[0]?.message ?? "Invalid question.");
  const { question } = body.data;

  try {
    if ((await countRecentReports(userId)) >= DAILY_LIMIT) {
      return fail(429, `Daily limit reached (${DAILY_LIMIT} reports per 24 hours). Try Explore, which has no limit.`);
    }
  } catch (e) {
    console.error("[ask] quota check failed", e);
    return fail(500, "Server is not configured correctly.");
  }

  let usage: Usage = { inputTokens: 0, outputTokens: 0 };

  // 1. AI planner → 2. sanitize in code
  let planned;
  try {
    planned = await planQuestion(question, usage);
    usage = planned.usage;
  } catch (e) {
    console.error("[ask] planner failed", e);
    return fail(502, "The AI couldn't plan this question. Please try again.");
  }
  const sanitized = sanitizePlan(planned.plan, new Date());
  if (!sanitized.ok) return fail(400, sanitized.message);
  const plan = sanitized.plan;

  // 3. Real data from the World Bank
  const series: SeriesByIndicator = {};
  try {
    const results = await Promise.all(
      plan.indicators.map((code) => fetchSeries(plan.countries, code, plan.startYear, plan.endYear)),
    );
    plan.indicators.forEach((code, i) => (series[code] = results[i]));
  } catch (e) {
    console.error("[ask] world bank failed", e);
    return fail(502, "The World Bank data service didn't respond. Please try again in a minute.");
  }

  // 4. Deterministic stats → 5. AI narrative from stats only → 6. verify
  const stats = statsForReport(plan, series);
  const facts = analystInput(plan, stats);
  let narrative = null;
  try {
    const written = await writeNarrative(question, facts, usage);
    narrative = written.narrative;
    usage = written.usage;
  } catch (e) {
    // The report is still useful without a narrative: charts + stats.
    console.error("[ask] analyst failed", e);
  }
  const verification = narrative
    ? verifyNarrative(narrative, facts, { start: plan.startYear, end: plan.endYear })
    : null;

  try {
    const id = await insertReport(userId, {
      question,
      plan,
      series,
      narrative,
      retrievedAt: new Date().toISOString(),
    });
    console.log(
      `[ask] user=${userId} ms=${Date.now() - started} inputTokens=${usage.inputTokens} outputTokens=${usage.outputTokens} indicators=${plan.indicators.join("|")} countries=${plan.countries.join("|")} verified=${verification?.rate ?? "n/a"}`,
    );
    return NextResponse.json({ id });
  } catch (e) {
    console.error("[ask] insert failed", e);
    return fail(500, "The report was created but couldn't be saved. Please try again.");
  }
}
