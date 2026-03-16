const STORAGE_KEY = "dj_proactive_state";

interface ProactiveState {
  lastProactiveMessageTime: number;
  recentTriggers: Record<string, number>;
}

function getProactiveState(): ProactiveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        lastProactiveMessageTime: parsed.lastProactiveMessageTime ?? 0,
        recentTriggers: parsed.recentTriggers ?? {},
      };
    }
  } catch {}
  return { lastProactiveMessageTime: 0, recentTriggers: {} };
}

function saveProactiveState(state: ProactiveState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function canSendGlobalMessage(): boolean {
  const state = getProactiveState();
  if (state.lastProactiveMessageTime === 0) return true;
  return Date.now() - state.lastProactiveMessageTime > 10 * 60 * 1000;
}

export function recordProactiveMessage(): void {
  const state = getProactiveState();
  saveProactiveState({ ...state, lastProactiveMessageTime: Date.now() });
}

export function hasFiredRecently(triggerId: string, windowMs: number): boolean {
  const state = getProactiveState();
  const fired = state.recentTriggers[triggerId];
  if (!fired) return false;
  return Date.now() - fired < windowMs;
}

export function recordTrigger(triggerId: string): void {
  const state = getProactiveState();
  const updated = { ...state.recentTriggers, [triggerId]: Date.now() };
  saveProactiveState({ ...state, recentTriggers: updated });
}
