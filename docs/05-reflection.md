# Reflection

**Marc Anthony Reyman · TrendLens · Graded Mini Project 4.2**

## What I built and for whom
My first idea was a compliance checker for Philippine government tenders. It solved a real problem, but my professor in New Zealand couldn't test it or relate to it, so I pivoted to something universal. TrendLens is for students and junior analysts who need credible country comparisons. You ask a question in plain English and get real World Bank data, charts, statistics and short insights. What makes it more than a chatbot wrapper: the AI only *plans* the query and *explains* the results, while tested code fetches the data, does the maths and checks every number the AI writes.

## What worked in the AI-assisted workflow
I built TrendLens with Claude Code as my coding agent. Writing the spec and `CLAUDE.md` first made the biggest difference. The rule "the LLM never supplies data or computes statistics" shaped every module. Revising the spec from v1.0 to v1.1 moved all the maths out of the model and added the verifier before any code existed. Pure functions with unit tests, run by CI on every push, let me change things quickly without breaking the app.

## What didn't work, and what I fixed
- **Data problems:** the World Bank had retired one indicator code, so every code had to be checked against the live API. Its occasional errors needed retries and caching, and during a real outage the app showed a clear message instead of crashing.
- **Deployment taught me the most.** The first Vercel build failed because the Clerk key was missing at build time. Vercel then warned about the `NEXT_PUBLIC_` prefix. Next, every page failed with a middleware error, because the "Quick copy" panel I had copied keys from had the secret key commented out. The lesson: when a deploy fails, check the environment variables first.
- **Testing found real issues.** I ran 15 questions on the live app: 15/15 sensible plans and 97.7% of numbers verified. It exposed two problems. The stats table showed a "compound growth rate" *of inflation*, which is misleading. And the verifier flagged numbers that belong to an indicator's name, like "65" in *aged 65+*. I fixed both with unit tests and re-tested them live. All 14 reports now verify at 100%.

## Trade-offs
- **32 curated indicators, not all of WDI:** less coverage, but the AI can't pick a code that doesn't exist.
- **Two AI calls, not one:** more cost and latency, but the narrative is grounded in computed numbers.
- **Stored data snapshots:** reports stay citable, but don't update automatically.
- **Public share links:** easy to open, but anyone with the link can view the report.

## Risks and ethics
"Verified" means a number exists in the data, not that every sentence interprets it fairly. Readers could also mistake correlation for causation, so the prompt forbids causal claims and the UI repeats that insights describe patterns, not causes. The daily quota limits cost abuse.

## What I'd do next (v2)
My GitHub issue proposes a correlation view (for example, internet use vs income across countries) and a one-page PDF brief. The example report already puts internet access next to income, so the natural follow-up is whether they move together. The PDF brief removes the step of screenshotting charts into a paper.
