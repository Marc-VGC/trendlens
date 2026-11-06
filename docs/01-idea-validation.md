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
`TODO: run these on the live app (each takes about 20 s) and fill in the table. Copy the verification rate from the report header.`

| # | Question | Plan sensible? (Y/N) | Verification rate | Notes |
|---|---|---|---|---|
| 1 | Compare inflation in New Zealand, Australia and the United States over the last 15 years | | | |
| 2 | How has life expectancy changed in Japan, India and Nigeria since 1990? | | | |
| 3 | GDP growth in the Philippines, Vietnam and Indonesia since 2000 | | | |
| 4 | Which countries in Southeast Asia have the highest internet use? | | | |
| 5 | Renewable energy share in Germany vs China since 2000 | | | |
| 6 | Youth and ageing: share of people 65+ in Japan, Italy and South Korea | | | |
| 7 | Unemployment in Spain, Greece and Portugal after 2008 | | | |
| 8 | Government debt in Japan, the US and the UK | | | |
| 9 | Remittances as a share of GDP in the Philippines, Mexico and Nepal | | | |
| 10 | CO2 per person in Australia, New Zealand and the world | | | |
| 11 | Child mortality in Sub-Saharan Africa vs South Asia | | | |
| 12 | Female labour force participation in India, Bangladesh and Pakistan | | | |
| 13 | How has access to electricity changed in Kenya and Ethiopia? | | | |
| 14 | Tourist arrivals in Thailand and Japan over the last 20 years | | | |
| 15 | Write me a poem about the economy *(should return a clarification, not a report)* | | n/a | |

**Result:** `TODO` / 15 sensible plans (target ≥ 13) · average verification rate `TODO`% (target ≥ 95%) · fabricated numbers left unflagged: `TODO` (target 0)
