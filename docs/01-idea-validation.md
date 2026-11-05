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

## Step 3 — Evidence the problem is real
Desk research:
- The World Bank's World Development Indicators are the standard free source for country comparisons and are widely cited in business-school assignments.
- Existing tools (World Bank DataBank, Our World in Data) are powerful but assume you already know which indicator you need, and they don't write an interpretation.
- LLM hallucination of statistics is a well-documented problem. Universities increasingly ask students to verify AI-produced facts against primary sources.

Primary evidence (**TODO, collect at least 3**):
- [ ] Interview or survey classmates: "How long did your last country comparison take? Where did you get the data?" `TODO`
- [ ] Ask 2–3 people to answer one comparison question with ChatGPT or Claude, then check the numbers against the World Bank. Record how many were wrong. `TODO`
- [ ] Note from the professor or teaching assistant on what counts as an acceptable data source `TODO`

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
- `TODO: ask 3 people "Would you use this instead of DataBank + Excel? Would your team pay for it?"`

## Step 7 — Riskiest assumption and test
| Riskiest assumption | Test | Success signal |
|---|---|---|
| The AI maps plain-English questions to the *right* indicators | 15 test questions; check the chosen indicators by hand | ≥ 13/15 sensible plans |
| The narrative contains no invented numbers | Run the verifier on 15 reports | ≥ 95% of numbers verified; 0 unflagged fabrications |
| Users value the narrative, not just the chart | Show 3 users a report with and without the insights | ≥ 2/3 prefer it with insights |

`TODO: record the results after testing (great material for the reflection).`
