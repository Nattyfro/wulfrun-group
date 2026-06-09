import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getIqResultsServer } from '../../src/lib/getIqResultsServer';

// ----------------------------------------------------------------------

type IqResultPayload = {
  userId?: string | null;
  email?: string | null;
  fullName?: string | null;
  authProvider: string;
  answers: number[];
  score: number;
  totalQuestions: number;
  estimatedIq: number;
  iqLabel: string;
};

function getWriteSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function handleGet(res: NextApiResponse) {
  const { results, error } = await getIqResultsServer();

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ results });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getWriteSupabase();

  if (!supabase) {
    return res.status(500).json({
      error: 'Supabase service role is not configured on the server.',
    });
  }

  const body = req.body as IqResultPayload;

  if (
    !body ||
    !Array.isArray(body.answers) ||
    typeof body.score !== 'number' ||
    typeof body.totalQuestions !== 'number' ||
    typeof body.estimatedIq !== 'number' ||
    typeof body.iqLabel !== 'string' ||
    typeof body.authProvider !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid quiz result payload.' });
  }

  const { error } = await supabase.from('iq_test_results').insert({
    user_id: body.userId || null,
    email: body.email || null,
    full_name: body.fullName || null,
    auth_provider: body.authProvider,
    score: body.score,
    total_questions: body.totalQuestions,
    estimated_iq: body.estimatedIq,
    iq_label: body.iqLabel,
    answers: body.answers,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ saved: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(res);
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
