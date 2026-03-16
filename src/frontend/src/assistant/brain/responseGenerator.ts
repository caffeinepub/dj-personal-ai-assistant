/**
 * Response Generator
 *
 * Stage 5 of the assistant pipeline.
 * Produces the text response shown to the user for GENERAL_RESPONSE
 * decisions (knowledge lookup, conversation, memory queries, etc.).
 * All backend-mutating decisions are handled in the controller itself;
 * this module is pure — it only reads data and returns strings.
 */

import type {
  BehaviorRule,
  Memory,
  PersonalitySettings,
} from "../../backend.d.ts";
import type { ContextEngineState } from "../../context/ContextEngineContext";
import { buildContextPrompt } from "../../context/ContextEngineContext";
import {
  extractFocusedAnswer,
  searchBuiltinKnowledge,
} from "../../utils/builtinKnowledge";
import {
  randomGreeting,
  smartFallback,
  wrapResponse,
} from "../../utils/djPersonality";
import {
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
    rules,
    personalitySettings,
    contextEngine,
    conversationHistory,
    activeTopicRef,
  } = deps;

  const style = personalitySettings?.communicationStyle ?? "professional";
  const lowerMessage = userMessage.toLowerCase();

  const knowledgeSources = memories
    .map(parseKnowledgeSource)
    .filter((s) => s !== null);

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

  // ── Greeting ───────────────────────────────────────────────────────────────
  if (
    lowerMessage.match(
      /^(hello|hi|hey|good morning|good evening|good afternoon)[\s!.]*$/,
    )
  ) {
    const ctxName = contextEngine.userPreferences?.name;
    const userName =
      ctxName ||
      regularMemories
        .find((m) => m.content.toLowerCase().includes("my name is"))
        ?.content.replace(/.*my name is\s+/i, "")
        .split(/[,. ]/)[0];
    const timeGreet =
      contextEngine.timeOfDay === "morning"
        ? "Good morning"
        : contextEngine.timeOfDay === "evening"
          ? "Good evening"
          : contextEngine.timeOfDay === "night"
            ? "Working late?"
            : null;
    const baseGreeting = randomGreeting(userName);
    return timeGreet
      ? `${timeGreet}${userName ? `, ${userName}! ` : "! "}All systems active and ready for you.`
      : baseGreeting;
  }

  // ── Status check ───────────────────────────────────────────────────────────
  if (
    lowerMessage.includes("how are you") ||
    lowerMessage.includes("how do you feel")
  ) {
    return "All good on my end! Always running, always ready. What do you need?";
  }

  // ── Help ───────────────────────────────────────────────────────────────────
  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("what can you do") ||
    lowerMessage.includes("capabilities")
  ) {
    return `Here's what I can do:\n\n- **Memory**: "DJ, remember [something]" / "DJ, forget [something]"\n- **Knowledge**: "DJ, what do you know about [topic]"\n- **Rules**: "DJ, your new rule is [rule]"\n- **Tasks/Reminders**: "Remind me at 3pm to [task]"\n- **Notes**: "Note: [content]"\n- **Finance**: "Add expense Rs.100 on food"\n- **Style**: "DJ, be more casual/formal/concise/detailed"\n\nI currently have ${regularMemories.length} memories stored. What would you like to do?`;
  }

  // ── Follow-up / elaboration ────────────────────────────────────────────────
  if (
    (lowerMessage.includes("tell me more") ||
      lowerMessage.includes("explain that") ||
      lowerMessage.includes("more about") ||
      lowerMessage.includes("go on") ||
      lowerMessage.includes("continue")) &&
    _conversationContext
  ) {
    const lastAssistant = conversationHistory
      .filter((m) => m.role === "assistant")
      .slice(-1)[0];
    if (lastAssistant) {
      return `Expanding on what I mentioned: ${lastAssistant.content}\n\nIs there a specific aspect you'd like me to elaborate on further?`;
    }
  }

  // ── Conversation recap ────────────────────────────────────────────────────
  if (
    lowerMessage.includes("what did i say") ||
    lowerMessage.includes("recap") ||
    lowerMessage.includes("summarize our conversation") ||
    lowerMessage.includes("what have we discussed")
  ) {
    if (conversationHistory.length === 0) {
      return "This is the beginning of our conversation. Nothing has been said yet.";
    }
    const recentUserMessages = conversationHistory
      .filter((m) => m.role === "user")
      .slice(-5);
    const summary = recentUserMessages
      .map((m, i) => `${i + 1}. "${m.content.slice(0, 100)}"`)
      .join("\n");
    return `Here's a summary of your recent messages:\n\n${summary}`;
  }

  // ── Knowledge lookup (user sources + built-in) ─────────────────────────────
  const validSources = knowledgeSources.filter((s) => s !== null);
  const userKnowledgeResults: { title: string; content: string }[] = [];
  if (validSources.length > 0) {
    const { context, titles } = getRelevantContext(validSources, userMessage);
    if (context) {
      userKnowledgeResults.push(
        ...titles.map((t) => ({ title: t, content: context })),
      );
    }
  }

  const builtinResults = searchBuiltinKnowledge(userMessage);

  if (userKnowledgeResults.length > 0 && builtinResults.length > 0) {
    const builtinSummary = builtinResults[0].content.slice(0, 400);
    const userSummary = userKnowledgeResults[0].content.slice(0, 400);
    const intro =
      style === "concise"
        ? "Here's what I found:"
        : "I found relevant information from multiple sources:";
    return `${intro}\n\n**From your knowledge base (${userKnowledgeResults[0].title}):**\n${userSummary}\n\n**From DJ's built-in knowledge (${builtinResults[0].topic}):**\n${builtinSummary}`;
  }

  if (userKnowledgeResults.length > 0) {
    const intro =
      style === "concise"
        ? "From your knowledge base:"
        : "I found relevant information in your knowledge base:";
    return `${intro}\n\n${userKnowledgeResults[0].content.slice(0, 800)}\n\n---\n*Source: ${userKnowledgeResults[0].title}*`;
  }

  if (builtinResults.length > 0) {
    activeTopicRef.current = builtinResults[0].topic;
    const focusedAnswer = extractFocusedAnswer(userMessage, builtinResults[0]);
    if (focusedAnswer) return wrapResponse(focusedAnswer, "knowledge");
    const intro =
      style === "concise"
        ? `**${builtinResults[0].topic}:**`
        : `Here's what I know about **${builtinResults[0].topic}**:`;
    const footer =
      builtinResults.length > 1
        ? `\n\n---\n*I also have built-in knowledge on: ${builtinResults
            .slice(1)
            .map((r) => r.topic)
            .join(", ")}*`
        : "";
    return `${intro}\n\n${builtinResults[0].content}${footer}`;
  }

  // ── Memory-based answer ────────────────────────────────────────────────────
  if (regularMemories.length > 0) {
    const relevantMemory = regularMemories.find((m) =>
      m.content
        .toLowerCase()
        .split(" ")
        .some((word) => word.length > 4 && lowerMessage.includes(word)),
    );
    if (relevantMemory) {
      return `Based on what I know about you: ${relevantMemory.content}\n\nFor more specific help, please ask a more detailed question.`;
    }
  }

  // ── Rules list ────────────────────────────────────────────────────────────
  if (rules.length > 0 && lowerMessage.includes("what are your rules")) {
    const ruleList = rules
      .slice(0, 5)
      .map((r, i) => `${i + 1}. ${r.ruleText}`)
      .join("\n");
    return `My current behavior rules:\n\n${ruleList}`;
  }

  // ── Follow-up on last active topic ────────────────────────────────────────
  const activeTopic = activeTopicRef.current;
  if (
    activeTopic &&
    (lowerMessage.includes("why") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("what") ||
      lowerMessage.includes("when"))
  ) {
    const topicResults = searchBuiltinKnowledge(activeTopic);
    if (topicResults.length > 0) {
      return `Following up on **${activeTopic}**:\n\n${topicResults[0].content}`;
    }
  }

  // ── Context-aware situational reply ───────────────────────────────────────
  const pageName = contextEngine.currentPage;
  if (pageName === "/finance" && !lowerMessage.includes("?")) {
    return (
      smartFallback(userMessage) +
      (contextEngine.activeTasks.length > 0
        ? `\n\nHeads up — you have ${contextEngine.activeTasks.length} task${
            contextEngine.activeTasks.length > 1 ? "s" : ""
          } due today that need attention.`
        : "")
    );
  }

  return smartFallback(userMessage);
}
