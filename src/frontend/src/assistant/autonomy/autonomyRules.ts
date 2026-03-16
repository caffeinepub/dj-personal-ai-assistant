/**
 * Autonomy Rules
 *
 * Five rule functions that analyse system state and return an
 * AutonomySuggestion when a condition is met, or null otherwise.
 * Pure functions — no side effects.
 */

import type { Plan } from "../planner/planTypes";
import type { AutonomySuggestion } from "./autonomySuggestions";

export interface AutonomySystemState {
  plans: Plan[];
  tasks: any[];
  memories: any[];
  knowledgeSources: any[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface ParsedMemoryNode {
  id: string;
  type: string;
  content: string;
  importance: number;
  tags: string[];
  createdAt: number;
  lastAccessed: number | undefined;
  rawId: string;
}

function parseMemoryRaw(raw: any): ParsedMemoryNode | null {
  if (!raw) return null;
  // Memories are stored with content that may be a JSON MemoryNode string
  let content = typeof raw.content === "string" ? raw.content : "";
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed.type === "string") {
      return {
        id: parsed.id ?? String(raw.id ?? ""),
        type: parsed.type,
        content: parsed.content ?? content,
        importance: parsed.importance ?? 3,
        tags: parsed.tags ?? [],
        createdAt: parsed.createdAt ?? 0,
        lastAccessed: parsed.lastAccessed,
        rawId: String(raw.id ?? parsed.id ?? ""),
      };
    }
  } catch {
    // not a JSON memory node — skip
  }
  return null;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

// ── Rule 1: Stalled Plan ─────────────────────────────────────────────────────

/**
 * If an active plan was created > 7 days ago and has no completed steps,
 * suggest continuing it.
 */
export function stalledPlanRule(
  state: AutonomySystemState,
): AutonomySuggestion | null {
  const now = Date.now();
  for (const plan of state.plans) {
    if (plan.status !== "active") continue;
    const age = now - plan.createdAt;
    if (age < SEVEN_DAYS_MS) continue;
    const hasCompleted = plan.steps.some((s) => s.status === "done");
    if (hasCompleted) continue;
    // All steps still pending / in_progress with no progress
    return {
      type: "plan",
      message: `Your plan "${plan.goal}" hasn't progressed in a while. Want to continue?`,
      suggestedActions: ["Continue plan", "View plans", "Archive plan"],
      triggerId: `autonomy_stalled_plan_${plan.id}`,
    };
  }
  return null;
}

// ── Rule 2: Goal Without Plan ────────────────────────────────────────────────

/**
 * If a user_goal memory exists but no plan's goal partially matches it,
 * suggest creating a plan.
 */
export function goalWithoutPlanRule(
  state: AutonomySystemState,
): AutonomySuggestion | null {
  const goalNodes = state.memories
    .map(parseMemoryRaw)
    .filter((n): n is ParsedMemoryNode => n !== null && n.type === "user_goal");

  for (const node of goalNodes) {
    const goalLower = node.content.toLowerCase();
    const hasPlan = state.plans.some(
      (p) =>
        p.goal.toLowerCase().includes(goalLower.slice(0, 20)) ||
        goalLower.includes(p.goal.toLowerCase().slice(0, 20)),
    );
    if (!hasPlan) {
      return {
        type: "goal",
        message: `You mentioned "${node.content}". Would you like a structured plan for that?`,
        suggestedActions: ["Create plan", "Remind me later"],
        triggerId: `autonomy_goal_no_plan_${node.rawId}`,
      };
    }
  }
  return null;
}

// ── Rule 3: Habit Reinforcement ──────────────────────────────────────────────

/**
 * If a habit memory mentions logging/tracking/adding something,
 * suggest a quick command.
 */
export function habitReinforcementRule(
  state: AutonomySystemState,
): AutonomySuggestion | null {
  const habitNodes = state.memories
    .map(parseMemoryRaw)
    .filter((n): n is ParsedMemoryNode => n !== null && n.type === "habit");

  const actionKeywords = ["log", "track", "add", "record", "note"];
  for (const node of habitNodes) {
    const lower = node.content.toLowerCase();
    const hasActionKeyword = actionKeywords.some((kw) => lower.includes(kw));
    if (hasActionKeyword) {
      return {
        type: "goal",
        message: `You often ${lower}. Want a quick command for it?`,
        suggestedActions: ["Create command", "Dismiss"],
        triggerId: `autonomy_habit_${node.rawId}`,
      };
    }
  }
  return null;
}

// ── Rule 4: Knowledge Growth ─────────────────────────────────────────────────

/**
 * If a knowledge_topic memory hasn't been accessed in > 14 days,
 * suggest reviewing new sources.
 */
export function knowledgeGrowthRule(
  state: AutonomySystemState,
): AutonomySuggestion | null {
  const now = Date.now();
  const topicNodes = state.memories
    .map(parseMemoryRaw)
    .filter(
      (n): n is ParsedMemoryNode => n !== null && n.type === "knowledge_topic",
    );

  for (const node of topicNodes) {
    const lastAccessed = node.lastAccessed;
    const isStale =
      lastAccessed === undefined ||
      lastAccessed === 0 ||
      now - lastAccessed > FOURTEEN_DAYS_MS;
    if (isStale) {
      return {
        type: "knowledge",
        message: `You follow "${node.content}" but haven't reviewed it recently. Want to explore new sources?`,
        suggestedActions: ["Open knowledge base", "Dismiss"],
        triggerId: `autonomy_knowledge_${node.rawId}`,
      };
    }
  }
  return null;
}

// ── Rule 5: Task Overload ─────────────────────────────────────────────────────

/**
 * If > 5 incomplete tasks are due today, suggest prioritization.
 */
export function taskOverloadRule(
  state: AutonomySystemState,
): AutonomySuggestion | null {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const dueTodayIncomplete = state.tasks.filter((t) => {
    if (t.completed) return false;
    const deadlineArr = t.deadline ?? [];
    if (!deadlineArr.length) return false;
    const deadlineMs = Number(deadlineArr[0]) / 1_000_000;
    return (
      deadlineMs >= todayStart.getTime() &&
      deadlineMs <= now + 24 * 60 * 60 * 1000
    );
  });

  if (dueTodayIncomplete.length > 5) {
    const todayKey = todayStart.toISOString().slice(0, 10);
    return {
      type: "task",
      message: `You have ${dueTodayIncomplete.length} tasks scheduled today. Want help prioritizing them?`,
      suggestedActions: ["Go to tasks", "Ask DJ to prioritize"],
      triggerId: `autonomy_task_overload_${todayKey}`,
    };
  }
  return null;
}
