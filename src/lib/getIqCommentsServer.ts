import { createClient } from '@supabase/supabase-js';
import { IqComment } from './iqComments';

// ----------------------------------------------------------------------

export async function getIqCommentsServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return {
      comments: [] as IqComment[],
      error: 'Supabase URL is not configured.',
    };
  }

  const apiKey = serviceRoleKey || anonKey;

  if (!apiKey) {
    return {
      comments: [] as IqComment[],
      error: 'Supabase is not configured for comments.',
    };
  }

  const supabase = createClient(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from('iq_test_comments')
    .select('id, author_name, body, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    const needsSetup =
      error.message.toLowerCase().includes('does not exist') ||
      error.message.toLowerCase().includes('permission') ||
      error.message.toLowerCase().includes('policy');

    return {
      comments: [] as IqComment[],
      error: needsSetup
        ? `${error.message} Run supabase/iq_test_comments.sql in Supabase SQL Editor.`
        : error.message,
    };
  }

  return {
    comments: (data ?? []) as IqComment[],
    error: null as string | null,
  };
}
