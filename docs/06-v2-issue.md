# GitHub issue draft: v2 improvement

Create it on GitHub (**Issues → New issue**): title *v2: Correlation view + PDF brief export*, label `enhancement`, and paste everything below the line as the body. Or run:
```
gh issue create --title "v2: Correlation view + PDF brief export" --label enhancement --body "$(sed '1,/^---$/d' docs/06-v2-issue.md)"
```

---

## Problem
TrendLens v1 compares countries on one indicator at a time. The [example report](https://trendlens-neon.vercel.app/example) shows internet use and GDP per capita as two separate charts, but it can't say whether the two **move together**, which is the natural next question. Reports are also hard to reuse: getting a chart into a paper or slide deck means taking screenshots.

Who this is for: the target users and [hypothetical personas](https://github.com/Marc-VGC/trendlens/blob/main/docs/01-idea-validation.md#hypothetical-personas-not-yet-validated) in the validation report (analysts, students, journalists). In 3 interviews, nobody asked for these two features directly. They follow from the example report and from the v1 test log, while the most-requested change (more data sources) is listed below as the next issue.

## Proposal
1. **Correlation view:** when a plan has 2 indicators, add a scatter plot (x = indicator A, y = indicator B, one point per country at the latest common year) and a Pearson *r* computed in `stats.ts`.
   - The analyst prompt receives *r* and must say "associated with", never "causes".
   - The verifier already covers the new number.
   - Lesson from v1 testing: countries' latest data years often differ (e.g. US 2024 vs NZ 2025), so both indicators must use the same year for every country, shown on the chart.
2. **PDF brief export:** a "Download brief" button renders the headline, verified insights, the verification rate, the main chart, the stats table and the source citation into a one-page A4 PDF.
3. **More benchmarks:** add regional aggregates (e.g. "East Asia & Pacific") to a report in one click.

## Acceptance criteria
- [ ] `pearson(xs, ys)` in `stats.ts` with unit tests (perfect positive, perfect negative, fewer than 3 points → `null`)
- [ ] The scatter chart appears only when there are 2 indicators and at least 3 countries with data for the same year
- [ ] *r* appears in the narrative only with non-causal wording (prompt rule + manual review of 10 reports)
- [ ] The PDF brief works on mobile and desktop and includes the source, retrieval date and verification rate
- [ ] All existing tests still pass; the live test log is re-run with 3 new two-indicator questions

## Context from v1
- [Live test log](https://github.com/Marc-VGC/trendlens/blob/main/docs/01-idea-validation.md#test-log-run-on-httpstrendlens-neonvercelapp): 15/15 sensible plans, 97.7% verified on the first pass, 2 issues found, fixed and re-tested (spec v1.3 and v1.4).
- [3 user interviews](https://github.com/Marc-VGC/trendlens/blob/main/docs/01-idea-validation.md#hypotheses-vs-interviews) after people tried the live app:
  - 3/3 would use it.
  - 3/3 said the ✓ badges raised trust.
  - 2/3 would pay US$5–10/month.
  - **2/3 asked for more data sources first**; 1 asked for a choice of LLM.
  - Nobody asked for the export features below.

## Requested by users (next after this issue)
- **More sources (IMF WEO, OECD)** behind the same plan → fetch → stats → verify pipeline (asked for by 2 of 3 interviewees)
- A choice of LLM for the narrative (1 of 3)

## Also considered (not requested in interviews)
- Chart export as PNG or straight to PowerPoint
- More chart controls: bar charts, nominal vs real GDP
- A choice of insight style (formal prose or bullet points)
- Email alerts when the World Bank publishes new data for a saved report
- Team workspaces for class groups
