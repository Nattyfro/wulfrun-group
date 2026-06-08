const PENDING_RESULTS_KEY = 'wulfrun-iq-pending-results';

export type PendingIqResults = {
  answers: number[];
  completedAt: string;
};

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export function savePendingIqResults(answers: number[]) {
  const storage = getStorage();
  if (!storage) return;

  const payload: PendingIqResults = {
    answers,
    completedAt: new Date().toISOString(),
  };

  storage.setItem(PENDING_RESULTS_KEY, JSON.stringify(payload));
}

export function loadPendingIqResults(): PendingIqResults | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(PENDING_RESULTS_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingIqResults;
  } catch {
    return null;
  }
}

export function clearPendingIqResults() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(PENDING_RESULTS_KEY);
}
