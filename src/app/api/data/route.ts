import { NextResponse } from "next/server";
import { computeStats } from "@/lib/stats";
import { dataQuerySchema } from "@/lib/validation";
import { fetchSeries } from "@/lib/worldbank";

export const runtime = "nodejs";

/** Public, no AI: World Bank data + computed stats for the Explore page. */
export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = dataQuerySchema(new Date()).safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid query." }, { status: 400 });
  }
  const { countries, indicator, start, end } = parsed.data;
  try {
    const series = await fetchSeries(countries, indicator, start, end);
    return NextResponse.json(
      { series, stats: computeStats(series, countries) },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (e) {
    console.error("[data] world bank failed", e);
    return NextResponse.json({ error: "The World Bank data service didn't respond. Please try again." }, { status: 502 });
  }
}
