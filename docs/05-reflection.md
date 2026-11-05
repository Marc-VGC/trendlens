# Reflection (1 page)

> **Write this yourself, in your own voice.** The prompts below are a structure only. Aim for ~400–500 words. Concrete examples beat general statements.

## 1. What I built and for whom
One paragraph: the user (students and analysts comparing countries), the problem (slow manual work vs unreliable chatbots), and what makes TrendLens different (the AI plans and explains; code fetches, computes and verifies).

## 2. What worked in the AI-assisted workflow
- Which phase did AI help most: spec, scaffolding, tests, debugging?
- An example where writing `spec.md` / `CLAUDE.md` first made the generated code better.

## 3. What didn't work / what I corrected
Prompts to consider:
- The World Bank had retired an indicator code (`EN.ATM.CO2E.PC`); I had to check every code against the live API.
- The API sometimes returned non-JSON errors, so I added retries.
- The first verifier design let small invented numbers through (e.g. "5%"); a test caught it, and I tightened the rule.
- Spec v1.0 → v1.1: moving the maths out of the LLM.
- Your test results: how many of 15 questions got sensible plans? What verification rate did real reports get?

## 4. Trade-offs I made
- A curated catalog of 32 indicators vs letting the AI search all of WDI (safety and accuracy vs coverage)
- Storing data snapshots (reproducible, citable) vs always showing the latest data
- Two AI calls (planner + analyst) vs one: cost and latency vs grounding
- Public share links vs private reports

## 5. Risks and ethics
Over-trusting "verified" numbers (the verifier checks existence, not interpretation); presenting correlation as causation; World Bank data revisions; cost abuse.

## 6. What I'd do next (v2)
Link to the GitHub issue, and explain why that feature is the most valuable next step for users.
