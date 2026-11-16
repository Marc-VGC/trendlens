import { describe, expect, it } from "vitest";
import { analystInput, statsForReport } from "../report";
import { allowedNumbers, extractNumbers, labelNumbers, verifyNarrative, verifyText } from "../verify";

const years = { start: 2005, end: 2024 };

describe("extractNumbers", () => {
  it("parses decimals, percentages, thousands separators, signs and scale words", () => {
    const nums = extractNumbers("Rose 61.9% to US$4,171 and GDP of 264.1 billion, a change of −2.5 points in 2024.");
    expect(nums.map((n) => Math.round(n.value * 100) / 100)).toEqual([61.9, 4171, 264.1e9, -2.5, 2024]);
    expect(nums.find((n) => n.value === 2024)?.isYear).toBe(true);
  });

  it("does not treat year ranges as negative numbers", () => {
    expect(extractNumbers("between 2005-2024").map((n) => n.value)).toEqual([2005, 2024]);
  });

  it("ignores digits inside words like CO2", () => {
    expect(extractNumbers("CO2 emissions")).toEqual([]);
  });
});

describe("verifyText", () => {
  const allowed = allowedNumbers({ a: 93.52, b: -61.87, gdp: 264057413739.97, cagr: 14.2 });

  it("accepts rounded values, absolute values of negatives and scaled units", () => {
    const v = verifyText("Internet use hit 93.5% after falling 61.9 points; GDP reached US$264.1 billion.", allowed, years);
    expect(v.unverified).toEqual([]);
    expect(v.numbers).toBe(3);
  });

  it("flags invented numbers", () => {
    const v = verifyText("Growth averaged 5% and reached 88.2%.", allowed, years);
    expect(v.unverified).toEqual(["5%", "88.2%"]);
  });

  it("flags years outside the report range", () => {
    expect(verifyText("Since 1990 it grew 14.2%.", allowed, years).unverified).toEqual(["1990"]);
    expect(verifyText("In 2010 it grew 14.2%.", allowed, years).unverified).toEqual([]);
  });
});

describe("verifyNarrative", () => {
  it("computes an overall verification rate", () => {
    const r = verifyNarrative(
      { headline: "Up 93.5% in 2024", insights: ["Fell 61.9 points", "Rose 12.0%"], caveats: [] },
      { a: 93.52, b: -61.87 },
      years,
    );
    // 4 numbers (93.5, 2024, 61.9, 12.0), 1 unverified → 75%
    expect(r.rate).toBe(75);
    expect(r.insights[1].unverified).toEqual(["12.0%"]);
  });

  it("returns a null rate when there are no numbers", () => {
    expect(verifyNarrative({ headline: "Mixed picture", insights: [], caveats: [] }, {}, years).rate).toBeNull();
  });
});

describe("numbers from the indicator name", () => {
  // Found in live testing (questions 6, 11, 12): "65", "5", "1,000" and "15" come from the indicator
  // names, not from the data, and were wrongly flagged as unverified.
  const facts = (code: string, values: [number, number][]) => {
    const plan = { title: "t", countries: ["SSF"], indicators: [code], startYear: 2006, endYear: 2024 };
    const series = { [code]: { SSF: values.map(([year, value]) => ({ year, value })) } };
    return analystInput(plan, statsForReport(plan, series));
  };
  const range = { start: 2006, end: 2024 };

  it("collects numbers from labels and units only", () => {
    const f = facts("SH.DYN.MORT", [[2006, 114], [2024, 71.2]]);
    expect(labelNumbers(f)).toEqual(expect.arrayContaining([5, 1000]));
    expect(labelNumbers({ code: "SP.POP.65UP.TO.ZS", note: "65" })).toEqual([]);
  });

  it("verifies under-5 and per 1,000 in a mortality report", () => {
    const f = facts("SH.DYN.MORT", [[2006, 114], [2024, 71.2]]);
    const r = verifyNarrative(
      { headline: "Under-5 mortality fell from 114 to 71.2 deaths per 1,000 live births between 2006 and 2024.", insights: [], caveats: [] },
      f,
      range,
    );
    expect(r.headline.unverified).toEqual([]);
    expect(r.rate).toBe(100);
  });

  it("verifies 65 in an ageing report and 15 in a labour report", () => {
    const ageing = facts("SP.POP.65UP.TO.ZS", [[2006, 9.4], [2024, 20.3]]);
    expect(verifyNarrative({ headline: "The share aged 65 and above rose to 20.3%.", insights: [], caveats: [] }, ageing, range).rate).toBe(100);
    const labour = facts("SL.TLF.CACT.FE.ZS", [[2006, 29.2], [2024, 38.7]]);
    expect(verifyNarrative({ headline: "Participation covers women aged 15 and over.", insights: [], caveats: [] }, labour, range).rate).toBe(100);
  });

  it("still flags a label number written as a percentage or an invented value", () => {
    const ageing = facts("SP.POP.65UP.TO.ZS", [[2006, 9.4], [2024, 20.3]]);
    const r = verifyNarrative({ headline: "65% of people are older, up from 12.5.", insights: [], caveats: [] }, ageing, range);
    expect(r.headline.unverified).toEqual(["65%", "12.5"]);
  });
});
