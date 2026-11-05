"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { countryName, getCountry } from "@/lib/countries";
import { formatValue } from "@/lib/format";
import { getIndicator } from "@/lib/indicators";
import type { CountrySeries } from "@/lib/types";

export const PALETTE = ["#1d4ed8", "#db2777", "#059669", "#d97706", "#7c3aed", "#0891b2"];

export function TrendChart({
  indicator,
  series,
  countries,
}: {
  indicator: string;
  series: CountrySeries;
  countries: string[];
}) {
  const ind = getIndicator(indicator);
  const unit = ind?.unit ?? "";
  const decimals = ind?.decimals ?? 1;

  const years = new Set<number>();
  for (const c of countries) for (const p of series[c] ?? []) if (p.value != null) years.add(p.year);
  const rows = [...years]
    .sort((a, b) => a - b)
    .map((year) => {
      const row: Record<string, number | null> = { year };
      for (const c of countries) row[c] = series[c]?.find((p) => p.year === year)?.value ?? null;
      return row;
    });

  if (!rows.length) {
    return <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">No data for this selection.</p>;
  }

  return (
    <div className="h-72 w-full sm:h-80" role="img" aria-label={`${ind?.label ?? indicator} chart`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis
            width={64}
            tick={{ fontSize: 12, fill: "#475569" }}
            tickFormatter={(v: number) => formatValue(v, unit, unit === "%" ? 0 : decimals).replace(" (PPP)", "")}
          />
          <Tooltip
            formatter={(v, name) => [formatValue(typeof v === "number" ? v : null, unit, decimals), countryName(String(name))]}
            labelFormatter={(l) => `Year ${l}`}
          />
          <Legend formatter={(v: string) => countryName(v)} wrapperStyle={{ fontSize: 12 }} />
          {countries.map((c, i) => (
            <Line
              key={c}
              type="monotone"
              dataKey={c}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              strokeDasharray={getCountry(c)?.aggregate ? "6 4" : undefined}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
