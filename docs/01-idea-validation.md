# Phase 1 — Idea Validation: TrendLens

> **Before submitting:** steps 3, 6 and 7 need **my own evidence**. Replace every `TODO` with real notes (interviews with classmates, screenshots, survey results). Graders reward real evidence over polished prose.

## Step 1 — Problem statement
Business students, analysts and consultants regularly need **quick, credible cross-country comparisons** of development and economic indicators (GDP growth, inflation, internet adoption, ageing, renewable energy…) for reports, market-entry memos and class papers.

Today that means:
1. Finding the right indicator in a large catalog (the World Bank's WDI alone has well over a thousand series)
2. Downloading CSVs, cleaning them, and building charts in Excel
3. Computing growth rates and comparisons by hand
4. Writing the interpretation

Generic AI chatbots answer in seconds, but they **make up or misremember numbers** and rarely cite a specific dataset and year. You can't put that in a graded paper or a client memo.

**One-liner:** *"Credible country comparisons in one question, with real data, real charts and numbers you can cite."*

## Step 2 — Target user
| | |
|---|---|
| **Primary** | MBA and business students (e.g. AIM, NZ universities) writing strategy papers, country analyses or market-entry recommendations |
| **Secondary** | Junior analysts and consultants preparing country briefs; lecturers preparing teaching examples |
| **Not the user (v1)** | Professional economists who need econometrics, forecasts or high-frequency data |

### Hypothetical personas (not yet validated)
> **These are illustrative personas, not interview results.** They describe who I expect the users to be and what I expect they need. Nothing below was said by a real person. The real evidence is the live test log in Step 7; interviews to confirm or reject these assumptions are still to do (Steps 3 and 6).

| | Priya: market research analyst | Daniel: economics graduate student | Ana: financial journalist |
|---|---|---|---|
| **Job to be done** | Country comparisons for client decks and market-entry memos | Data for papers and exploratory research before deeper analysis | Quick, citable figures for articles on deadline |
| **Assumed current workflow** | Statista and OECD portals, then Excel | World Bank DataBank → several CSVs → clean in Excel → chart | Trading Economics and IMF pages, compared by hand |
| **Assumed time per comparison** | About 2 hours | Several hours, in pieces | 30–60 minutes |
| **Assumed main pain** | Doesn't trust chatbot numbers, so ends up searching portals anyway | Downloading and cleaning several files for one chart | A chatbot figure with no source can't be published |
| **What TrendLens would need to offer** | Fast, sourced data; CSV and chart export for slides | The raw data (CSV) to do their own analysis; the written insights matter less | Written insights as a first draft; clickable sources |
| **Assumed willingness to pay** | Team licence, about US$20–30/month | Wouldn't pay personally; might use a library or student tier (about US$10/month) | About US$15/month personally |

**Hypotheses to test in real interviews** (each maps to a question in the interview guide):
1. Country comparisons take these users **1+ hours** today. *(Step 3)*
2. Users **don't trust chatbot numbers** without a source. *(Step 3, plus the chatbot fact-check)*
3. The **✓ verified badges and source links** increase trust. *(Step 6)*
4. The **written insights are valued** by professionals but less by students, who want to write their own analysis. *(Step 7, assumption 3)*
5. **Professionals or teams would pay** about US$10–30/month; students would not pay personally. *(Step 6)*
6. The most-wanted next features are **chart export (PNG/PowerPoint)**, **more chart controls** (e.g. bar charts, nominal vs real GDP) and **adjustable insight style**. *(Input for the v2 issue)*

### Why now
1. **AI can finally plan, not just chat.** Current LLMs return schema-constrained structured output (JSON that matches a schema) reliably. That makes it practical to turn a plain-English question into a query plan that code can check against a catalog, which wasn't dependable a few model generations ago.
2. **Students already ask chatbots first.** Generative AI is now a default research tool for students, so unverified, invented statistics end up in papers and memos.
3. **Institutions now ask for verification.** Universities and employers increasingly require AI-produced facts to be checked against primary sources. A tool that does the checking automatically fits that new rule.
4. **The primary data is free and open.** The World Bank's Open Data API (CC BY 4.0) needs no key, so a small team can ship credible analytics without licensing data.
5. **It's cheap enough to give away.** Two short model calls per report cost cents, so a free student tier with a daily limit is viable.

## Step 3 — Evidence the problem is real
Desk research:
- The World Bank's World Development Indicators are the standard free source for country comparisons and are widely cited in business-school assignments.
- Existing tools (World Bank DataBank, Our World in Data) are powerful but assume you already know which indicator you need, and they don't write an interpretation.
- LLM hallucination of statistics is a well-documented problem. Universities increasingly ask students to verify AI-produced facts against primary sources.

Primary evidence (**TODO: collect at least 3 rows; real evidence scores higher than polished prose**):

| # | Who (role, no full names needed) | Method | What they said / what happened | Takeaway |
|---|---|---|---|---|
| 1 | `TODO` e.g. AIM classmate, MBA | 10-min chat: *"How long did your last country comparison take? Where did you get the data?"* | `TODO` | `TODO` |
| 2 | `TODO` | Same question | `TODO` | `TODO` |
| 3 | `TODO` | Chatbot check: ask ChatGPT/Claude *"What was New Zealand's inflation in 2022 and the Philippines' internet use in 2020?"* and compare with data.worldbank.org | `TODO` (how many numbers were wrong or uncited?) | `TODO` |
| 4 | `TODO` professor / TA | *"What counts as an acceptable data source in this course?"* | `TODO` | `TODO` |

## Step 4 — Existing alternatives
| Alternative | Strength | Gap |
|---|---|---|
| World Bank DataBank / data.worldbank.org | Authoritative, free | You must know the indicator code; no narrative; clunky charts |
| Our World in Data | Beautiful charts | One indicator at a time; no question-driven workflow; no written insights |
| Excel + CSV downloads | Flexible | Slow; manual CAGR maths; error-prone |
| ChatGPT / Claude / Perplexity | Fast, conversational | Numbers can be wrong or outdated; weak citations; no reproducible chart |
| Statista | Polished | Paywalled; less suited to long time series across many countries |

## Step 5 — Differentiating angle
**TrendLens is grounded analytics, not a chatbot.**
1. **Question → query plan:** AI picks the indicators, countries and years from a curated catalog of real World Bank indicator codes.
2. **Real data:** fetched live from the World Bank API and stored with the report as a citable snapshot.
3. **Deterministic stats:** CAGR, change, peaks and rankings are computed in tested code, not by the LLM.
4. **Verified narrative:** every number in the AI's insights is checked against the computed stats. Unverified numbers are visibly flagged.
5. **Shareable report:** charts, stats table, sources and a CSV download in one link.

## Step 6 — Market and willingness to pay
- Every business school runs country-analysis assignments; every consultancy and bank produces country briefs. `TODO: number of business students at AIM / in NZ, if you can find it`
- Possible model: free for students (limited reports per day), with paid team plans for consultancies (branded PDF export, more indicators). No payments in this assignment, per the brief.
- `TODO: after people try the live app, ask 3 of them "Would you use this instead of DataBank + Excel? Would your team pay for it?" and record the answers here:`

| Person | Would use instead of DataBank + Excel? | Would pay / team would pay? | Quote |
|---|---|---|---|
| `TODO` | | | |
| `TODO` | | | |
| `TODO` | | | |

## Step 7 — Riskiest assumption and test
| Riskiest assumption | Test | Success signal |
|---|---|---|
| The AI maps plain-English questions to the *right* indicators | 15 test questions; check the chosen indicators by hand | ≥ 13/15 sensible plans |
| The narrative contains no invented numbers | Run the verifier on 15 reports | ≥ 95% of numbers verified; 0 unflagged fabrications |
| Users value the narrative, not just the chart | Show 3 users a report with and without the insights | ≥ 2/3 prefer it with insights |

### Test log: run on https://trendlens-neon.vercel.app
Each row links to the live report it produced, so the result can be checked. **All 15 run on 12–16 Nov 2026.**

| # | Question | Plan sensible? (Y/N) | Verification rate | Notes |
|---|---|---|---|---|
| 1 | Compare inflation in New Zealand, Australia and the United States over the last 15 years | **Y**: inflation (`FP.CPI.TOTL.ZG`) · NZ, Australia, US · 2010–2025 | **100%** (every number in the headline, 5 insights and caveats ✓) | [Original report](https://trendlens-neon.vercel.app/r/a9500d25-8379-480a-9766-778f6f132f7b) · [re-test after fix](https://trendlens-neon.vercel.app/r/53b94b4d-e2c4-467c-ad9b-7386634c811f). US data ends in 2024, so the ranking correctly used 2024 as the latest common year and a caveat said so. **Issue found → fixed:** the stats table showed % change and CAGR *of an inflation rate* (e.g. US +79.8%, +4.28%/yr), which is misleading; the AI itself flagged it in a caveat. **Fixed the same day (spec v1.3):** rate indicators (inflation, GDP growth, population growth) no longer get % change or CAGR, the table explains why, and 3 unit tests cover it. **Re-tested on the live app:** same plan, 100% verified (8 of 8 checked sentences ✓), the table shows First / Latest / Change only, and the AI now writes changes in percentage points (*"US inflation rose by 1.31 percentage points"*). The original report now shows 98%, because its caveat quotes a "79.84%" figure the app no longer computes; the verifier correctly flags it. |
| 2 | How has life expectancy changed in Japan, India and Nigeria since 1990? | **Y**: life expectancy · Japan, India, Nigeria · 1990–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/619c5652-ed43-4d96-a55c-3a162056b366). Data end in 2024; the AI said so in a caveat. Correctly noted Nigeria in 2024 is still below India in 1990. |
| 3 | GDP growth in the Philippines, Vietnam and Indonesia since 2000 | **Y**: GDP growth · Philippines, Viet Nam, Indonesia · 2000–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/138841e6-1a70-40a0-aafc-82d33743b575). Confirms the rate fix: changes in percentage points, no CAGR of a growth rate. Picked up the 2020 contractions (Philippines −9.52%). |
| 4 | Which countries in Southeast Asia have the highest internet use? | **Y**: internet users · 6 countries (Singapore, Malaysia, Thailand, Viet Nam, Philippines, Indonesia) · 2006–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/81abcc21-fc7a-462c-ad39-e14cb998c820). Hit the 6-country cap; the AI listed the countries left out (Brunei, Cambodia, Laos, Myanmar, Timor-Leste) as a caveat. |
| 5 | Renewable energy share in Germany vs China since 2000 | **Y**: renewable share · Germany, China · 2000–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/392900f3-afcf-4687-8dd0-f659ddabb020). Data end in 2021 for both; flagged in a caveat. One caveat suggests a possible reason (traditional biomass), framed as "may", which is borderline against the no-causes rule. |
| 6 | Youth and ageing: share of people 65+ in Japan, Italy and South Korea | **Y**: population 65+ · Japan, Italy, South Korea · 2006–2025 | **89%** → **100%** after fix | [Report](https://trendlens-neon.vercel.app/r/07aeee77-bff2-423e-a2e1-38c672dd3dae). **Issue 2 (false alarm):** "65" flagged ⚠ in 4 sentences, but it is part of the indicator name (*aged 65+*), not an invented number. The AI noted that "youth" isn't covered by the data. **Fixed (spec v1.4) and re-checked live on 16 Nov: 100%, no ⚠.** |
| 7 | Unemployment in Spain, Greece and Portugal after 2008 | **Y**: unemployment · Spain, Greece, Portugal · 2008–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/f5213bdd-e476-4c1a-8241-dc647b597a7e). Found the shared 2013 peak (Greece 27.7%). |
| 8 | Government debt in Japan, the US and the UK | **Y**: central government debt · Japan, US, UK · 2006–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/77a019d2-4f2a-4492-b9af-eb2879cc5a38). **Data gap handled:** the World Bank has no data for Japan on this indicator; the table shows n/a, no ranking is forced, and the AI says so instead of inventing a figure. |
| 9 | Remittances as a share of GDP in the Philippines, Mexico and Nepal | **Y**: remittances · Philippines, Mexico, Nepal · 2006–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/839d59ac-3957-442f-84f2-090726913b96). Nepal 16.1% → 32.3% of GDP; Philippines at a period low. |
| 10 | CO2 per person in Australia, New Zealand and the world | **Y**: CO2 per capita · Australia, NZ, World · 2006–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/3305c17c-e000-48c1-958b-8ddb95f0bb0d). World aggregate used as a benchmark, drawn as a dashed line. Caveats on LULUCF and methane are relevant for NZ. |
| 11 | Child mortality in Sub-Saharan Africa vs South Asia | **Y**: under-5 mortality · Sub-Saharan Africa, South Asia (regional aggregates) · 2006–2025 | **82%** → **100%** after fix | [Report](https://trendlens-neon.vercel.app/r/d46102f1-88b6-4524-bebe-f1b5fd66ddbe). **Issue 2 again:** "5" (*under-5*) and "1,000" (*per 1,000 live births*) flagged ⚠ in 5 sentences; both come from the indicator name. Every data value verified. **Fixed (spec v1.4) and re-checked live on 16 Nov: 100%, no ⚠.** |
| 12 | Female labour force participation in India, Bangladesh and Pakistan | **Y**: female labour force participation · India, Bangladesh, Pakistan · 2006–2025 | **97%** → **100%** after fix | [Report](https://trendlens-neon.vercel.app/r/714f6c84-ead9-428c-a123-3e7fe7df9e13). **Issue 2 again:** "15" (*women aged 15+*) flagged ⚠ in one caveat. **Fixed (spec v1.4) and re-checked live on 16 Nov: 100%, no ⚠.** |
| 13 | How has access to electricity changed in Kenya and Ethiopia? | **Y**: access to electricity · Kenya, Ethiopia · 2006–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/613a7729-0e06-47ff-8e47-b54d1c8cbeb8). Spotted Kenya's 2010 dip and cautioned it may be a survey-method change. |
| 14 | Tourist arrivals in Thailand and Japan over the last 20 years | **Y**: tourist arrivals · Thailand, Japan · 2005–2025 | **100%** | [Report](https://trendlens-neon.vercel.app/r/68b79dca-4653-443d-af7e-0525e6923756). Data end in 2019 (Thailand) and 2020 (Japan); the AI ranked at 2019 and warned that Japan's −38.8% reflects one COVID year, not a trend. |
| 15 | Write me a poem about the economy *(should return a clarification, not a report)* | **Y**: no report; clarification shown | n/a | Message: *"I can't write poems, but I can build a data report on economic indicators. Try asking something like 'How has GDP growth and inflation changed in the USA vs China since 2000?'"* No data fetched, no report saved. |

**Result:**
| Measure | Target | Result |
|---|---|---|
| Sensible plans | ≥ 13/15 | **15/15** (14 reports + the off-topic question correctly refused) |
| Average verification rate | ≥ 95% | **97.7%** on the first pass (11 of 14 reports at 100%); **100% on all 14** after the two fixes (row 1 counted by its re-test) |
| Invented numbers left unflagged | 0 | **0 found** (data values spot-checked against each report's stats table) |
| Issues found | | **2**: (1) % change / CAGR shown for rate indicators → fixed and re-tested (row 1); (2) the verifier flags numbers that are part of the indicator's name (*65+*, *under-5*, *per 1,000*, *15+*), which pulled 3 reports below 100% (rows 6, 11, 12) → fixed and re-tested: all three now 100%. Every ⚠ in the test set was this false alarm; no real invented number was found. |

**Found → fixed → re-tested:** both issues came from running the app on real questions, were fixed the same week with unit tests (spec v1.3 and v1.4), and were re-checked on the live app.

**Riskiest-assumption verdict:** assumptions 1 (the AI picks the right indicators) and 2 (no invented numbers) **hold** on this test set. Assumption 3 (users value the narrative) still needs the user feedback in Step 6.
