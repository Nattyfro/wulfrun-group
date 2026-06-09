import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IqTestResult } from './iqTestResults';

// ----------------------------------------------------------------------

function getAvatarFromMetadata(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return null;

  const avatarUrl = metadata.avatar_url || metadata.picture;

  return typeof avatarUrl === 'string' && avatarUrl.trim() ? avatarUrl : null;
}

async function enrichResultsWithAvatars(
  supabase: SupabaseClient,
  results: IqTestResult[],
  canUseAdminApi: boolean
) {
  if (!canUseAdminApi) {
    return results.map((result) => ({ ...result, avatar_url: null }));
  }

  return Promise.all(
    results.map(async (result) => {
      if (!result.user_id) {
        return { ...result, avatar_url: null };
      }

      const { data, error } = await supabase.auth.admin.getUserById(result.user_id);

      if (error || !data.user) {
        return { ...result, avatar_url: null };
      }

      return {
        ...result,
        avatar_url: getAvatarFromMetadata(data.user.user_metadata),
      };
    })
  );
}

export async function getIqResultsServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return {
      results: [] as IqTestResult[],
      error: 'Supabase URL is not configured.',
    };
  }

  const apiKey = serviceRoleKey || anonKey;

  if (!apiKey) {
    return {
      results: [] as IqTestResult[],
      error:
        'Supabase is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (recommended), or run the dashboard read policy SQL and keep your anon key.',
    };
  }

  const supabase = createClient(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from('iq_test_results')
    .select(
      'id, user_id, email, full_name, auth_provider, score, total_questions, estimated_iq, iq_label, created_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    const needsPolicy =
      error.message.toLowerCase().includes('permission') ||
      error.message.toLowerCase().includes('policy');

    return {
      results: [] as IqTestResult[],
      error: needsPolicy
        ? `${error.message} Run supabase/iq_test_results_dashboard_read.sql in Supabase SQL Editor, or add SUPABASE_SERVICE_ROLE_KEY to .env.local.`
        : error.message,
    };
  }

  const baseResults = (data ?? []).map((result) => ({
    ...(result as Omit<IqTestResult, 'avatar_url'>),
    avatar_url: null,
  }));

  const results = await enrichResultsWithAvatars(
    supabase,
    baseResults,
    Boolean(serviceRoleKey)
  );

  return {
    results,
    error: null as string | null,
  };
}
