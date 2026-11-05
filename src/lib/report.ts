import { countryName } from "./countries";
import { getIndicator } from "./indicators";
import { computeStats, roundDeep, type IndicatorStats } from "./stats";
import type { Narrative, Plan, SeriesByIndicator } from "./types";

export interface ReportData {
  question: string;
  plan: Plan;
  series: SeriesByIndicator;
  narrative: Narrative | null;
  retrievedAt: string;
}

export function statsForReport(plan: Plan, series: SeriesByIndicator): Record<string, IndicatorStats> {
  const out: Record<string, IndicatorStats> = {};
  for (const code of plan.indicators) out[code] = computeStats(series[code] ?? {}, plan.countries);
  return out;
}

/**
 * The exact facts the analyst model sees: labels plus rounded stats.
 * The verifier checks the narrative against this same object.
 */
export function analystInput(plan: Plan, stats: Record<string, IndicatorStats>) {
  return roundDeep({
    years: { start: plan.startYear, end: plan.endYear },
    countries: Object.fromEntries(plan.countries.map((c) => [c, countryName(c)])),
    indicators: plan.indicators.map((code) => {
      const ind = getIndicator(code);
      return { code, label: ind?.label ?? code, unit: ind?.unit ?? "", stats: stats[code] };
    }),
  });
}
