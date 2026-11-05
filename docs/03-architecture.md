# Architecture Notes — TrendLens

## System overview

```
Browser (Next.js React UI, Tailwind, Recharts)
   │ question                               ▲ report page (public by link)
   ▼                                        │
Next.js 14 App Router on Vercel ────────────┘
  ├─ middleware.ts ── Clerk (protects /ask, /reports)
  ├─ POST /api/ask   (auth, Node runtime, maxDuration 60s)
  │    1. validate question (5–500 chars)              lib/validation.ts
  │    2. daily quota (Supabase count)                 lib/db.ts
  │    3. AI #1 planner → raw plan (zod)               lib/ai.ts
  │    4. sanitizePlan() vs catalog + country list     lib/plan.ts      (pure, tested)
  │    5. fetch World Bank series (retry, 24h cache)   lib/worldbank.ts (parse is pure, tested)
  │    6. computeStats()                               lib/stats.ts     (pure, tested)
  │    7. AI #2 analyst → headline/insights/caveats    lib/ai.ts
  │    8. save report snapshot                         lib/db.ts
  │    → { id }
  ├─ GET /api/data   (public, no AI) Explore page data: validated query → World Bank → stats
  ├─ /r/[id]         public report: charts + stats + verifyNarrative() badges + CSV + sources
  ├─ /example        bundled example report (real data snapshot, no AI call, no auth)
  ├─ /explore        public manual builder (no AI)
  └─ /reports        user's report history

External services
  ├─ World Bank Open Data API v2  (no key)         https://api.worldbank.org/v2
  ├─ Anthropic API (Claude)       ANTHROPIC_API_KEY
  ├─ Supabase Postgres            SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
  ├─ Clerk                        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
  └─ Vercel Analytics + Speed Insights
```

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Data source | World Bank WDI API | Free, no key, 200+ economies, decades of data, citable |
| AI role | **Planner + writer only**; never a data source | Prevents hallucinated statistics |
| Indicator selection | Curated catalog (`lib/indicators.ts`, ~30 indicators) used as a zod enum | The AI can only choose codes that exist; easy to extend |
| Statistics | Pure TypeScript (`lib/stats.ts`) | Deterministic, unit-tested, explainable |
| Hallucination guard | `verifyNarrative()` extracts every number from the AI text and matches it to the computed stats (with rounding tolerance and unit scaling) | Measurable trust; unverified numbers are flagged, not hidden |
| Reproducibility | The report stores the **data snapshot** + retrieval date | Charts don't change when the World Bank revises data; citations stay valid |
| Sharing | Reports are viewable by unguessable UUID link; listing/deleting requires the owner | Easy to share with a professor or group |
| Caching | `fetch(..., { next: { revalidate: 86400 } })` + 3 retries with backoff | The WB API is occasionally flaky; data changes rarely |
| Auth ↔ DB | Clerk identity; Supabase accessed only server-side with the service-role key; RLS on with no policies | Simple and secure |
| Model | `ANTHROPIC_MODEL`, default `claude-opus-5-5`; effort `low` for the planner, `medium` for the analyst | Quality vs latency balance; swappable |
| Monitoring | Vercel Analytics (+ `report_created`, `explore_used` events), Speed Insights, structured logs `[ask] ms=… tokens=… verified=…%` | Zero-config on Vercel |

## Data model (Supabase)

```sql
reports(id uuid pk, user_id text, question text, title text,
        plan jsonb, series jsonb, narrative jsonb,
        retrieved_at timestamptz, created_at timestamptz)
```

## Security checklist
- [x] Secrets only in env vars; `.env.example` has names only; `.env*` gitignored; CI secret scan
- [x] `server-only` on `lib/ai.ts` and `lib/db.ts`
- [x] Input validation: question length; zod on `/api/data` query params; route params validated as UUID
- [x] Plan sanitized against the catalog and country list before any external call (no URL injection into the WB API)
- [x] Prompt injection: the question is user data; output is schema-constrained; the second AI call only sees computed numbers
- [x] Per-user daily quota on the AI endpoint; Explore uses no AI
- [x] Security headers in `next.config.mjs`
