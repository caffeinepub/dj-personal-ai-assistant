/**
 * Daily Routine Skill
 *
 * Handles morning routines, work mode, and end-of-day reviews.
 * Reads task/finance data from React Query cache.
 */

import type { FinanceEntry, Task } from "../../hooks/useQueries";
import type { Decision } from "../brain/decisionEngine";
import {
  getEveningRoutine,
  getMorningRoutine,
  getWorkModeRoutine,
} from "../brain/routineEngine";
import type { Skill, SkillContext, SkillResult } from "./types";

function detectRoutineMode(message: string): "morning" | "work" | "evening" {
  const lower = message.toLowerCase();
  if (
    lower.includes("morning") ||
    lower.includes("briefing") ||
    lower.includes("daily briefing")
  )
    return "morning";
  if (lower.includes("work") || lower.includes("focus")) return "work";
  if (
    lower.includes("evening") ||
    lower.includes("end of day") ||
    lower.includes("review my day")
  )
    return "evening";
  // Default by time of day
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "work";
  return "evening";
}

export const DailyRoutineSkill: Skill = {
  name: "dailyRoutine",
  description: "Handles morning routines, work mode, and end-of-day reviews",
  intents: ["DAILY_ROUTINE"],

  async handle(
    decision: Decision,
    context: SkillContext,
  ): Promise<SkillResult> {
    const { queryClient } = context;

    // Read from React Query cache
    const tasks: Task[] = queryClient.getQueryData(["tasks"]) ?? [];
    const financeEntries: FinanceEntry[] =
      queryClient.getQueryData(["financeEntries"]) ?? [];

    const rawMessage =
      decision.action === "DAILY_ROUTINE" ? decision.rawMessage : "";
    const mode = detectRoutineMode(rawMessage);

    let message: string;
    if (mode === "morning") {
      message = getMorningRoutine(tasks, financeEntries);
    } else if (mode === "work") {
      message = getWorkModeRoutine(tasks);
    } else {
      message = getEveningRoutine(tasks, financeEntries);
    }

    return { success: true, message };
  },
};
