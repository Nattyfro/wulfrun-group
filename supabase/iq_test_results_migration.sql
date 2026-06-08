-- Run this if you already created iq_test_results with the older schema.

alter table public.iq_test_results
  alter column user_id drop not null;

alter table public.iq_test_results
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists auth_provider text not null default 'email';

create index if not exists iq_test_results_created_at_idx
  on public.iq_test_results (created_at desc);

create index if not exists iq_test_results_email_idx
  on public.iq_test_results (email);
