import { useEffect, useRef } from "react";
import { useContextEngine } from "../../context/ContextEngineContext";
import {
  useFinanceEntries,
  useMemories,
  useTasks,
} from "../../hooks/useQueries";
import {
  canSendGlobalMessage,
  hasFiredRecently,
  recordProactiveMessage,
  recordTrigger,
} from "../state/proactiveState";

function getTodayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface PendingMessage {
  message: string;
  type: "reminder" | "suggestion" | "alert";
  triggerId: string;
  isCritical: boolean;
}

export function useProactiveEngine(): void {
  const contextEngine = useContextEngine();
  const { data: tasks } = useTasks();
  const { data: memories } = useMemories();
  const { data: financeEntries } = useFinanceEntries();

  const pendingMessageRef = useRef<PendingMessage | null>(null);
  const typingDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const financeWasOnFinancePageRef = useRef(false);
  const financeVisitCountRef = useRef(0);

  // Use refs to access latest values inside setInterval without stale closures
  const isTypingRef = useRef(false);
  const isVoiceListeningRef = useRef(false);
  const currentPageRef = useRef("/");
  const tasksRef = useRef(tasks);
  const memoriesRef = useRef(memories);
  const financeEntriesRef = useRef(financeEntries);

  isTypingRef.current = contextEngine.isTyping;
  isVoiceListeningRef.current = contextEngine.isVoiceListening;
  currentPageRef.current = contextEngine.currentPage;
  tasksRef.current = tasks;
  memoriesRef.current = memories;
  financeEntriesRef.current = financeEntries;

  useEffect(() => {
    function dispatchPending() {
      const pending = pendingMessageRef.current;
      if (!pending) return;
      pendingMessageRef.current = null;
      dispatchMessageNow(
        pending.message,
        pending.type,
        pending.isCritical,
        pending.triggerId,
      );
    }

    function dispatchMessageNow(
      message: string,
      type: "reminder" | "suggestion" | "alert",
      isCritical: boolean,
      triggerId: string,
    ) {
      if (isVoiceListeningRef.current) return;
      window.dispatchEvent(
        new CustomEvent("dj-proactive-message", {
          detail: { content: message, type, isCritical, triggerId },
        }),
      );
    }

    function dispatchMessage(
      message: string,
      type: "reminder" | "suggestion" | "alert",
      isCritical: boolean,
      triggerId: string,
    ) {
      if (isVoiceListeningRef.current) return;

      if (isTypingRef.current) {
        pendingMessageRef.current = { message, type, triggerId, isCritical };
        if (typingDelayRef.current) clearTimeout(typingDelayRef.current);
        typingDelayRef.current = setTimeout(dispatchPending, 5000);
        return;
      }

      dispatchMessageNow(message, type, isCritical, triggerId);
    }

    function runChecks() {
      const proactiveMode = localStorage.getItem("dj_proactive_mode");
      if (proactiveMode === "false") return;

      const now = Date.now();
      const allTasks = tasksRef.current ?? [];
      const allMemories = memoriesRef.current ?? [];
      const allFinance = financeEntriesRef.current ?? [];
      const currentPage = currentPageRef.current;

      // Check 1 — Tasks due in ≤10 min (CRITICAL)
      for (const task of allTasks) {
        if (task.completed) continue;
        const deadlineArr = task.deadline as unknown as [] | [bigint];
        if (!deadlineArr || deadlineArr.length === 0) continue;
        const deadlineMs = Number(deadlineArr[0]) / 1_000_000;
        const diffMs = deadlineMs - now;
        if (diffMs > 0 && diffMs <= 10 * 60 * 1000) {
          const triggerId = `task_due_${task.id}`;
          if (!hasFiredRecently(triggerId, 15 * 60 * 1000)) {
            recordTrigger(triggerId);
            dispatchMessage(
              `You have a task due soon: ${task.title}.`,
              "reminder",
              true,
              triggerId,
            );
          }
        }
      }

      // Check 2 — Overdue tasks (CRITICAL)
      for (const task of allTasks) {
        if (task.completed) continue;
        const deadlineArr = task.deadline as unknown as [] | [bigint];
        if (!deadlineArr || deadlineArr.length === 0) continue;
        const deadlineMs = Number(deadlineArr[0]) / 1_000_000;
        if (deadlineMs < now) {
          const triggerId = `task_overdue_${task.id}`;
          if (!hasFiredRecently(triggerId, 30 * 60 * 1000)) {
            recordTrigger(triggerId);
            dispatchMessage(
              `"${task.title}" looks overdue. Would you like to reschedule it?`,
              "reminder",
              true,
              triggerId,
            );
          }
        }
      }

      // Check 3 — Knowledge stale (non-critical)
      for (const memRaw of allMemories) {
        try {
          const mem = JSON.parse(memRaw as unknown as string);
          if (
            !mem.refreshInterval ||
            mem.refreshInterval === "none" ||
            mem.refreshInterval === "Never"
          ) {
            continue;
          }
          const lastRefreshed: number = mem.lastRefreshed ?? 0;
          let intervalMs = 24 * 60 * 60 * 1000;
          if (
            mem.refreshInterval === "weekly" ||
            mem.refreshInterval === "Weekly"
          ) {
            intervalMs = 7 * 24 * 60 * 60 * 1000;
          } else if (
            mem.refreshInterval === "monthly" ||
            mem.refreshInterval === "Monthly"
          ) {
            intervalMs = 30 * 24 * 60 * 60 * 1000;
          }
          const isStale = Date.now() - lastRefreshed > intervalMs;
          if (isStale) {
            const sourceId = mem.id ?? mem.url ?? String(lastRefreshed);
            const triggerId = `knowledge_stale_${sourceId}`;
            if (
              canSendGlobalMessage() &&
              !hasFiredRecently(triggerId, 60 * 60 * 1000)
            ) {
              recordProactiveMessage();
              recordTrigger(triggerId);
              dispatchMessage(
                "A knowledge source may need refreshing. Head to Knowledge Base to update it.",
                "alert",
                false,
                triggerId,
              );
              break; // Only fire once per check cycle
            }
          }
        } catch {
          // skip malformed memories
        }
      }

      // Check 4 — Daily briefing on Dashboard (non-critical)
      if (currentPage === "/" || currentPage === "/dashboard") {
        const dateKey = getTodayDateKey();
        const briefingKey = `dj_briefing_dismissed_${dateKey}`;
        const triggerId = `daily_briefing_${dateKey}`;
        if (
          !localStorage.getItem(briefingKey) &&
          !hasFiredRecently(triggerId, 24 * 60 * 60 * 1000)
        ) {
          recordTrigger(triggerId);
          window.dispatchEvent(new CustomEvent("dj-show-briefing"));
          // No cooldown consumed, no chat message — DashboardPage handles briefing UI
        }
      }

      // Check 5 — Finance context (non-critical, once per page visit)
      if (currentPage === "/finance") {
        if (!financeWasOnFinancePageRef.current) {
          financeWasOnFinancePageRef.current = true;
          const dateKey = getTodayDateKey();
          const todayMidnight = new Date();
          todayMidnight.setHours(0, 0, 0, 0);
          const todayMs = todayMidnight.getTime();
          const todayEntries = allFinance.filter((entry) => {
            const entryMs = Number(entry.createdAt) / 1_000_000;
            return entryMs >= todayMs;
          });
          if (todayEntries.length > 0) {
            const visitCount = financeVisitCountRef.current;
            const triggerId = `finance_context_${dateKey}_visit_${visitCount}`;
            if (
              canSendGlobalMessage() &&
              !hasFiredRecently(triggerId, 5 * 60 * 1000)
            ) {
              recordProactiveMessage();
              recordTrigger(triggerId);
              dispatchMessage(
                "You logged expenses earlier today. Want to see a quick summary?",
                "suggestion",
                false,
                triggerId,
              );
            }
          }
        }
      } else if (financeWasOnFinancePageRef.current) {
        financeWasOnFinancePageRef.current = false;
        financeVisitCountRef.current += 1;
      }
    }

    const intervalId = setInterval(runChecks, 60 * 1000);

    return () => {
      clearInterval(intervalId);
      if (typingDelayRef.current) clearTimeout(typingDelayRef.current);
    };
  }, []);
}
