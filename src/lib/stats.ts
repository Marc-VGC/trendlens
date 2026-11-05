import type { CountrySeries, Point } from "./types";
import { nonNull } from "./worldbank";

export interface YearValue {
  year: number;
  value: number;
}

export interface SeriesSummary {
  first: YearValue | null;
  last: YearValue | null;
  change: number | null;
  pctChange: number | null;
  /** Compound annual growth rate, in % per year. */
  cagr: number | null;
  min: YearValue | null;
  max: YearValue | null;
  mean: number | null;
  points: number;
}

export interface Comparison {
  latestCommonYear: number | null;
  firstCommonYear: number | null;
  /** Countries ranked by value at latestCommonYear, highest first. */
  ranking: { country: string; value: number }[];
  spreadFirst: number | null;
  spreadLatest: number | null;
}

export interface IndicatorStats {
  byCountry: Record<string, SeriesSummary>;
  comparison: Comparison;
}

/** Summarize one series. Pure; see spec.md §3.5. */
export function summarize(points: Point[]): SeriesSummary {
  const pts = nonNull(points).sort((a, b) => a.year - b.year);
  if (!pts.length) {
    return { first: null, last: null, change: null, pctChange: null, cagr: null, min: null, max: null, mean: null, points: 0 };
  }
  const first = pts[0];
  const last = pts[pts.length - 1];
  const change = last.value - first.value;
  const pctChange = first.value !== 0 ? (change / Math.abs(first.value)) * 100 : null;
  const span = last.year - first.year;
  const cagr =
    span >= 1 && first.value > 0 && last.value > 0 ? (Math.pow(last.value / first.value, 1 / span) - 1) * 100 : null;
  let min = pts[0];
  let max = pts[0];
  for (const p of pts) {
    if (p.value < min.value) min = p;
    if (p.value > max.value) max = p;
  }
  const mean = pts.reduce((s, p) => s + p.value, 0) / pts.length;
  return { first, last, change, pctChange, cagr, min, max, mean, points: pts.length };
}

function valueAt(points: Point[], year: number): number | null {
  return points.find((p) => p.year === year)?.value ?? null;
}

/** Compare countries on one indicator using years where all have data. Pure. */
export function compare(series: CountrySeries, countries: string[]): Comparison {
  const years = new Set<number>();
  for (const c of countries) for (const p of nonNull(series[c] ?? [])) years.add(p.year);
  const common = [...years]
    .filter((y) => countries.every((c) => valueAt(series[c] ?? [], y) != null))
    .sort((a, b) => a - b);

  const latestCommonYear = common.length ? common[common.length - 1] : null;
  const firstCommonYear = common.length ? common[0] : null;

  const spreadAt = (year: number | null) => {
    if (year == null || countries.length < 2) return null;
    const vals = countries.map((c) => valueAt(series[c], year) as number);
    return Math.max(...vals) - Math.min(...vals);
  };

  const ranking =
    latestCommonYear == null
      ? []
      : countries
          .map((country) => ({ country, value: valueAt(series[country], latestCommonYear) as number }))
          .sort((a, b) => b.value - a.value);

  return { latestCommonYear, firstCommonYear, ranking, spreadFirst: spreadAt(firstCommonYear), spreadLatest: spreadAt(latestCommonYear) };
}

export function computeStats(series: CountrySeries, countries: string[]): IndicatorStats {
  const byCountry: Record<string, SeriesSummary> = {};
  for (const c of countries) byCountry[c] = summarize(series[c] ?? []);
  return { byCountry, comparison: compare(series, countries) };
}

/** Round recursively for compact, readable AI input. Pure. */
export function roundDeep<T>(value: T, digits = 2): T {
  if (typeof value === "number") return (Math.round(value * 10 ** digits) / 10 ** digits) as T;
  if (Array.isArray(value)) return value.map((v) => roundDeep(v, digits)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, roundDeep(v, digits)])) as T;
  }
  return value;
}
