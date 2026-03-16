/**
 * Skill System — Core Types
 *
 * Defines the standard interface all skills must implement,
 * plus the SkillContext and SkillResult types passed through
 * the pipeline.
 */

import type { QueryClient } from "@tanstack/react-query";
import type { ContextEngineState } from "../../context/ContextEngineContext";
import type { Memory } from "../../types/backendTypes";
import type { Decision } from "../brain/decisionEngine";

/** All stateful dependencies a skill receives at execution time */
export interface SkillContext {
  /** Live ICP actor — may be null if not yet authenticated */
  actor: any;
  queryClient: QueryClient;
  memories: Memory[];
  contextEngine: ContextEngineState;
}

/** Standardised return value from every skill */
export type SkillResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

/**
 * The Skill interface — every skill module must implement this.
 * Add a new skill by implementing this interface and registering
 * it in skillRegistry.ts.
 */
export interface Skill {
  name: string;
  description: string;
  /** Decision.action values this skill handles */
  intents: string[];
  handle(decision: Decision, context: SkillContext): Promise<SkillResult>;
}
