import series from "@/data/example-series.json";
import type { ReportData } from "./report";
import type { SeriesByIndicator } from "./types";

/**
 * Public example report (no AI call, no sign-in).
 * Data: a real World Bank API snapshot retrieved 2026-11-05.
 * Narrative: written for illustration using only the computed stats.
 * The verifier must rate it 100% (see example.test.ts).
 */
export const EXAMPLE_REPORT: ReportData = {
  question:
    "How do New Zealand and the Philippines compare on internet access and GDP per capita since 2005, against the world average?",
  plan: {
    title: "Internet access and income: New Zealand vs Philippines vs World",
    countries: ["NZL", "PHL", "WLD"],
    indicators: ["IT.NET.USER.ZS", "NY.GDP.PCAP.CD"],
    startYear: 2005,
    endYear: 2025,
  },
  series: series as SeriesByIndicator,
  retrievedAt: "2026-11-05T04:30:00.000Z",
  narrative: {
    headline:
      "Between 2005 and 2024 internet use in the Philippines rose from 5.4% to 67.3% of the population, closing much of the digital gap with New Zealand, while the income gap in US dollars widened.",
    insights: [
      "New Zealand had the highest internet use in 2024 at 93.5% of the population, ahead of the world average (71.2%) and the Philippines (67.3%).",
      "The Philippines grew fastest from a low base: internet users rose by 61.9 percentage points between 2005 and 2024, a compound growth rate of 14.2% a year.",
      "The gap between the highest and lowest internet-use rates of the three narrowed from 57.3 points in 2005 to 26.3 points in 2024.",
      "GDP per capita in the Philippines rose 241.7% in current US dollars, from US$1,220 in 2005 to US$4,171 in 2025, a 6.34% annual growth rate, versus 2.95% for New Zealand and 3.46% for the world.",
      "In absolute terms the income gap still widened: the spread between New Zealand and the Philippines grew from US$26,531 in 2005 to US$45,420 in 2025.",
    ],
    caveats: [
      "The Philippines' internet figure peaked at 77.9% in 2023 but is reported at 67.3% for 2024, which may reflect a revision or a change in survey method. Check the World Bank source notes.",
      "Internet data for 2025 is only available for the world aggregate, so the internet comparison uses 2024.",
      "GDP per capita is in current US dollars, so it also reflects inflation and exchange-rate movements, not only real growth.",
    ],
  },
};
