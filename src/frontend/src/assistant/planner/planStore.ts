/**
 * Plan Store
 *
 * CRUD wrapper over the backend actor for Plan persistence.
 * All plans are stored on-chain via the Motoko canister.
 */

import type { Plan } from "./planTypes";

function serializePlan(plan: Plan): {
  id: string;
  goal: string;
  stepsJson: string;
  status: string;
} {
  return {
    id: plan.id,
    goal: plan.goal,
    stepsJson: JSON.stringify(plan.steps),
    status: plan.status,
  };
}

function deserializePlan(raw: {
  id: string;
  goal: string;
  stepsJson: string;
  status: string;
  createdAt: bigint;
}): Plan {
  let steps = [];
  try {
    steps = JSON.parse(raw.stepsJson);
  } catch {
    steps = [];
  }
  return {
    id: raw.id,
    goal: raw.goal,
    steps,
    createdAt: Number(raw.createdAt),
    status: raw.status as Plan["status"],
  };
}

export async function savePlan(plan: Plan, actor: any): Promise<boolean> {
  if (!actor) throw new Error("Actor not available");
  const { id, goal, stepsJson, status } = serializePlan(plan);
  return actor.savePlan(id, goal, stepsJson, status);
}

export async function getPlans(actor: any): Promise<Plan[]> {
  if (!actor) return [];
  const results = await actor.getPlans();
  return results.map(deserializePlan);
}

export async function getPlanById(
  id: string,
  actor: any,
): Promise<Plan | null> {
  if (!actor) return null;
  const result = await actor.getPlanById(id);
  if (!result) return null;
  return deserializePlan(result);
}

export async function updatePlan(plan: Plan, actor: any): Promise<boolean> {
  if (!actor) throw new Error("Actor not available");
  const { id, goal, stepsJson, status } = serializePlan(plan);
  return actor.updatePlan(id, goal, stepsJson, status);
}

export async function deletePlan(id: string, actor: any): Promise<boolean> {
  if (!actor) throw new Error("Actor not available");
  return actor.deletePlan(id);
}
