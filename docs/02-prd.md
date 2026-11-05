# TrendLens — Product Requirements (1-page PRD)

**Owner:** Marc · **Status:** v1.0 (assignment build) · **Stack:** Next.js 14, Tailwind, Vercel AI SDK + Claude, Supabase, Clerk, Vercel, World Bank Open Data API

## Problem
Students and analysts need credible cross-country comparisons of development and economic indicators. Doing it by hand is slow (find indicator → download → clean → chart → compute → write). Asking a chatbot is fast but unreliable: the numbers can be invented and the sources are vague.

## Target user
Business and MBA students and junior analysts writing country or market analyses.

## Goals and success metrics
| Metric | Target (v1) |
|---|---|
| Question → finished report | < 30 seconds |
| Sensible query plans on the 15-question test set | ≥ 13/15 |
| Numbers in AI insights that verify against the data | ≥ 95%, with any unverified number flagged in the UI |
| Report usable in a paper | Every chart has a source, year range, and retrieval date |

## User stories (v1)
1. **As a student**, I type a question like *"Compare inflation in New Zealand, Australia and the Philippines since 2010"* and get charts, a stats table, and 3–5 written insights.
2. **As a student**, I can see **which numbers the AI used and that they're verified** against the data.
3. **As a student**, I can download the data as CSV and copy the source citation.
4. **As a student**, I can share a report by link with my group or professor (no account needed to view).
5. **As any visitor**, I can use **Explore** (pick countries and an indicator, no AI) and view an **example report** without signing up.
6. **As a signed-in user**, I see my past reports and can delete them.

## Out of scope (v1)
Forecasting, causal claims, sub-national data, non-World-Bank sources, PDF export, payments, team workspaces.

## AI capabilities
1. **Planner:** Claude turns the question into a schema-validated query plan (countries as ISO3 codes, 1–3 indicators from the catalog, year range, title). Invalid parts are removed in code.
2. **Analyst:** Claude writes a headline, insights and caveats **only from the computed statistics** supplied to it. A deterministic verifier checks every number.

## Constraints and non-functional requirements
- No hardcoded secrets; env vars only
- Max 6 countries, 3 indicators, years 1960–last year
- Daily per-user AI quota; Explore and viewing reports don't use AI
- World Bank responses are cached for 24h; transient API failures are retried
- Works at 375px width; deployed on Vercel; CI on GitHub Actions

## Risks
| Risk | Mitigation |
|---|---|
| AI picks the wrong indicator | Curated catalog with descriptions; the plan is shown to the user; Explore lets them adjust |
| Hallucinated numbers | Narrative generated only from stats; number verifier; ⚠ badge on unverified numbers |
| Missing data for some countries or years | Stats use the latest *common* year; caveats list gaps |
| World Bank API outage | Retries + 24h cache; clear error message |
| Readers over-interpreting correlations | Prompt forbids causal claims; standard caveat in the UI |
