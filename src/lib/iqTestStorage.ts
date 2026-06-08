const PENDING_RESULTS_KEY = 'wulfrun-iq-pending-results';

export type PendingIqResults = {
  answers: number[];
  completedAt: string;
};

export function savePendingIqResults(answers: number[]) {
  if (typeof window === 'undefined') return;

  const payload: PendingIqResults = {
    answers,
    completedAt: new Date().toISOString(),
  };

  sessionStorage.setItem(PENDING_RESULTS_KEY, JSON.stringify(payload));
}

export function loadPendingIqResults(): PendingIqResults | null {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(PENDING_RESULTS_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingIqResults;
  } catch {
    return null;
  }
}

export function clearPendingIqResults() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_RESULTS_KEY);
}
