/**
 * Skill Router
 *
 * Stage 5 of the assistant pipeline.
 *
 * Finds the first registered skill that declares support for
 * the current decision's action, executes it, and returns the
 * SkillResult. Returns null if no skill matches so the controller
 * can fall through to its built-in handlers (memory, rules, etc.).
 *
 * Adding support for a new intent requires only:
 *   - A new Skill implementation in assistant/skills/
 *   - Registration in skillRegistry.ts
 * No changes to this file are needed.
 */

import { skills } from "../skills/skillRegistry";
import type { SkillContext, SkillResult } from "../skills/types";
import type { Decision } from "./decisionEngine";

export async function routeToSkill(
  decision: Decision,
  context: SkillContext,
): Promise<SkillResult | null> {
  const skill = skills.find((s) => s.intents.includes(decision.action));
  if (!skill) return null;
  return skill.handle(decision, context);
}
