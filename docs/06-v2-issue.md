# GitHub issue draft: v2 improvement

Create it on GitHub (**Issues → New issue**) and paste everything below the line as the body, or run:
```
gh issue create --title "v2: Correlation view + PDF brief export" --label enhancement --body "$(sed '1,/^---$/d' docs/06-v2-issue.md)"
```

---

## Problem
Users writing papers and memos want to (1) see how two indicators relate across countries (e.g. *internet use vs GDP per capita*), and (2) drop a polished one-page brief into a report. Today they screenshot charts by hand.

## Proposal
1. **Correlation view:** when a plan has 2 indicators, add a scatter plot (x = indicator A, y = indicator B, one point per country at the latest common year) and a Pearson *r* computed in `stats.ts`.
   - The analyst prompt gets *r* and must say "associated with", never "causes".
   - The verifier already covers the new number.
2. **PDF brief export:** a "Download brief" button renders the headline, verified insights, the main chart, the stats table and the source citation into a one-page A4 PDF.
3. **More benchmarks:** let users add regional aggregates (e.g. "East Asia & Pacific") in one click from the report.

## Acceptance criteria
- [ ] `pearson(xs, ys)` in `stats.ts` with unit tests (perfect positive, perfect negative, < 3 points → null)
- [ ] Scatter chart appears only when there are 2 indicators and ≥ 3 countries with data
- [ ] PDF export works on mobile and desktop, includes the source and retrieval date
- [ ] Narrative uses non-causal language (prompt rule + manual review of 10 reports)

## Also considered
- Email alerts when the World Bank publishes new data for a saved report
- More sources (IMF WEO, OECD) behind the same plan → fetch → stats → verify pipeline
- Team workspaces for class groups
