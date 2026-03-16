/**
 * Autonomy Evaluator
 *
 * Runs all autonomy rules against the current system state and
 * optionally dispatches one suggestion through the Proactive Engine.
 */

import {
  canSendGlobalMessage,
  hasFiredRecently,
  recordProactiveMessage,
  recordTrigger,
} from "../state/proactiveState";
import {
  goalWithoutPlanRule,
  habitReinforcementRule,
  knowledgeGrowthRule,
  stalledPlanRule,
  taskOverloadRule,
} from "./autonomyRules";
import type { AutonomySystemState } from "./autonomyRules";
import {
  type AutonomySuggestion,
  dispatchAutonomySuggestion,
} from "./autonomySuggestions";

export interface EvaluationInput {
  plans: AutonomySystemState["plans"];
  tasks: AutonomySystemState["tasks"];
  memories: AutonomySystemState["memories"];
}

/** Run all rules and return triggered suggestions (deduplicated). */
export function evaluateAutonomy(input: EvaluationInput): AutonomySuggestion[] {
  const state: AutonomySystemState = {
    plans: input.plans,
    tasks: input.tasks,
    memories: input.memories,
    knowledgeSources: [],
  };

  const allRules = [
    stalledPlanRule,
    goalWithoutPlanRule,
    habitReinforcementRule,
    knowledgeGrowthRule,
    taskOverloadRule,
  ];

  const suggestions: AutonomySuggestion[] = [];

  for (const rule of allRules) {
    const suggestion = rule(state);
    if (!suggestion) continue;
    // 6-hour dedup per trigger
    if (hasFiredRecently(suggestion.triggerId, 6 * 60 * 60 * 1000)) continue;
    suggestions.push(suggestion);
  }

  return suggestions;
}

/** Dispatch at most one suggestion, respecting global cooldown and settings. */
export function dispatchEvaluationResults(
  suggestions: AutonomySuggestion[],
): void {
  const autonomyEnabled =
    localStorage.getItem("dj_autonomy_suggestions") !== "false";

  for (const suggestion of suggestions) {
    if (!autonomyEnabled) {
      // Still record to prevent future duplicates
      recordTrigger(suggestion.triggerId);
      continue;
    }
    if (!canSendGlobalMessage()) break; // respect global 10-min cooldown
    recordProactiveMessage();
    recordTrigger(suggestion.triggerId);
    dispatchAutonomySuggestion(suggestion);
    break; // only one suggestion per evaluation cycle
  }
}
