/**
 * Decision Engine
 *
 * Stage 4 of the assistant pipeline.
 * Maps an intent + extracted entities to a concrete Decision — a
 * discriminated union describing what the controller should do next.
 * Pure function — no side effects.
 */

import type { ExtractedEntities } from "./entityExtractor";
import type { Intent } from "./intentEngine";

// ── Decision types ───────────────────────────────────────────────────────────────────

export type Decision =
  | { action: "SEARCH_KNOWLEDGE"; query: string }
  | { action: "SYNTHESIZE_KNOWLEDGE"; query: string }
  | { action: "REMEMBER"; content: string }
  | { action: "FORGET"; content: string }
  | { action: "LIST_MEMORIES" }
  | { action: "RESET_MEMORIES" }
  | { action: "MEMORY_QUERY"; query: string }
  | { action: "CREATE_COMMAND"; name: string; commandAction: string }
  | { action: "SET_RULE"; ruleText: string }
  | { action: "SET_PERSONALITY"; style: string }
  | { action: "ACTIVATE_MODULE"; moduleName: string }
  | { action: "DEACTIVATE_MODULE"; moduleName: string }
  | {
      action: "ADD_TASK";
      taskTitle: string;
      deadlineMs: bigint | null;
      alreadyPassedToday: boolean;
      timeRaw?: string;
    }
  | { action: "ADD_NOTE"; noteTitle: string; noteContent: string }
  | {
      action: "ADD_FINANCE";
      amount: number;
      amountStr: string;
      description: string;
      category: string;
      isIncome: boolean;
    }
  | { action: "CREATE_PLAN"; rawMessage: string }
  | { action: "SHOW_PLANS"; rawMessage: string }
  | { action: "AUTONOMY_REVIEW" }
  | { action: "DAILY_ROUTINE"; rawMessage: string }
  | { action: "GENERAL_RESPONSE"; originalMessage: string };

/**
 * Produce the Decision for a given intent and its extracted entities.
 */
export function makeDecision(
  intent: Intent,
  entities: ExtractedEntities,
  originalMessage: string,
): Decision {
  switch (intent) {
    case "SEARCH_KNOWLEDGE":
      return {
        action: "SEARCH_KNOWLEDGE",
        query:
          entities.kind === "knowledgeQuery"
            ? entities.data.query
            : originalMessage,
      };

    case "SYNTHESIZE_KNOWLEDGE":
      return {
        action: "SYNTHESIZE_KNOWLEDGE",
        query:
          entities.kind === "knowledgeQuery"
            ? entities.data.query
            : originalMessage,
      };

    case "REMEMBER":
      return {
        action: "REMEMBER",
        content:
          entities.kind === "memory" ? entities.data.content : originalMessage,
      };

    case "FORGET":
      return {
        action: "FORGET",
        content:
          entities.kind === "memory" ? entities.data.content : originalMessage,
      };

    case "LIST_MEMORIES":
      return { action: "LIST_MEMORIES" };

    case "RESET_MEMORIES":
      return { action: "RESET_MEMORIES" };

    case "MEMORY_QUERY":
      return { action: "MEMORY_QUERY", query: originalMessage };

    case "CREATE_COMMAND":
      if (entities.kind !== "command") break;
      return {
        action: "CREATE_COMMAND",
        name: entities.data.name,
        commandAction: entities.data.action,
      };

    case "SET_RULE":
      if (entities.kind !== "rule") break;
      return { action: "SET_RULE", ruleText: entities.data.ruleText };

    case "SET_PERSONALITY":
      if (entities.kind !== "personality") break;
      return { action: "SET_PERSONALITY", style: entities.data.style };

    case "ACTIVATE_MODULE":
      if (entities.kind !== "module") break;
      return {
        action: "ACTIVATE_MODULE",
        moduleName: entities.data.moduleName,
      };

    case "DEACTIVATE_MODULE":
      if (entities.kind !== "module") break;
      return {
        action: "DEACTIVATE_MODULE",
        moduleName: entities.data.moduleName,
      };

    case "ADD_TASK":
      if (entities.kind !== "task") break;
      return {
        action: "ADD_TASK",
        taskTitle: entities.data.taskTitle,
        deadlineMs: entities.data.deadlineMs,
        alreadyPassedToday: entities.data.alreadyPassedToday,
        timeRaw: entities.data.timeRaw,
      };

    case "ADD_NOTE":
      if (entities.kind !== "note") break;
      return {
        action: "ADD_NOTE",
        noteTitle: entities.data.noteTitle,
        noteContent: entities.data.noteContent,
      };

    case "ADD_FINANCE":
      if (entities.kind !== "finance") break;
      return {
        action: "ADD_FINANCE",
        amount: entities.data.amount,
        amountStr: entities.data.amountStr,
        description: entities.data.description,
        category: entities.data.category,
        isIncome: entities.data.isIncome,
      };

    case "CREATE_PLAN":
      return { action: "CREATE_PLAN", rawMessage: originalMessage };

    case "SHOW_PLANS":
      return { action: "SHOW_PLANS", rawMessage: originalMessage };

    case "AUTONOMY_REVIEW":
      return { action: "AUTONOMY_REVIEW" };

    case "DAILY_ROUTINE":
      return { action: "DAILY_ROUTINE", rawMessage: originalMessage };
  }

  return { action: "GENERAL_RESPONSE", originalMessage };
}
