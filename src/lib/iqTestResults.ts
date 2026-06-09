export type IqTestResult = {
  id: string;
  user_id: string | null;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  auth_provider: string;
  score: number;
  total_questions: number;
  estimated_iq: number;
  iq_label: string;
  created_at: string;
};

export type SaveIqResultInput = {
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

export async function saveIqResultToSupabase(input: SaveIqResultInput) {
  try {
    const response = await fetch('/api/iq-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        saved: false as const,
        error: result.error || 'Failed to save quiz result',
      };
    }

    return { saved: true as const };
  } catch (error) {
    return {
      saved: false as const,
      error: error instanceof Error ? error.message : 'Failed to save quiz result',
    };
  }
}

export async function fetchIqResults() {
  try {
    const response = await fetch('/api/iq-results');
    const result = await response.json();

    if (!response.ok) {
      return {
        results: [] as IqTestResult[],
        error: result.error || 'Failed to load quiz results',
      };
    }

    return {
      results: (result.results || []) as IqTestResult[],
      error: null as string | null,
    };
  } catch (error) {
    return {
      results: [] as IqTestResult[],
      error: error instanceof Error ? error.message : 'Failed to load quiz results',
    };
  }
}
