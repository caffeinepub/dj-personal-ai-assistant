/**
 * Context Engine (pipeline adapter)
 *
 * Stage 3 of the assistant pipeline.
 * Re-exports the ContextEngineState type and provides stateless helper
 * functions that build conversation / personality context strings from
 * the current session data. These helpers were previously inline
 * closures inside ChatPage.
 */

export type {
  ActiveTask,
  ContextEngineState,
  LearnedPatterns,
  RecentAction,
  RecentActionType,
  TimeOfDay,
  UserPreferences,
} from "../../context/ContextEngineContext";

export { buildContextPrompt } from "../../context/ContextEngineContext";

import type {
  BehaviorRule,
  PersonalitySettings,
} from "../../types/backendTypes";

// ── Conversation context ──────────────────────────────────────────────────────

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: bigint;
}

/**
 * Build a compact conversation history string from the last 20 messages.
 * Used by the response generator to give DJ conversational memory.
 */
export function buildConversationContext(
  messages: ConversationMessage[],
): string {
  const recent = messages.slice(-20);
  if (recent.length === 0) return "";
  return recent
    .map(
      (m) => `${m.role === "user" ? "User" : "DJ"}: ${m.content.slice(0, 600)}`,
    )
    .join("\n");
}

// ── Personality / rule context ────────────────────────────────────────────────

/**
 * Build a compact personality description string from the user's
 * communication style and active behaviour rules.
 */
export function buildPersonalityContext(
  rules: BehaviorRule[],
  personalitySettings?: PersonalitySettings,
): string {
  const style = personalitySettings?.communicationStyle ?? "professional";
  const regularRules = rules.filter(
    (r) => !r.ruleText.startsWith("[KNOWLEDGE_SOURCE]"),
  );
  let context = `DJ's style: ${style}`;
  if (regularRules.length > 0) {
    context += `\nActive rules: ${regularRules
      .slice(0, 5)
      .map((r) => r.ruleText)
      .join("; ")}`;
  }
  return context;
}
