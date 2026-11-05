"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";
import { COUNTRIES, countryName } from "@/lib/countries";
import { INDICATORS, getIndicator } from "@/lib/indicators";
import { MAX_COUNTRIES } from "@/lib/plan";
import type { IndicatorStats } from "@/lib/stats";
import type { CountrySeries } from "@/lib/types";
import { StatsTable } from "./StatsTable";
import { PALETTE, TrendChart } from "./TrendChart";

const categories = [...new Set(INDICATORS.map((i) => i.category))];

export function ExploreClient({ maxYear }: { maxYear: number }) {
  const [countries, setCountries] = useState<string[]>(["NZL", "PHL", "WLD"]);
  const [indicator, setIndicator] = useState<string>("NY.GDP.PCAP.PP.CD");
  const [start, setStart] = useState(maxYear - 19);
  const [end, setEnd] = useState(maxYear);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<{ series: CountrySeries; stats: IndicatorStats } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return COUNTRIES.filter((c) => !countries.includes(c.code) && (c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q)).slice(0, 8);
  }, [search, countries]);

  useEffect(() => {
    if (!countries.length || start > end) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({ countries: countries.join(","), indicator, start: String(start), end: String(end) });
    fetch(`/api/data?${qs}`, { signal: ctrl.signal })
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error ?? "Failed to load data.");
        setData(body);
        track("explore_used", { indicator });
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [countries, indicator, start, end]);

  const years = Array.from({ length: maxYear - 1960 + 1 }, (_, i) => maxYear - i);

  return (
    <div className="space-y-6">
      <div className="card grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor="country-search">
            Countries ({countries.length}/{MAX_COUNTRIES})
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {countries.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white py-1 pl-3 pr-1 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                {countryName(c)}
                <button
                  type="button"
                  aria-label={`Remove ${countryName(c)}`}
                  onClick={() => setCountries(countries.filter((x) => x !== c))}
                  className="rounded-full px-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="relative mt-3">
            <input
              id="country-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={countries.length >= MAX_COUNTRIES}
              placeholder={countries.length >= MAX_COUNTRIES ? "Maximum reached" : "Add a country or region…"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {matches.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {matches.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setCountries([...countries, c.code]);
                        setSearch("");
                      }}
                      className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-slate-400">{c.aggregate ? "region/group" : c.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="indicator">Indicator</label>
            <select
              id="indicator"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {INDICATORS.filter((i) => i.category === cat).map((i) => (
                    <option key={i.code} value={i.code}>{i.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            {([["From", start, setStart], ["To", end, setEnd]] as const).map(([label, value, set]) => (
              <label key={label} className="flex-1 text-sm font-medium">
                {label}
                <select
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            ))}
          </div>
          {start > end && <p className="text-sm text-rose-700">“From” must be before “To”.</p>}
        </div>
      </div>

      <section className="card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{getIndicator(indicator)?.label}</h2>
          {loading && <span className="text-sm text-slate-500">Loading…</span>}
        </div>
        {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {!countries.length && <p className="text-sm text-slate-500">Add at least one country.</p>}
        {data && countries.length > 0 && (
          <div className={`space-y-4 transition-opacity ${loading ? "opacity-40" : ""}`} aria-busy={loading}>
            <TrendChart indicator={indicator} series={data.series} countries={countries} />
            <StatsTable indicator={indicator} stats={data.stats} countries={countries} />
          </div>
        )}
        <p className="text-xs text-slate-500">
          Source: World Bank, World Development Indicators ({indicator}). Explore uses no AI; ask a question to get written insights.
        </p>
      </section>
    </div>
  );
}
