/**
 * Plan Types
 *
 * Core TypeScript types for the Cognitive Planning Engine.
 */

export type PlanStatus = "active" | "completed" | "paused";
export type StepStatus = "pending" | "in_progress" | "done";

export interface PlanStep {
  id: string;
  description: string;
  status: StepStatus;
  linkedTaskId?: string;
}

export interface Plan {
  id: string;
  goal: string;
  steps: PlanStep[];
  createdAt: number;
  status: PlanStatus;
}
