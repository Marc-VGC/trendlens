import { describe, expect, it } from "vitest";
import { allowedNumbers, extractNumbers, verifyNarrative, verifyText } from "../verify";

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
