import type { Unit } from "./indicators";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 });

/** Human-readable value for an indicator unit. */
export function formatValue(v: number | null | undefined, unit: Unit | string, decimals = 1): string {
  if (v == null || !Number.isFinite(v)) return "n/a";
  switch (unit) {
    case "%":
      return `${v.toFixed(decimals)}%`;
    case "US$":
      return `US$${compact.format(v)}`;
    case "int$":
      return `$${compact.format(v)} (PPP)`;
    case "people":
    case "count":
      return compact.format(v);
    default:
      return v.toFixed(decimals);
  }
}

/** Format a change: percentage points for % indicators. */
export function formatChange(v: number | null | undefined, unit: Unit | string, decimals = 1): string {
  if (v == null || !Number.isFinite(v)) return "n/a";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  const abs = Math.abs(v);
  if (unit === "%") return `${sign}${abs.toFixed(decimals)} pts`;
  return `${sign}${formatValue(abs, unit, decimals)}`;
}

export function formatPct(v: number | null | undefined, decimals = 1): string {
  if (v == null || !Number.isFinite(v)) return "n/a";
  return `${v > 0 ? "+" : ""}${v.toFixed(decimals)}%`;
}
