-- Run this in Supabase → SQL Editor

create table if not exists public.iq_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  full_name text,
  auth_provider text not null default 'email',
  score int not null,
  total_questions int not null,
  estimated_iq int not null,
  iq_label text not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists iq_test_results_created_at_idx
  on public.iq_test_results (created_at desc);

create index if not exists iq_test_results_email_idx
  on public.iq_test_results (email);

alter table public.iq_test_results enable row level security;

drop policy if exists "Users can insert own IQ results" on public.iq_test_results;
drop policy if exists "Users can read own IQ results" on public.iq_test_results;

create policy "Users can read own IQ results"
  on public.iq_test_results
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Inserts are handled by the Next.js API route using the service role key.
