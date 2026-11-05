import { z } from "zod";
import { INDICATOR_CODES } from "./indicators";

export interface Point {
  year: number;
  value: number | null;
}

/** iso3 → points sorted by year ascending. */
export type CountrySeries = Record<string, Point[]>;

/** indicator code → country series. */
export type SeriesByIndicator = Record<string, CountrySeries>;

export interface Plan {
  title: string;
  countries: string[];
  indicators: string[];
  startYear: number;
  endYear: number;
}

/** Raw planner output from the AI, before sanitizing. */
export const rawPlanSchema = z.object({
  title: z.string().describe("Short report title, e.g. 'Internet adoption: New Zealand vs Philippines'"),
  countries: z
    .array(z.string())
    .describe("World Bank ISO3 codes, e.g. NZL, PHL, AUS; WLD for World; HIC for High income. Max 6."),
  indicators: z.array(z.enum(INDICATOR_CODES)).describe("1–3 indicator codes from the catalog"),
  startYear: z.number().int().nullable().describe("First year, or null for a sensible default"),
  endYear: z.number().int().nullable().describe("Last year, or null for the latest available"),
  clarification: z
    .string()
    .nullable()
    .describe("If the question can't be answered with these indicators, a short message explaining why; else null"),
});
export type RawPlan = z.infer<typeof rawPlanSchema>;

export const narrativeSchema = z.object({
  headline: z.string().describe("One-sentence key takeaway"),
  insights: z.array(z.string()).describe("3–5 insights, each one or two sentences, citing years and numbers from the stats"),
  caveats: z.array(z.string()).describe("0–3 caveats about data gaps, definitions or comparability"),
});
export type Narrative = z.infer<typeof narrativeSchema>;
