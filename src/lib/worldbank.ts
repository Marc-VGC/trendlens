import type { CountrySeries, Point } from "./types";

const BASE = "https://api.worldbank.org/v2";

export class WorldBankError extends Error {}

/** Countries and the indicator must already be sanitized (ISO3 list / catalog code). */
export function buildUrl(countries: string[], indicator: string, start: number, end: number): string {
  const c = countries.map(encodeURIComponent).join(";");
  return `${BASE}/country/${c}/indicator/${encodeURIComponent(indicator)}?format=json&date=${start}:${end}&per_page=20000`;
}

interface WbRow {
  countryiso3code: string;
  date: string;
  value: number | null;
}

/** Parse a WB v2 JSON response into per-country series sorted by year. Pure. */
export function parseWorldBankResponse(json: unknown): CountrySeries {
  if (!Array.isArray(json)) throw new WorldBankError("Unexpected World Bank response");
  const meta = json[0] as { message?: { value?: string }[] } | undefined;
  if (meta && Array.isArray(meta.message)) {
    throw new WorldBankError(meta.message[0]?.value ?? "World Bank API error");
  }
  const rows = (json[1] ?? []) as WbRow[];
  const out: CountrySeries = {};
  for (const r of rows) {
    const iso = r.countryiso3code;
    const year = Number(r.date);
    if (!iso || !Number.isInteger(year)) continue;
    const value = typeof r.value === "number" && Number.isFinite(r.value) ? r.value : null;
    (out[iso] ??= []).push({ year, value });
  }
  for (const iso of Object.keys(out)) out[iso].sort((a, b) => a.year - b.year);
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch one indicator for several countries. Retries transient failures
 * (network, 5xx, non-JSON bodies, which the WB API occasionally returns).
 */
export async function fetchSeries(
  countries: string[],
  indicator: string,
  start: number,
  end: number,
  attempts = 3,
): Promise<CountrySeries> {
  const url = buildUrl(countries, indicator, start, end);
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { next: { revalidate: 86_400 } });
      if (res.status >= 500) throw new Error(`World Bank HTTP ${res.status}`);
      const text = await res.text();
      const series = parseWorldBankResponse(JSON.parse(text));
      // Make sure every requested country has an entry, even if empty.
      for (const c of countries) series[c] ??= [];
      return series;
    } catch (e) {
      if (e instanceof WorldBankError) throw e; // a real API error, so retrying won't help
      lastError = e;
      if (i < attempts - 1) await sleep(400 * 2 ** i);
    }
  }
  throw new WorldBankError(`World Bank API unavailable: ${String(lastError)}`);
}

export function nonNull(points: Point[]): { year: number; value: number }[] {
  return points.filter((p): p is { year: number; value: number } => p.value != null);
}
