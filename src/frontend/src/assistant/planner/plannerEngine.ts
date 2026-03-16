/**
 * Planner Engine
 *
 * Main orchestrator for the Cognitive Planning Engine.
 * Coordinates plan creation, step management, and proactive suggestions.
 */

import { generatePlanFromGoal } from "./planGenerator";
import {
  deletePlan as deletePlanFromStore,
  getPlanById,
  getPlans,
  savePlan,
  updatePlan,
} from "./planStore";
import type { Plan, PlanStep } from "./planTypes";

/**
 * Create a new plan from a goal and persist it to the backend.
 */
export async function createPlan(goal: string, actor: any): Promise<Plan> {
  const plan = generatePlanFromGoal(goal);
  await savePlan(plan, actor);
  return plan;
}

/**
 * Get the next pending step from a specific plan.
 */
export async function getNextPendingStep(
  planId: string,
  actor: any,
): Promise<PlanStep | null> {
  const plan = await getPlanById(planId, actor);
  if (!plan) return null;
  return plan.steps.find((s) => s.status === "pending") ?? null;
}

/**
 * Mark a specific step as complete and persist the update.
 */
export async function markStepComplete(
  planId: string,
  stepId: string,
  actor: any,
): Promise<void> {
  const plan = await getPlanById(planId, actor);
  if (!plan) return;

  const updated: Plan = {
    ...plan,
    steps: plan.steps.map((s) =>
      s.id === stepId ? { ...s, status: "done" } : s,
    ),
  };

  // If all steps done, mark plan completed
  if (updated.steps.every((s) => s.status === "done")) {
    updated.status = "completed";
  }

  await updatePlan(updated, actor);
}

/**
 * Delete a plan by id.
 */
export async function deletePlan(id: string, actor: any): Promise<void> {
  await deletePlanFromStore(id, actor);
}

/**
 * Proactive suggestion: returns a message if there are active plans with pending steps.
 * Returns null if nothing actionable.
 */
export async function getProactivePlanSuggestion(
  actor: any,
): Promise<string | null> {
  try {
    const plans = await getPlans(actor);
    const active = plans.filter((p) => p.status === "active");
    if (active.length === 0) return null;

    // Find the first active plan with a pending step
    for (const plan of active) {
      const nextStep = plan.steps.find((s) => s.status === "pending");
      if (nextStep) {
        return `Your plan **"${plan.goal}"** still has pending steps. Want to continue? Next step: *${nextStep.description}*`;
      }
    }
    return null;
  } catch {
    return null;
  }
}
