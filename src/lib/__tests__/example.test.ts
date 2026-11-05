import { describe, expect, it } from "vitest";
import { toCsv } from "../csv";
import { EXAMPLE_REPORT } from "../example";
import { analystInput, statsForReport } from "../report";
import { dataQuerySchema, questionSchema } from "../validation";
import { verifyNarrative } from "../verify";

describe("example report", () => {
  it("passes the number verifier at 100%", () => {
    const { plan, series, narrative } = EXAMPLE_REPORT;
    const facts = analystInput(plan, statsForReport(plan, series));
    const v = verifyNarrative(narrative!, facts, { start: plan.startYear, end: plan.endYear });
    const unverified = [v.headline, ...v.insights, ...v.caveats].flatMap((t) => t.unverified);
    expect(unverified).toEqual([]);
    expect(v.rate).toBe(100);
  });
});

describe("toCsv", () => {
  it("writes a long-format CSV with names and quotes where needed", () => {
    const csv = toCsv({ "IT.NET.USER.ZS": { NZL: [{ year: 2023, value: 93.3 }, { year: 2024, value: null }] } });
    expect(csv.split("\n")).toEqual([
      "indicator_code,indicator,country_code,country,year,value",
      "IT.NET.USER.ZS,Individuals using the Internet (% of population),NZL,New Zealand,2023,93.3",
      "IT.NET.USER.ZS,Individuals using the Internet (% of population),NZL,New Zealand,2024,",
      "",
    ]);
    expect(toCsv({ "SP.POP.TOTL": { KOR: [{ year: 2020, value: 1 }] } })).toContain('"Korea, Rep."');
  });
});

describe("input validation", () => {
  const now = new Date("2026-11-05T00:00:00Z");

  it("validates question length", () => {
    expect(questionSchema.safeParse({ question: "hi" }).success).toBe(false);
    expect(questionSchema.safeParse({ question: "x".repeat(501) }).success).toBe(false);
    expect(questionSchema.safeParse({ question: "  Internet use in Kenya  " }).data?.question).toBe("Internet use in Kenya");
  });

  it("validates Explore query params", () => {
    const schema = dataQuerySchema(now);
    const ok = schema.safeParse({ countries: "nzl,PHL,nzl", indicator: "IT.NET.USER.ZS", start: "2005", end: "2025" });
    expect(ok.success && ok.data.countries).toEqual(["NZL", "PHL"]);
    expect(schema.safeParse({ countries: "NZL", indicator: "DROP TABLE", start: "2005", end: "2025" }).success).toBe(false);
    expect(schema.safeParse({ countries: "ZZZ", indicator: "IT.NET.USER.ZS", start: "2005", end: "2025" }).success).toBe(false);
    expect(schema.safeParse({ countries: "NZL", indicator: "IT.NET.USER.ZS", start: "2020", end: "2010" }).success).toBe(false);
    expect(schema.safeParse({ countries: "NZL", indicator: "IT.NET.USER.ZS", start: "2005", end: "2026" }).success).toBe(false);
  });
});
