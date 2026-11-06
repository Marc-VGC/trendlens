# TrendLens

**Ask a question about the world. Get real World Bank data, charts, statistics, and AI insights with every number verified.**

> 🔗 **Live app:** **https://trendlens-neon.vercel.app** · 🎥 **Demo (2 min):** `TODO: paste your video link` · 📄 **Reflection:** [docs/05-reflection.md](docs/05-reflection.md)
>
> **No account needed to evaluate:** open [**/example**](https://trendlens-neon.vercel.app/example) (a full report) and [**/explore**](https://trendlens-neon.vercel.app/explore) (live charts for any country). Sign up to ask your own questions.

![CI](https://github.com/Marc-VGC/trendlens/actions/workflows/ci.yml/badge.svg)

---

## Try it in 3 minutes (for reviewers)
1. Open [**/example**](https://trendlens-neon.vercel.app/example): a full report (New Zealand vs Philippines vs World) with ✓ verified badges, charts, a stats table, sources and a CSV download. No account needed.
2. Open [**/explore**](https://trendlens-neon.vercel.app/explore): add a country (e.g. *Australia*), switch the indicator, and change the years. Live World Bank data, no AI.
3. Click **Ask a question** and sign up with email or Google. Clerk runs in development mode, so the sign-in form shows a small "Development mode" label. Then ask, for example:
   - *"Compare inflation in New Zealand, Australia and the United States over the last 15 years"*
   - *"How has life expectancy changed in Japan, India and Nigeria since 1990?"*
   - *"Which grew faster since 2000: renewable energy share in Germany or China?"*
4. The report takes about 15–30 seconds. Copy its share link and open it in an incognito window: shared reports are viewable without an account.

## The problem
Students and analysts constantly need credible country comparisons (GDP growth, inflation, internet adoption, ageing, renewables) for papers and market-entry memos. Doing it by hand is slow: find the indicator, download, clean, chart, compute, write. Asking a chatbot is fast but **unreliable: the numbers can be invented** and the sources are vague. See [docs/01-idea-validation.md](docs/01-idea-validation.md).

## How it works
1. **Ask:** *"Compare inflation in Australia, New Zealand and the US over the last 15 years."*
2. **AI planner:** Claude turns the question into a query plan: ISO3 countries, 1–3 indicators from a curated catalog of 32 real World Bank codes, and a year range. Code then sanitizes the plan.
3. **Real data:** TrendLens fetches the series from the World Bank Open Data API (no key needed, with retries and a 24h cache).
4. **Deterministic stats:** tested TypeScript computes change, % change, CAGR, min/max, rankings at the latest *common* year, and spreads.
5. **AI analyst:** Claude writes a headline, insights and caveats **from those stats only**.
6. **Verifier:** every number in the AI text is extracted and matched against the stats. Each insight gets a ✓ verified or ⚠ unverified badge, and the report shows an overall verification rate.
7. **Report:** charts, stats tables, sources, retrieval date, CSV download, and a shareable link.

**Why it isn't a chatbot wrapper:** the AI never supplies data. It plans and explains, and the code does the maths and checks the AI's work.

## Features
| | |
|---|---|
| 🌏 Coverage | 217 economies + regional and income-group aggregates (e.g. World, High income) |
| 📈 Indicators | 32 across economy, trade, people, digital, energy and environment, health and education, inequality |
| ✅ Hallucination guard | Number-level verification of the AI narrative |
| 🔗 Sharing | Reports are viewable by link without an account |
| 🧭 Explore | Manual chart builder with no AI (free, instant) |
| 💾 Reproducible | Each report stores its data snapshot and retrieval date |

## Tech stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Recharts |
| AI | Vercel AI SDK v7 (`generateText` + `Output.object`) + Claude (`claude-opus-5-5`, configurable) |
| Data | World Bank Open Data API v2 |
| Database | Supabase Postgres (saved reports) |
| Auth | Clerk |
| Deploy / CI | Vercel + GitHub Actions |
| Monitoring | Vercel Analytics (custom `report_created`, `report_failed`, `explore_used` events), Speed Insights, structured `[ask]` logs |
| Tests | Vitest (29 unit tests) |

Architecture: [docs/03-architecture.md](docs/03-architecture.md) · Spec: [spec.md](spec.md) · PRD: [docs/02-prd.md](docs/02-prd.md)

## Run locally
```bash
git clone https://github.com/Marc-VGC/trendlens.git
cd trendlens
npm install
cp .env.example .env.local   # fill in values (below)
npm run dev                  # http://localhost:3000
```
`/example` and `/explore` work without any keys. Clerk runs in "keyless" dev mode until you add your own keys.

### Environment variables
| Name | Where to get it | Public? |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys | ❌ server |
| `ANTHROPIC_MODEL` | optional, default `claude-opus-5-5` | ❌ server |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API keys | ✅ |
| `CLERK_SECRET_KEY` | Clerk dashboard → API keys | ❌ server |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `_SIGN_UP_URL` | `/sign-in`, `/sign-up` | ✅ |
| `SUPABASE_URL` | Supabase → Project settings → API | ❌ server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project settings → API (service_role) | ❌ **server only** |
| `DAILY_REPORT_LIMIT` | optional, default `15` | ❌ server |

**Supabase:** create a project → SQL editor → run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). RLS is on with no policies, so only the server can access the table.
**Clerk:** create an app (email + Google). In production, add your Vercel domain.

## Deploy (Vercel)
1. Push to a **public** GitHub repo.
2. In Vercel, choose **Add New → Project → Import** the repo, then add all the env vars (Production + Preview).
3. Deploy, then enable **Analytics** and **Speed Insights** in the project.
4. Test in an **incognito** window: `/`, `/example`, `/explore`, sign up, ask a question, open the share link signed out.

### CI/CD
[`.github/workflows/ci.yml`](.github/workflows/ci.yml): **lint → typecheck → tests → build → secret scan** on every push and PR. To deploy, use either:
- **Option A:** Vercel's Git integration (auto preview per PR, production on `main`). The `deploy` job skips itself when there's no `VERCEL_TOKEN`.
- **Option B (deploy only after CI passes):** add the `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` repo secrets and turn off Vercel's automatic Git deploys.

## Security
- No secrets in code; env vars only; `.env*` gitignored; CI secret scan
- `server-only` guards on the AI and DB modules; only `NEXT_PUBLIC_*` reaches the browser
- AI plans are sanitized against the catalog and country list **before** any World Bank URL is built
- zod validation on the question, Explore query params and route params
- Prompt-injection resistance: schema-constrained outputs; the analyst only sees computed numbers
- Per-user daily AI quota; Explore and report viewing cost nothing
- RLS blocks the anon key; list/delete scoped to the Clerk user; security headers

## Limitations
- World Bank data lags by 1–2 years and is sometimes revised (the example report shows one such revision in its caveats).
- The verifier checks that numbers *exist in the data*, not that every sentence is a fair interpretation.
- Annual, national-level indicators only; no forecasts or causal analysis.

## Roadmap (v2)
See the GitHub issue [*"v2: Correlation view + PDF brief export"*](https://github.com/Marc-VGC/trendlens/issues). Draft: [docs/06-v2-issue.md](docs/06-v2-issue.md).

## Assignment deliverables
| Phase | Deliverable | Where |
|---|---|---|
| 4 | Live app | https://trendlens-neon.vercel.app |
| 1 | 7-step idea validation (with *why now*) | [docs/01-idea-validation.md](docs/01-idea-validation.md) |
| 1 | 1-page PRD | [docs/02-prd.md](docs/02-prd.md) |
| 2 | Architecture notes | [docs/03-architecture.md](docs/03-architecture.md) |
| 2 | spec.md + revision history | [spec.md](spec.md) |
| 2 | Agent rules | [CLAUDE.md](CLAUDE.md), [.cursorrules](.cursorrules) |
| 3 | Unit tests | [src/lib/\_\_tests\_\_/](src/lib/__tests__) |
| 4 | CI/CD | [.github/workflows/ci.yml](.github/workflows/ci.yml) |
| 4 | Monitoring | Vercel Analytics + Speed Insights (enabled), custom events, `[ask]` function logs |
| 5 | Demo (2 min) | `TODO: video link` · script: [docs/04-demo-script.md](docs/04-demo-script.md) |
| 5 | Reflection | [docs/05-reflection.md](docs/05-reflection.md) |
| 5 | v2 issue | [GitHub issues](https://github.com/Marc-VGC/trendlens/issues) · draft: [docs/06-v2-issue.md](docs/06-v2-issue.md) |

---
Data © World Bank, licensed CC BY 4.0. Built for AIM Graded Assignment 4.2 with AI-assisted coding (Claude Code).
