-- Run this in Supabase → SQL Editor

create table if not exists public.iq_test_comments (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists iq_test_comments_created_at_idx
  on public.iq_test_comments (created_at desc);

alter table public.iq_test_comments enable row level security;

drop policy if exists "Experiment dashboard can read IQ comments" on public.iq_test_comments;

create policy "Experiment dashboard can read IQ comments"
  on public.iq_test_comments
  for select
  to anon, authenticated
  using (true);

-- Inserts are handled by the Next.js API route using the service role key.
