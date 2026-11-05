import { describe, expect, it } from "vitest";
import { compare, roundDeep, summarize } from "../stats";

const pts = (pairs: [number, number | null][]) => pairs.map(([year, value]) => ({ year, value }));

describe("summarize", () => {
  it("computes change, % change and CAGR from first and last non-null points", () => {
    const s = summarize(pts([[2000, null], [2001, 100], [2002, 110], [2011, 200], [2012, null]]));
    expect(s.first).toEqual({ year: 2001, value: 100 });
    expect(s.last).toEqual({ year: 2011, value: 200 });
    expect(s.change).toBe(100);
    expect(s.pctChange).toBe(100);
    expect(s.cagr).toBeCloseTo(7.177, 2); // 2^(1/10) - 1
    expect(s.points).toBe(3);
  });

  it("finds min/max with their years and the mean", () => {
    const s = summarize(pts([[2010, 5], [2011, 2], [2012, 9]]));
    expect(s.min).toEqual({ year: 2011, value: 2 });
    expect(s.max).toEqual({ year: 2012, value: 9 });
    expect(s.mean).toBeCloseTo(16 / 3);
  });

  it("returns null CAGR for non-positive values or a single point", () => {
    expect(summarize(pts([[2010, -2], [2015, 3]])).cagr).toBeNull();
    expect(summarize(pts([[2010, 4]])).cagr).toBeNull();
  });

  it("handles an empty series", () => {
    expect(summarize(pts([[2010, null]]))).toMatchObject({ first: null, last: null, points: 0 });
  });
});

describe("compare", () => {
  const series = {
    AAA: pts([[2018, 10], [2019, 12], [2020, 15], [2021, 20]]),
    BBB: pts([[2018, 30], [2019, 31], [2020, 29], [2021, null]]),
  };

  it("ranks at the latest year where every country has data", () => {
    const c = compare(series, ["AAA", "BBB"]);
    expect(c.latestCommonYear).toBe(2020);
    expect(c.firstCommonYear).toBe(2018);
    expect(c.ranking).toEqual([
      { country: "BBB", value: 29 },
      { country: "AAA", value: 15 },
    ]);
    expect(c.spreadFirst).toBe(20);
    expect(c.spreadLatest).toBe(14);
  });

  it("returns no ranking when no year is common", () => {
    const c = compare({ AAA: pts([[2018, 1]]), BBB: pts([[2019, 2]]) }, ["AAA", "BBB"]);
    expect(c.latestCommonYear).toBeNull();
    expect(c.ranking).toEqual([]);
  });

  it("has no spread for a single country", () => {
    expect(compare(series, ["AAA"]).spreadLatest).toBeNull();
  });
});

describe("roundDeep", () => {
  it("rounds nested numbers and leaves other values alone", () => {
    expect(roundDeep({ a: 1.23456, b: [2.345, { c: "x", d: null }] })).toEqual({ a: 1.23, b: [2.35, { c: "x", d: null }] });
  });
});
