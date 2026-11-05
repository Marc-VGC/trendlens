import { describe, expect, it } from "vitest";
import { WorldBankError, buildUrl, parseWorldBankResponse } from "../worldbank";

describe("buildUrl", () => {
  it("joins countries with semicolons and sets the date range", () => {
    expect(buildUrl(["NZL", "PHL"], "IT.NET.USER.ZS", 2005, 2024)).toBe(
      "https://api.worldbank.org/v2/country/NZL;PHL/indicator/IT.NET.USER.ZS?format=json&date=2005:2024&per_page=20000",
    );
  });
});

describe("parseWorldBankResponse", () => {
  it("groups rows by country, sorts by year and keeps nulls as gaps", () => {
    const json = [
      { page: 1 },
      [
        { countryiso3code: "NZL", date: "2023", value: 93.3 },
        { countryiso3code: "NZL", date: "2021", value: 92 },
        { countryiso3code: "NZL", date: "2022", value: null },
        { countryiso3code: "PHL", date: "2023", value: 77.9 },
      ],
    ];
    expect(parseWorldBankResponse(json)).toEqual({
      NZL: [
        { year: 2021, value: 92 },
        { year: 2022, value: null },
        { year: 2023, value: 93.3 },
      ],
      PHL: [{ year: 2023, value: 77.9 }],
    });
  });

  it("handles an empty result", () => {
    expect(parseWorldBankResponse([{ page: 1, total: 0 }, null])).toEqual({});
  });

  it("throws on World Bank error payloads and unexpected shapes", () => {
    expect(() => parseWorldBankResponse([{ message: [{ id: "175", value: "The indicator was not found." }] }])).toThrow(
      WorldBankError,
    );
    expect(() => parseWorldBankResponse({ error: true })).toThrow(WorldBankError);
  });
});
