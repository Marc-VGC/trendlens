import { countryName } from "@/lib/countries";
import { formatChange, formatPct, formatValue } from "@/lib/format";
import { getIndicator } from "@/lib/indicators";
import type { IndicatorStats } from "@/lib/stats";

export function StatsTable({ indicator, stats, countries }: { indicator: string; stats: IndicatorStats; countries: string[] }) {
  const ind = getIndicator(indicator);
  const unit = ind?.unit ?? "";
  const d = ind?.decimals ?? 1;
  const { comparison } = stats;

  return (
    <div className="space-y-3">
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-2 pr-3 font-semibold">Country</th>
              <th className="py-2 pr-3 font-semibold">First</th>
              <th className="py-2 pr-3 font-semibold">Latest</th>
              <th className="py-2 pr-3 font-semibold">Change</th>
              <th className="py-2 pr-3 font-semibold">% change</th>
              <th className="py-2 font-semibold">CAGR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {countries.map((c) => {
              const s = stats.byCountry[c];
              return (
                <tr key={c}>
                  <td className="py-2 pr-3 font-medium">{countryName(c)}</td>
                  <td className="py-2 pr-3">{s?.first ? `${formatValue(s.first.value, unit, d)} (${s.first.year})` : "n/a"}</td>
                  <td className="py-2 pr-3">{s?.last ? `${formatValue(s.last.value, unit, d)} (${s.last.year})` : "n/a"}</td>
                  <td className="py-2 pr-3">{formatChange(s?.change, unit, d)}</td>
                  <td className="py-2 pr-3">{formatPct(s?.pctChange)}</td>
                  <td className="py-2">{s?.cagr == null ? "n/a" : `${formatPct(s.cagr, 2)}/yr`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {comparison.latestCommonYear != null && comparison.ranking.length > 1 && (
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-800">Ranking in {comparison.latestCommonYear}:</span>{" "}
          {comparison.ranking.map((r, i) => `${i + 1}. ${countryName(r.country)} (${formatValue(r.value, unit, d)})`).join(" · ")}
        </p>
      )}
      {comparison.latestCommonYear == null && countries.length > 1 && (
        <p className="text-sm text-amber-800">No year has data for every country, so no ranking is shown.</p>
      )}
    </div>
  );
}
