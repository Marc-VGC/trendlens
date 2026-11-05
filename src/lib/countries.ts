import data from "@/data/countries.json";

export interface Country {
  code: string;
  name: string;
  region: string;
  aggregate: boolean;
}

export const COUNTRIES: Country[] = data as Country[];

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code: string): Country | undefined {
  return byCode.get(code.toUpperCase());
}

export function countryName(code: string): string {
  return getCountry(code)?.name ?? code;
}
