/**
 * Plan Executor
 *
 * Handles converting plan steps into tasks.
 * Always asks for user confirmation before creating tasks.
 */

import type { Plan, PlanStep } from "./planTypes";

export interface ConvertStepResult {
  message: string;
  stepDescription: string;
  planGoal: string;
}

/**
 * Prepare to convert a plan step to a task.
 * Returns a confirmation message asking for due date/priority.
 * Actual task creation happens via tasksSkill after user responds.
 */
export function convertPlanStepToTask(
  step: PlanStep,
  plan: Plan,
): ConvertStepResult {
  const msg = `I'll convert **"${step.description}"** from your plan *${plan.goal}* into a task.\n\nWould you like to set a due date or priority?\n\u2022 Reply **"set due date [date]"** to add a deadline\n\u2022 Reply **"set priority high/medium/low"** to set priority\n\u2022 Reply **"skip"** to use defaults (priority: medium, no due date)`;

  return {
    message: msg,
    stepDescription: step.description,
    planGoal: plan.goal,
  };
}
