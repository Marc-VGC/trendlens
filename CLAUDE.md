# CLAUDE.md — TrendLens

Instructions for AI coding agents (Claude Code, Cursor, etc.) working in this repo.

## What this is
TrendLens answers plain-English questions about development and economic trends with real World Bank data, tested statistics, charts, and an AI narrative whose numbers are verified. Behaviour: `spec.md`. Architecture: `docs/03-architecture.md`.

## Stack
Next.js 14 App Router (TypeScript, `src/`), Tailwind 3, Recharts 3, Vercel AI SDK v7 (`ai`, `@ai-sdk/anthropic`), zod 4, Clerk v6, Supabase JS v2, Vitest.

## Commands
`npm run dev` · `npm test` · `npm run typecheck` · `npm run lint` · `npm run build`. CI runs all of them (`.github/workflows/ci.yml`).

## Layout
- `src/lib/indicators.ts`: curated World Bank indicator catalog (add indicators here; check the code against the live API first)
- `src/data/countries.json`: World Bank economies and aggregates
- `src/lib/plan.ts`: sanitizes AI query plans (pure, tested)
- `src/lib/worldbank.ts`: API client; `parseWorldBankResponse` is pure and tested
- `src/lib/stats.ts`: all statistics (pure, tested)
- `src/lib/verify.ts`: number extraction and narrative verification (pure, tested)
- `src/lib/ai.ts`: the **only** place that calls the LLM
- `src/lib/db.ts`: server-only Supabase access
- `src/app/api/ask/route.ts`: AI pipeline; `src/app/api/data/route.ts`: public data endpoint

## Rules
1. **The LLM never supplies data or computes statistics.** It plans queries and writes from computed stats only.
2. Never hardcode secrets; add new env names to `.env.example` without values.
3. Never import `lib/ai.ts` or `lib/db.ts` in client components.
4. Validate every external input (zod / `lib/validation.ts`). Sanitize AI plans before building World Bank URLs.
5. Every new pure function gets a Vitest test. Run `npm test && npm run typecheck` before committing.
6. Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `ci:`, `chore:`.
7. Don't send `temperature`/`top_p` to Claude; current models reject them.
