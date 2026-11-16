/**
 * Hallucination guard: every number the AI writes must match a computed stat.
 * Pure; see spec.md §3.6.
 */

export interface ExtractedNumber {
  raw: string;
  value: number;
  isYear: boolean;
  /** Written as a percentage ("12%", "12 percent"). */
  isPercent: boolean;
}

const SCALE: Record<string, number> = {
  k: 1e3,
  thousand: 1e3,
  m: 1e6,
  mn: 1e6,
  million: 1e6,
  b: 1e9,
  bn: 1e9,
  billion: 1e9,
  t: 1e12,
  tn: 1e12,
  trillion: 1e12,
};

// number, optional decimal part, optional %, optional scale word
const NUMBER_RE = /(?<![\w.])(-|−)?(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(?:\s?(%|percent(?!\w)))?(?:\s?(thousand|million|billion|trillion|mn|bn|tn|k|m|b|t)(?!\w))?(?![\w])/gi;

export function extractNumbers(text: string): ExtractedNumber[] {
  const out: ExtractedNumber[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const [raw, sign, intPart, dec, pct, scaleWord] = m;
    let value = Number(intPart.replace(/,/g, "") + (dec ?? ""));
    if (!Number.isFinite(value)) continue;
    if (sign) value = -value;
    const scale = !pct && scaleWord ? SCALE[scaleWord.toLowerCase()] : undefined;
    if (scale) value *= scale;
    const isYear = !dec && !pct && !scale && !intPart.includes(",") && value >= 1960 && value <= 2100;
    out.push({ raw: raw.trim(), value, isYear, isPercent: Boolean(pct) });
  }
  return out;
}

/** Collect every number found anywhere in a stats object (recursively). */
export function allowedNumbers(stats: unknown): number[] {
  const out: number[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "number" && Number.isFinite(v)) {
      out.push(v, Math.abs(v));
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(stats);
  return out;
}

/**
 * Numbers that are part of an indicator's name or unit, e.g. "65" in "Population ages 65 and above",
 * "5" and "1,000" in "Mortality rate, under-5 (per 1,000 live births)". Taken only from `label` and
 * `unit` fields of the facts object.
 */
export function labelNumbers(facts: unknown): number[] {
  const out: number[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) {
        if ((k === "label" || k === "unit") && typeof x === "string") out.push(...extractNumbers(x).map((n) => n.value));
        else walk(x);
      }
    }
  };
  walk(facts);
  return out;
}

function close(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  return diff <= 0.05 || diff <= Math.abs(b) * 0.01;
}

/**
 * A number is verified if it matches an allowed value, directly or after common unit scaling.
 * Numbers from the indicator's name (`labels`) also verify, but never when written as a percentage,
 * so "aged 65+" passes while an invented "65%" is still flagged.
 */
export function isVerified(
  n: ExtractedNumber,
  allowed: number[],
  years: { start: number; end: number },
  labels: number[] = [],
): boolean {
  if (!n.isPercent && labels.some((l) => l === n.value)) return true;
  if (n.isYear) return n.value >= years.start && n.value <= years.end;
  const v = Math.abs(n.value);
  return allowed.some(
    (a) =>
      close(v, a) ||
      // "264.1" written for 264,057,413,740 when the unit is stated elsewhere ("US$ billion")
      [1e3, 1e6, 1e9, 1e12].some((s) => Math.abs(a) >= s && Math.abs(v - a / s) <= Math.abs(a / s) * 0.01),
  );
}

export interface TextVerification {
  text: string;
  numbers: number;
  unverified: string[];
}

export function verifyText(
  text: string,
  allowed: number[],
  years: { start: number; end: number },
  labels: number[] = [],
): TextVerification {
  const nums = extractNumbers(text);
  const unverified = nums.filter((n) => !isVerified(n, allowed, years, labels)).map((n) => n.raw);
  return { text, numbers: nums.length, unverified };
}

export interface NarrativeVerification {
  headline: TextVerification;
  insights: TextVerification[];
  caveats: TextVerification[];
  /** Share of numbers that verified, 0–100; null if the text contains no numbers. */
  rate: number | null;
}

export function verifyNarrative(
  narrative: { headline: string; insights: string[]; caveats: string[] },
  stats: unknown,
  years: { start: number; end: number },
): NarrativeVerification {
  const allowed = allowedNumbers(stats);
  const labels = labelNumbers(stats);
  const headline = verifyText(narrative.headline, allowed, years, labels);
  const insights = narrative.insights.map((t) => verifyText(t, allowed, years, labels));
  const caveats = narrative.caveats.map((t) => verifyText(t, allowed, years, labels));
  const all = [headline, ...insights, ...caveats];
  const total = all.reduce((s, v) => s + v.numbers, 0);
  const bad = all.reduce((s, v) => s + v.unverified.length, 0);
  return { headline, insights, caveats, rate: total === 0 ? null : Math.round(((total - bad) / total) * 100) };
}
