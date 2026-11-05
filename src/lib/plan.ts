import { getCountry } from "./countries";
import { isIndicatorCode } from "./indicators";
import type { Plan, RawPlan } from "./types";

export const MAX_COUNTRIES = 6;
export const MAX_INDICATORS = 3;
export const MIN_YEAR = 1960;
export const DEFAULT_SPAN = 20;

export type PlanResult = { ok: true; plan: Plan } | { ok: false; message: string };

const DEFAULT_MESSAGE =
  "I couldn't match that to country-level development or economic indicators. Try naming countries and a topic, e.g. \"internet use in Kenya vs Nigeria since 2010\".";

function clampYear(y: number, maxYear: number): number {
  return Math.min(Math.max(Math.round(y), MIN_YEAR), maxYear);
}

/** Make an AI-produced plan safe and valid. Pure; see spec.md §3.3. */
export function sanitizePlan(raw: RawPlan, now: Date): PlanResult {
  const maxYear = now.getUTCFullYear() - 1;

  const countries = [...new Set(raw.countries.map((c) => c.trim().toUpperCase()))]
    .filter((c) => !!getCountry(c))
    .slice(0, MAX_COUNTRIES);
  const indicators = [...new Set(raw.indicators)].filter(isIndicatorCode).slice(0, MAX_INDICATORS);

  if (!countries.length || !indicators.length) {
    return { ok: false, message: raw.clarification?.trim() || DEFAULT_MESSAGE };
  }

  let end = raw.endYear == null ? maxYear : clampYear(raw.endYear, maxYear);
  let start = raw.startYear == null ? end - (DEFAULT_SPAN - 1) : clampYear(raw.startYear, maxYear);
  if (start > end) [start, end] = [end, start];
  start = Math.max(start, MIN_YEAR);

  const title = raw.title.trim().slice(0, 140) || "Country comparison";
  return { ok: true, plan: { title, countries, indicators, startYear: start, endYear: end } };
}
