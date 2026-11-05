-- TrendLens schema. Run in the Supabase SQL editor (or `supabase db push`).

create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,          -- Clerk user id
  question      text not null,
  title         text not null,
  plan          jsonb not null,         -- sanitized query plan
  series        jsonb not null,         -- World Bank data snapshot
  narrative     jsonb,                  -- AI headline / insights / caveats (null if the AI step failed)
  retrieved_at  timestamptz not null,
  created_at    timestamptz not null default now()
);

create index if not exists reports_user_created_idx on public.reports (user_id, created_at desc);

-- RLS on with NO policies: the anon key can't read or write anything.
-- Only the server (service-role key) can, and it scopes list/delete by user_id.
alter table public.reports enable row level security;
