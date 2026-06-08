import { getSupabase } from './supabase';

type SaveIqResultInput = {
  userId: string;
  answers: number[];
  score: number;
  totalQuestions: number;
  estimatedIq: number;
  iqLabel: string;
};

export async function saveIqResultToSupabase(input: SaveIqResultInput) {
  const supabase = getSupabase();
  if (!supabase) return { saved: false as const, error: 'Supabase is not configured' };

  const { error } = await supabase.from('iq_test_results').insert({
    user_id: input.userId,
    score: input.score,
    total_questions: input.totalQuestions,
    estimated_iq: input.estimatedIq,
    iq_label: input.iqLabel,
    answers: input.answers,
  });

  if (error) {
    return { saved: false as const, error: error.message };
  }

  return { saved: true as const };
}
