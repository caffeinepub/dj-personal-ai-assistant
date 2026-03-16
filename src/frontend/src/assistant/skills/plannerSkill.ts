/**
 * Planner Skill
 *
 * Handles plan-related intents: creating plans, showing plans,
 * completing steps, and converting steps to tasks.
 */

import type { Decision } from "../brain/decisionEngine";
import { convertPlanStepToTask } from "../planner/planExecutor";
import { getPlans } from "../planner/planStore";
import { createPlan } from "../planner/plannerEngine";
import type { Skill, SkillContext, SkillResult } from "./types";

function detectPlanIntent(
  message: string,
):
  | "create_plan"
  | "show_plans"
  | "complete_plan_step"
  | "convert_step_to_task"
  | null {
  const lower = message.toLowerCase();
  if (
    lower.includes("create a plan") ||
    lower.includes("plan for") ||
    lower.match(
      /^(dj,?\s*)?(i want to|my goal is|i plan to|i want to improve)\s+/,
    )
  ) {
    return "create_plan";
  }
  if (
    lower.includes("show my plans") ||
    lower.includes("show plans") ||
    lower.includes("list plans") ||
    lower.includes("my plans")
  ) {
    return "show_plans";
  }
  if (
    lower.includes("complete step") ||
    lower.includes("mark step") ||
    lower.includes("finish step")
  ) {
    return "complete_plan_step";
  }
  if (
    lower.includes("convert step") ||
    lower.includes("convert to task") ||
    lower.includes("step to task")
  ) {
    return "convert_step_to_task";
  }
  return null;
}

function extractGoalFromMessage(message: string): string {
  const planForMatch = message.match(
    /(?:create\s+a?\s*plan\s+for|plan\s+for)\s+(.+)/i,
  );
  if (planForMatch) return planForMatch[1].trim();

  const wantToMatch = message.match(/i\s+want\s+to\s+(.+)/i);
  if (wantToMatch) return wantToMatch[1].trim();

  const goalIsMatch = message.match(/my\s+goal\s+is\s+(?:to\s+)?(.+)/i);
  if (goalIsMatch) return goalIsMatch[1].trim();

  const planToMatch = message.match(/i\s+plan\s+to\s+(.+)/i);
  if (planToMatch) return planToMatch[1].trim();

  const improveMatch = message.match(/i\s+want\s+to\s+improve\s+(.+)/i);
  if (improveMatch) return improveMatch[1].trim();

  return (
    message
      .replace(
        /^(dj,?\s*)?(create\s+a?\s*plan\s*(for)?|plan\s+for|set\s+up\s+a\s+plan)\s*/i,
        "",
      )
      .trim() || message
  );
}

export const PlannerSkill: Skill = {
  name: "planner",
  description: "Converts goals into actionable step-by-step plans",
  intents: ["CREATE_PLAN", "SHOW_PLANS"],

  async handle(
    decision: Decision,
    context: SkillContext,
  ): Promise<SkillResult> {
    const { actor } = context;
    const rawMessage =
      ((decision as any).rawMessage as string | undefined) ?? "";
    const planIntent = detectPlanIntent(rawMessage);

    if (!planIntent) {
      return {
        success: false,
        message: "I didn't understand that plan request.",
      };
    }

    switch (planIntent) {
      case "create_plan": {
        const goal = extractGoalFromMessage(rawMessage);
        if (!goal || goal.length < 3) {
          return {
            success: false,
            message:
              'What goal would you like me to plan? For example: *"Create a plan for learning networking"*',
          };
        }
        try {
          const plan = await createPlan(goal, actor);
          const stepList = plan.steps
            .map((s, i) => `${i + 1}. ${s.description}`)
            .join("\n");
          return {
            success: true,
            message: `Done! I've created a plan for **\"${goal}\"** with ${plan.steps.length} steps:\n\n${stepList}\n\nYou can view and manage your plans on the **/plans** page. Would you like to convert any of these steps into tasks?`,
            data: plan,
          };
        } catch {
          return {
            success: false,
            message:
              "I couldn't save your plan right now. Please try again or visit the Plans page.",
          };
        }
      }

      case "show_plans": {
        try {
          const plans = await getPlans(actor);
          if (plans.length === 0) {
            return {
              success: true,
              message:
                'You don\'t have any plans yet. Say *"Create a plan for [your goal]"* to get started, or visit the **/plans** page.',
            };
          }
          const planList = plans
            .map((p) => {
              const done = p.steps.filter((s) => s.status === "done").length;
              return `\u2022 **${p.goal}** (${p.status}) \u2014 ${done}/${p.steps.length} steps done`;
            })
            .join("\n");
          return {
            success: true,
            message: `Here are your plans:\n\n${planList}\n\nVisit **/plans** to manage them in detail.`,
            data: plans,
          };
        } catch {
          return {
            success: false,
            message: "I couldn't fetch your plans right now. Please try again.",
          };
        }
      }

      case "complete_plan_step": {
        return {
          success: true,
          message:
            'To complete a step, visit the **/plans** page and click "Mark Complete" next to the step. You can also say *"Show my plans"* to see what\'s pending.',
        };
      }

      case "convert_step_to_task": {
        try {
          const plans = await getPlans(actor);
          const active = plans.filter((p) => p.status === "active");
          if (active.length === 0) {
            return {
              success: true,
              message:
                'You don\'t have any active plans. Create one first by saying *"Create a plan for [goal]"*.',
            };
          }
          const plan = active[0];
          const nextStep = plan.steps.find((s) => s.status === "pending");
          if (!nextStep) {
            return {
              success: true,
              message:
                "All steps in your active plan are already completed! \uD83C\uDF89",
            };
          }
          const result = convertPlanStepToTask(nextStep, plan);
          return { success: true, message: result.message };
        } catch {
          return {
            success: false,
            message: "Couldn't process that right now. Please try again.",
          };
        }
      }

      default:
        return {
          success: false,
          message: "I'm not sure how to handle that plan request.",
        };
    }
  },
};
