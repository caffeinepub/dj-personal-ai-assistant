/**
 * Plan Generator
 *
 * Converts a goal string into a structured Plan.
 * Uses templates when available, falls back to generic steps.
 */

import { findMatchingTemplate } from "./planTemplates";
import type { Plan, PlanStep } from "./planTypes";

function makeStep(description: string): PlanStep {
  return {
    id: crypto.randomUUID(),
    description,
    status: "pending",
  };
}

/**
 * Generate a Plan from a goal string.
 * Matches against known templates; falls back to generic steps.
 */
export function generatePlanFromGoal(goal: string): Plan {
  const template = findMatchingTemplate(goal);

  const steps: PlanStep[] = template
    ? template.steps.map((s) => makeStep(s.description))
    : [
        makeStep(`Research ${goal}`),
        makeStep(`Create a detailed plan for ${goal}`),
        makeStep(`Start the first phase of ${goal}`),
        makeStep(`Review progress on ${goal}`),
        makeStep(`Complete ${goal}`),
      ];

  return {
    id: crypto.randomUUID(),
    goal,
    steps,
    createdAt: Date.now(),
    status: "active",
  };
}
