import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getIqCommentsServer } from '../../src/lib/getIqCommentsServer';

// ----------------------------------------------------------------------

type CommentPayload = {
  authorName: string;
  body: string;
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
  const { comments, error } = await getIqCommentsServer();

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ comments });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getWriteSupabase();

  if (!supabase) {
    return res.status(500).json({
      error: 'Supabase service role is not configured on the server.',
    });
  }

  const body = req.body as CommentPayload;

  if (
    !body ||
    typeof body.authorName !== 'string' ||
    typeof body.body !== 'string' ||
    !body.authorName.trim() ||
    !body.body.trim()
  ) {
    return res.status(400).json({ error: 'Name and comment are required.' });
  }

  if (body.authorName.trim().length > 80) {
    return res.status(400).json({ error: 'Name is too long.' });
  }

  if (body.body.trim().length > 1000) {
    return res.status(400).json({ error: 'Comment is too long.' });
  }

  const { data, error } = await supabase
    .from('iq_test_comments')
    .insert({
      author_name: body.authorName.trim(),
      body: body.body.trim(),
    })
    .select('id, author_name, body, created_at')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ comment: data });
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
