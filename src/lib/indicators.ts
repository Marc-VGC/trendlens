/**
 * Curated World Development Indicators (World Bank).
 * Every code was checked against the live API on 2026-11-05.
 * The AI planner may only choose codes from this list.
 */
export type Category =
  | "Economy"
  | "Trade & investment"
  | "People"
  | "Digital & infrastructure"
  | "Environment & energy"
  | "Education & health"
  | "Inequality & poverty";

export type Unit = "%" | "US$" | "int$" | "people" | "years" | "per 100" | "per 1,000" | "births" | "tCO2e" | "index" | "count";

export interface Indicator {
  code: string;
  label: string;
  short: string;
  category: Category;
  unit: Unit;
  decimals: number;
}

export const INDICATORS = [
  { code: "NY.GDP.MKTP.CD", label: "GDP (current US$)", short: "GDP", category: "Economy", unit: "US$", decimals: 0 },
  { code: "NY.GDP.MKTP.KD.ZG", label: "GDP growth (annual %)", short: "GDP growth", category: "Economy", unit: "%", decimals: 1 },
  { code: "NY.GDP.PCAP.CD", label: "GDP per capita (current US$)", short: "GDP per capita", category: "Economy", unit: "US$", decimals: 0 },
  { code: "NY.GDP.PCAP.PP.CD", label: "GDP per capita, PPP (current international $)", short: "GDP per capita (PPP)", category: "Economy", unit: "int$", decimals: 0 },
  { code: "FP.CPI.TOTL.ZG", label: "Inflation, consumer prices (annual %)", short: "Inflation", category: "Economy", unit: "%", decimals: 1 },
  { code: "SL.UEM.TOTL.ZS", label: "Unemployment, total (% of labour force, modelled ILO)", short: "Unemployment", category: "Economy", unit: "%", decimals: 1 },
  { code: "GC.DOD.TOTL.GD.ZS", label: "Central government debt, total (% of GDP)", short: "Government debt", category: "Economy", unit: "%", decimals: 1 },
  { code: "NV.IND.MANF.ZS", label: "Manufacturing, value added (% of GDP)", short: "Manufacturing share", category: "Economy", unit: "%", decimals: 1 },
  { code: "NE.EXP.GNFS.ZS", label: "Exports of goods and services (% of GDP)", short: "Exports", category: "Trade & investment", unit: "%", decimals: 1 },
  { code: "NE.IMP.GNFS.ZS", label: "Imports of goods and services (% of GDP)", short: "Imports", category: "Trade & investment", unit: "%", decimals: 1 },
  { code: "BX.KLT.DINV.WD.GD.ZS", label: "Foreign direct investment, net inflows (% of GDP)", short: "FDI inflows", category: "Trade & investment", unit: "%", decimals: 1 },
  { code: "BX.TRF.PWKR.DT.GD.ZS", label: "Personal remittances received (% of GDP)", short: "Remittances", category: "Trade & investment", unit: "%", decimals: 1 },
  { code: "ST.INT.ARVL", label: "International tourism, number of arrivals", short: "Tourist arrivals", category: "Trade & investment", unit: "count", decimals: 0 },
  { code: "SP.POP.TOTL", label: "Population, total", short: "Population", category: "People", unit: "people", decimals: 0 },
  { code: "SP.POP.GROW", label: "Population growth (annual %)", short: "Population growth", category: "People", unit: "%", decimals: 2 },
  { code: "SP.URB.TOTL.IN.ZS", label: "Urban population (% of total)", short: "Urbanisation", category: "People", unit: "%", decimals: 1 },
  { code: "SP.POP.65UP.TO.ZS", label: "Population ages 65 and above (% of total)", short: "Aged 65+", category: "People", unit: "%", decimals: 1 },
  { code: "SP.DYN.TFRT.IN", label: "Fertility rate, total (births per woman)", short: "Fertility rate", category: "People", unit: "births", decimals: 2 },
  { code: "SL.TLF.CACT.FE.ZS", label: "Labour force participation rate, female (% of females 15+)", short: "Female labour participation", category: "People", unit: "%", decimals: 1 },
  { code: "IT.NET.USER.ZS", label: "Individuals using the Internet (% of population)", short: "Internet users", category: "Digital & infrastructure", unit: "%", decimals: 1 },
  { code: "IT.CEL.SETS.P2", label: "Mobile cellular subscriptions (per 100 people)", short: "Mobile subscriptions", category: "Digital & infrastructure", unit: "per 100", decimals: 1 },
  { code: "EG.ELC.ACCS.ZS", label: "Access to electricity (% of population)", short: "Electricity access", category: "Digital & infrastructure", unit: "%", decimals: 1 },
  { code: "EG.FEC.RNEW.ZS", label: "Renewable energy consumption (% of total final energy)", short: "Renewable energy share", category: "Environment & energy", unit: "%", decimals: 1 },
  { code: "EN.GHG.CO2.PC.CE.AR5", label: "CO2 emissions excluding LULUCF per capita (t CO2e)", short: "CO2 per capita", category: "Environment & energy", unit: "tCO2e", decimals: 2 },
  { code: "SP.DYN.LE00.IN", label: "Life expectancy at birth, total (years)", short: "Life expectancy", category: "Education & health", unit: "years", decimals: 1 },
  { code: "SH.DYN.MORT", label: "Mortality rate, under-5 (per 1,000 live births)", short: "Under-5 mortality", category: "Education & health", unit: "per 1,000", decimals: 1 },
  { code: "SH.XPD.CHEX.GD.ZS", label: "Current health expenditure (% of GDP)", short: "Health spending", category: "Education & health", unit: "%", decimals: 1 },
  { code: "SE.XPD.TOTL.GD.ZS", label: "Government expenditure on education (% of GDP)", short: "Education spending", category: "Education & health", unit: "%", decimals: 1 },
  { code: "SE.TER.ENRR", label: "School enrolment, tertiary (% gross)", short: "Tertiary enrolment", category: "Education & health", unit: "%", decimals: 1 },
  { code: "GB.XPD.RSDV.GD.ZS", label: "Research and development expenditure (% of GDP)", short: "R&D spending", category: "Education & health", unit: "%", decimals: 2 },
  { code: "SI.POV.GINI", label: "Gini index", short: "Gini index", category: "Inequality & poverty", unit: "index", decimals: 1 },
  { code: "SI.POV.DDAY", label: "Poverty headcount ratio at $3.00 a day (2021 PPP, % of population)", short: "Extreme poverty", category: "Inequality & poverty", unit: "%", decimals: 1 },
] as const satisfies readonly Indicator[];

export type IndicatorCode = (typeof INDICATORS)[number]["code"];

export const INDICATOR_CODES = INDICATORS.map((i) => i.code) as [IndicatorCode, ...IndicatorCode[]];

const byCode = new Map<string, Indicator>(INDICATORS.map((i) => [i.code, i]));

export function getIndicator(code: string): Indicator | undefined {
  return byCode.get(code);
}

export function isIndicatorCode(code: string): code is IndicatorCode {
  return byCode.has(code);
}

export function indicatorSourceUrl(code: string): string {
  return `https://data.worldbank.org/indicator/${code}`;
}
