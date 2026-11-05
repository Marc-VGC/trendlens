import { countryName } from "@/lib/countries";
import { getIndicator, indicatorSourceUrl } from "@/lib/indicators";
import { analystInput, statsForReport, type ReportData } from "@/lib/report";
import { verifyNarrative, type TextVerification } from "@/lib/verify";
import { ReportActions } from "./ReportActions";
import { StatsTable } from "./StatsTable";
import { TrendChart } from "./TrendChart";

function Badge({ v }: { v: TextVerification }) {
  if (v.numbers === 0) return null;
  if (v.unverified.length === 0) {
    return (
      <span className="ml-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 align-middle text-xs font-semibold text-emerald-800" title="Every number matches the World Bank data">
        ✓ verified
      </span>
    );
  }
  return (
    <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-semibold text-amber-900" title={`Not found in the data: ${v.unverified.join(", ")}`}>
      ⚠ unverified: {v.unverified.join(", ")}
    </span>
  );
}

export function ReportView({ report, banner }: { report: ReportData; banner?: React.ReactNode }) {
  const { plan, series, narrative } = report;
  const stats = statsForReport(plan, series);
  const facts = analystInput(plan, stats);
  const verification = narrative ? verifyNarrative(narrative, facts, { start: plan.startYear, end: plan.endYear }) : null;
  const retrieved = new Date(report.retrievedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const filename = plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "trendlens";

  return (
    <div className="space-y-6">
      {banner}
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {plan.startYear}–{plan.endYear} · {plan.countries.map(countryName).join(", ")}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">{plan.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium">Question:</span> {report.question}
        </p>
        <div className="mt-4">
          <ReportActions series={series} filename={filename} />
        </div>
      </section>

      {narrative && verification ? (
        <section className="card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Key insights</h2>
            {verification.rate != null && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${verification.rate === 100 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}
              >
                {verification.rate}% of numbers verified against the data
              </span>
            )}
          </div>
          <p className="text-lg font-medium leading-snug text-slate-900">
            {narrative.headline}
            <Badge v={verification.headline} />
          </p>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            {narrative.insights.map((t, i) => (
              <li key={i}>
                {t}
                <Badge v={verification.insights[i]} />
              </li>
            ))}
          </ul>
          {narrative.caveats.length > 0 && (
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Caveats</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {narrative.caveats.map((t, i) => (
                  <li key={i}>
                    {t}
                    <Badge v={verification.caveats[i]} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-slate-500">
            Insights are written by AI from the statistics below; every number is automatically checked. They describe
            patterns, not causes.
          </p>
        </section>
      ) : (
        <section className="card text-sm text-slate-600">AI insights are unavailable for this report. The charts and statistics below are complete.</section>
      )}

      {plan.indicators.map((code) => {
        const ind = getIndicator(code);
        return (
          <section key={code} className="card space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ind?.category}</p>
              <h2 className="text-lg font-semibold">{ind?.label ?? code}</h2>
            </div>
            <TrendChart indicator={code} series={series[code] ?? {}} countries={plan.countries} />
            <StatsTable indicator={code} stats={stats[code]} countries={plan.countries} />
            <p className="text-xs text-slate-500">
              Source: World Bank, World Development Indicators,{" "}
              <a className="underline" href={indicatorSourceUrl(code)} target="_blank" rel="noreferrer">
                {code}
              </a>
              . Retrieved {retrieved}.
            </p>
          </section>
        );
      })}
    </div>
  );
}
