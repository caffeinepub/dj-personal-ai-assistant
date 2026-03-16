/**
 * Response Generator
 *
 * Stage 5 of the assistant pipeline.
 * Produces the text response shown to the user for GENERAL_RESPONSE
 * decisions (knowledge lookup, conversation, memory queries, etc.).
 * All backend-mutating decisions are handled in the controller itself;
 * this module is pure — it only reads data and returns strings.
 */

import type { ContextEngineState } from "../../context/ContextEngineContext";
import { buildContextPrompt } from "../../context/ContextEngineContext";
import type {
  BehaviorRule,
  Memory,
  PersonalitySettings,
} from "../../types/backendTypes";
import { searchBuiltinKnowledge } from "../../utils/builtinKnowledge";
import {
  randomGreeting,
  smartFallback,
  wrapResponse,
} from "../../utils/djPersonality";
import {
  type KnowledgeSource,
  getRelevantContext,
  parseKnowledgeSource,
  searchKnowledgeSources,
} from "../../utils/knowledgeSources";
import type { ConversationMessage } from "./contextEngine";
import { buildConversationContext } from "./contextEngine";

export interface ResponseGeneratorDeps {
  memories: Memory[];
  rules: BehaviorRule[];
  personalitySettings?: PersonalitySettings;
  contextEngine: ContextEngineState;
  conversationHistory: ConversationMessage[];
  activeTopicRef: { current: string };
}

/**
 * Generate a natural-language response for general / knowledge queries.
 * This function was previously the `generateContextualResponse` closure
 * inside ChatPage. It has been extracted here for testability and isolation.
 */
export function generateResponse(
  userMessage: string,
  deps: ResponseGeneratorDeps,
): string {
  const {
    memories,
    personalitySettings: _personalitySettings,
    contextEngine,
    conversationHistory,
    activeTopicRef,
  } = deps;

  const lowerMessage = userMessage.toLowerCase();

  const knowledgeSources = memories
    .map(parseKnowledgeSource)
    .filter((s): s is KnowledgeSource => s !== null);

  const regularMemories = memories.filter(
    (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
  );

  // Build context string (conversation + situational)
  const baseConversationContext = buildConversationContext(conversationHistory);
  const contextPrompt = buildContextPrompt(contextEngine);
  const _conversationContext = contextPrompt
    ? `${baseConversationContext}\n\n[SITUATIONAL CONTEXT]\n${contextPrompt}`
    : baseConversationContext;

  // ── Math ───────────────────────────────────────────────────────────────────
  const mathMatch = userMessage.trim().match(/^[\d\s\+\-\*\/\(\)\.%^]+$/);
  if (mathMatch) {
    try {
      const expr = userMessage.trim().replace(/\^/g, "**");
      if (/^[\d\s\+\-\*\/\(\)\.%\*]+$/.test(expr)) {
        const result = Function(`"use strict"; return (${expr})`)();
        if (typeof result === "number" && Number.isFinite(result)) {
          return `${userMessage.trim()} = **${result}**`;
        }
      }
    } catch {
      // not a valid expression — fall through
    }
  }

  // ── Greeting ──────────────────────────────────────────────────────────────
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening|howdy|sup|what'?s up|yo)\b/i.test(
      lowerMessage,
    ) &&
    lowerMessage.length < 30
  ) {
    const name = contextEngine?.userPreferences?.name;
    return randomGreeting(name);
  }

  // ── Direct memory recall ──────────────────────────────────────────────────
  if (
    lowerMessage.includes("what do you know about me") ||
    lowerMessage.includes("what do you remember") ||
    lowerMessage.includes("tell me about myself")
  ) {
    const profileMemories = regularMemories
      .filter((m) => !m.content.startsWith("MEMORY_GRAPH:"))
      .slice(0, 5);
    if (profileMemories.length > 0) {
      return `Here's what I know about you:\n${profileMemories.map((m) => `• ${m.content}`).join("\n")}`;
    }
    return "I don't know much about you yet. Tell me something and I'll remember it!";
  }

  // ── Knowledge base search ─────────────────────────────────────────────────
  if (knowledgeSources.length > 0) {
    const results = searchKnowledgeSources(knowledgeSources, userMessage);
    if (results.length > 0) {
      const top = results[0];
      activeTopicRef.current = top.title;

      const context = getRelevantContext(top.content, userMessage);
      if (context) {
        return wrapResponse(
          `From **${top.title}**:\n\n${context}`,
          "knowledge",
        );
      }

      return wrapResponse(
        `I found a relevant source: **${top.title}**. ${top.summary}`,
        "knowledge",
      );
    }
  }

  // ── Built-in knowledge ────────────────────────────────────────────────────
  const builtinResult = searchBuiltinKnowledge(userMessage);
  if (builtinResult) {
    const topEntry = builtinResult[0];
    if (topEntry) {
      return wrapResponse(topEntry.content.slice(0, 600), "knowledge");
    }
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return smartFallback(userMessage);
}
