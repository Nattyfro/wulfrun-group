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
