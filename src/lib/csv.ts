import { countryName } from "./countries";
import { getIndicator } from "./indicators";
import type { SeriesByIndicator } from "./types";

function cell(v: string | number | null): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Long-format CSV: indicator_code, indicator, country_code, country, year, value. Pure. */
export function toCsv(series: SeriesByIndicator): string {
  const lines = ["indicator_code,indicator,country_code,country,year,value"];
  for (const [code, byCountry] of Object.entries(series)) {
    const label = getIndicator(code)?.label ?? code;
    for (const [iso, points] of Object.entries(byCountry)) {
      for (const p of points) {
        lines.push([code, label, iso, countryName(iso), p.year, p.value].map(cell).join(","));
      }
    }
  }
  return lines.join("\n") + "\n";
}
