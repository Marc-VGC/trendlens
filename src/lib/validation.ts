import { z } from "zod";
import { getCountry } from "./countries";
import { isIndicatorCode } from "./indicators";
import { MAX_COUNTRIES, MIN_YEAR } from "./plan";

export const QUESTION_MIN = 5;
export const QUESTION_MAX = 500;

export const questionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(QUESTION_MIN, "Please ask a longer question.")
    .max(QUESTION_MAX, `Questions are limited to ${QUESTION_MAX} characters.`),
});

/** Query params for the public /api/data endpoint (Explore page). */
export function dataQuerySchema(now: Date) {
  const maxYear = now.getUTCFullYear() - 1;
  return z
    .object({
      countries: z
        .string()
        .transform((s) => [...new Set(s.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean))])
        .refine((cs) => cs.length >= 1 && cs.length <= MAX_COUNTRIES, `Choose 1–${MAX_COUNTRIES} countries.`)
        .refine((cs) => cs.every((c) => !!getCountry(c)), "Unknown country code."),
      indicator: z.string().refine(isIndicatorCode, "Unknown indicator."),
      start: z.coerce.number().int().min(MIN_YEAR).max(maxYear),
      end: z.coerce.number().int().min(MIN_YEAR).max(maxYear),
    })
    .refine((q) => q.start <= q.end, "Start year must be before end year.");
}
