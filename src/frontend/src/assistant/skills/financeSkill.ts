/**
 * Finance Skill
 *
 * Handles ADD_FINANCE decisions — logs income/expense entries
 * via the backend actor and invalidates the React Query finance cache.
 */

import { randomTaskConfirm } from "../../utils/djPersonality";
import { trackCommandPattern } from "../../utils/patternLearning";
import type { Decision } from "../brain/decisionEngine";
import type { Skill, SkillContext, SkillResult } from "./types";

export const FinanceSkill: Skill = {
  name: "finance",
  description:
    "Records income and expense entries via natural language commands",
  intents: ["ADD_FINANCE"],

  async handle(
    decision: Decision,
    context: SkillContext,
  ): Promise<SkillResult> {
    if (decision.action !== "ADD_FINANCE") {
      return { success: false, message: "Invalid decision for FinanceSkill." };
    }

    const { actor, queryClient } = context;
    const { amount, amountStr, description, category, isIncome } = decision;

    try {
      if (!actor) throw new Error("Actor not available");

      await actor.addFinanceEntry(
        isIncome ? BigInt(amount) : BigInt(-amount),
        category,
        description,
        BigInt(Date.now()) * BigInt(1_000_000),
      );

      queryClient.invalidateQueries({ queryKey: ["financeEntries"] });
      trackCommandPattern("expense");

      const sign = isIncome ? "+" : "-";
      const formatted = `${sign}₹${Number.parseFloat(amountStr).toFixed(2)} for ${description}`;

      return {
        success: true,
        message: `${randomTaskConfirm("finance", formatted)} View details in the Finance Tracker.`,
      };
    } catch {
      const sign = isIncome ? "+" : "-";
      return {
        success: false,
        message: `I understood you want to record: **${sign}₹${Number.parseFloat(amountStr).toFixed(2)}** for **${description}**. However I couldn't save it right now.`,
      };
    }
  },
};
