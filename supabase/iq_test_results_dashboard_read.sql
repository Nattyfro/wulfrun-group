-- Run this in Supabase → SQL Editor if Experiment II cannot load results
-- without the server-side service role key.

drop policy if exists "Experiment dashboard can read IQ results" on public.iq_test_results;

create policy "Experiment dashboard can read IQ results"
  on public.iq_test_results
  for select
  to anon, authenticated
  using (true);
