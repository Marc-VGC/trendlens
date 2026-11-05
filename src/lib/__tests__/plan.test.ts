import { describe, expect, it } from "vitest";
import { sanitizePlan } from "../plan";
import type { RawPlan } from "../types";

const now = new Date("2026-11-05T00:00:00Z");
const base: RawPlan = {
  title: "Test",
  countries: ["NZL"],
  indicators: ["IT.NET.USER.ZS"],
  startYear: null,
  endYear: null,
  clarification: null,
};

describe("sanitizePlan", () => {
  it("defaults to the last 20 years ending last year", () => {
    const r = sanitizePlan(base, now);
    expect(r.ok && [r.plan.startYear, r.plan.endYear]).toEqual([2006, 2025]);
  });

  it("normalises, dedupes and drops unknown countries; caps at 6", () => {
    const r = sanitizePlan(
      { ...base, countries: ["nzl", "NZL", "XXX", "PHL", "AUS", "USA", "CHN", "IND", "JPN", "WLD"] },
      now,
    );
    expect(r.ok && r.plan.countries).toEqual(["NZL", "PHL", "AUS", "USA", "CHN", "IND"]);
  });

  it("drops non-catalog indicators and caps at 3", () => {
    const raw = {
      ...base,
      indicators: ["IT.NET.USER.ZS", "FAKE.CODE", "SP.POP.TOTL", "FP.CPI.TOTL.ZG", "SP.DYN.LE00.IN"],
    } as unknown as RawPlan;
    const r = sanitizePlan(raw, now);
    expect(r.ok && r.plan.indicators).toEqual(["IT.NET.USER.ZS", "SP.POP.TOTL", "FP.CPI.TOTL.ZG"]);
  });

  it("clamps years and swaps a reversed range", () => {
    const r = sanitizePlan({ ...base, startYear: 2050, endYear: 1900 }, now);
    expect(r.ok && [r.plan.startYear, r.plan.endYear]).toEqual([1960, 2025]);
  });

  it("returns the AI clarification when nothing valid remains", () => {
    const r = sanitizePlan({ ...base, countries: [], clarification: "I can only answer country-level questions." }, now);
    expect(r).toEqual({ ok: false, message: "I can only answer country-level questions." });
  });
});
