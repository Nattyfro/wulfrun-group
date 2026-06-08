-- Run this in the Supabase SQL editor after creating your project.

create table if not exists public.iq_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  score int not null,
  total_questions int not null,
  estimated_iq int not null,
  iq_label text not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.iq_test_results enable row level security;

create policy "Users can insert own IQ results"
  on public.iq_test_results
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own IQ results"
  on public.iq_test_results
  for select
  to authenticated
  using (auth.uid() = user_id);
