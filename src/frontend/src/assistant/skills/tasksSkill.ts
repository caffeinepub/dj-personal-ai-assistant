/**
 * Tasks Skill
 *
 * Handles ADD_TASK decisions — creates tasks and reminders
 * via the backend actor and invalidates the React Query cache.
 */

import { randomTaskConfirm } from "../../utils/djPersonality";
import { trackCommandPattern } from "../../utils/patternLearning";
import type { Decision } from "../brain/decisionEngine";
import type { Skill, SkillContext, SkillResult } from "./types";

export const TasksSkill: Skill = {
  name: "tasks",
  description: "Creates tasks and reminders via natural language commands",
  intents: ["ADD_TASK"],

  async handle(
    decision: Decision,
    context: SkillContext,
  ): Promise<SkillResult> {
    if (decision.action !== "ADD_TASK") {
      return { success: false, message: "Invalid decision for TasksSkill." };
    }

    const { actor, queryClient } = context;
    const { taskTitle, deadlineMs, alreadyPassedToday, timeRaw } = decision;

    if (!taskTitle) {
      return {
        success: false,
        message: "I didn't catch the task title — what would you like to add?",
      };
    }

    try {
      if (!actor) throw new Error("Actor not available");

      await actor.addTask(
        taskTitle,
        timeRaw ? `Scheduled: ${timeRaw}` : "",
        deadlineMs,
        "medium",
      );

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      trackCommandPattern("task");

      const deadlineStr = deadlineMs
        ? ` at ${new Date(Number(deadlineMs) / 1_000_000).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" },
          )}`
        : "";

      const passedNote = alreadyPassedToday
        ? "\n\n*(Note: this time has already passed today — reminder saved for reference.)*"
        : "";

      return {
        success: true,
        message: `${randomTaskConfirm("task", `${taskTitle}${deadlineStr}`)} View or edit it in the Tasks section.${passedNote}`,
      };
    } catch {
      return {
        success: false,
        message: `I understood you want to add a task: **${taskTitle}**. However I couldn't save it right now — please try again or add it directly in the Tasks section.`,
      };
    }
  },
};
