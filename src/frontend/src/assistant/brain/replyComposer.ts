/**
 * Reply Composer
 *
 * Stage 6.5 of the assistant pipeline — sits between Skill Execution
 * and Response Generator.
 *
 * Converts a raw SkillResult into a rich, structured reply that is:
 *  - Context-aware  (time of day, current page, active tasks)
 *  - Focused        (long content is trimmed to 3–6 lines)
 *  - Natural        (calm, concise, intelligent tone)
 *  - Suggestive     (follow-up actions offered after every reply)
 *  - Memory-enriched (relevant memories referenced when useful)
 *
 * Pure function — no side effects, no external calls.
 */

import type { ContextEngineState } from "../../context/ContextEngineContext";
import type { MemoryNode } from "../memory/memoryGraph";
import type { SkillResult } from "../skills/types";
import type { ConversationMessage, UserPreferences } from "./contextEngine";
import type { Decision } from "./decisionEngine";

// ── Output type ───────────────────────────────────────────────────────────────

export interface ComposedReply {
  message: string;
  tone: "neutral" | "friendly" | "professional";
  suggestions?: string[];
}

// ── Input type ────────────────────────────────────────────────────────────────

export interface ReplyComposerInput {
  skillResult: SkillResult;
  decision: Decision;
  context: ContextEngineState;
  userProfile?: UserPreferences;
  conversationHistory?: ConversationMessage[];
  /** Relevant memories from the Memory Graph */
  relevantMemories?: MemoryNode[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Trim long text to at most `maxLines` lines. */
function trimToLines(text: string, maxLines = 6): string {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= maxLines) return text;
  return `${lines.slice(0, maxLines).join("\n")}\n\n*— trimmed for brevity*`;
}

/** Build a context-aware greeting prefix based on time of day. */
function timePrefix(timeOfDay: ContextEngineState["timeOfDay"]): string {
  switch (timeOfDay) {
    case "morning":
      return "Good morning. ";
    case "evening":
      return "Good evening. ";
    case "night":
      return "Working late. ";
    default:
      return "";
  }
}

/** Select a tone based on the decision action type. */
function selectTone(decision: Decision): ComposedReply["tone"] {
  switch (decision.action) {
    case "ADD_TASK":
    case "ADD_NOTE":
    case "ADD_FINANCE":
      return "neutral";
    case "SEARCH_KNOWLEDGE":
    case "SYNTHESIZE_KNOWLEDGE":
      return "friendly";
    default:
      return "professional";
  }
}

// ── Follow-up suggestion maps ─────────────────────────────────────────────────

const TASK_SUGGESTIONS = [
  "Would you like to set a priority level for this task?",
  "Should I schedule a reminder closer to the deadline?",
  "Want to add a note to go along with this task?",
];

const NOTE_SUGGESTIONS = [
  "Want to save this to a specific knowledge folder?",
  "Should I tag this note with a topic?",
  "Would you like to add more detail to this note?",
];

const FINANCE_SUGGESTIONS = [
  "Would you like to view your current monthly summary?",
  "Should I log another entry?",
  "Want to check your spending in a category?",
];

const KNOWLEDGE_SUGGESTIONS = [
  "Want me to save this topic in your knowledge base?",
  "Would you like to explore a related topic?",
  "Should I search your saved documents for more?",
];

function getSuggestions(decision: Decision): string[] {
  const pool = (() => {
    switch (decision.action) {
      case "ADD_TASK":
        return TASK_SUGGESTIONS;
      case "ADD_NOTE":
        return NOTE_SUGGESTIONS;
      case "ADD_FINANCE":
        return FINANCE_SUGGESTIONS;
      case "SEARCH_KNOWLEDGE":
      case "SYNTHESIZE_KNOWLEDGE":
        return KNOWLEDGE_SUGGESTIONS;
      default:
        return [];
    }
  })();
  // Return 1–2 random suggestions
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

// ── Acknowledgement pools ─────────────────────────────────────────────────────

const TASK_ACKS = [
  "Done. I've added that to your task list.",
  "Task saved. You're on it.",
  "Got it — that's on your list now.",
  "Added to your tasks. I'll keep an eye on the deadline.",
];

const NOTE_ACKS = [
  "Saved. That note is safely stored.",
  "Got it — note added.",
  "Done. I've saved that note for you.",
];

const FINANCE_ACKS = [
  "Logged. Your finance record is updated.",
  "Entry saved. Your balance is up to date.",
  "Done — finance entry recorded.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function naturalAck(decision: Decision): string | null {
  if (!decision.action) return null;
  switch (decision.action) {
    case "ADD_TASK":
      return pickRandom(TASK_ACKS);
    case "ADD_NOTE":
      return pickRandom(NOTE_ACKS);
    case "ADD_FINANCE":
      return pickRandom(FINANCE_ACKS);
    default:
      return null;
  }
}

// ── Memory context injection ──────────────────────────────────────────────────

function buildMemoryContext(memories: MemoryNode[]): string {
  if (!memories || memories.length === 0) return "";
  const snippets = memories
    .slice(0, 3)
    .map((m) => m.content)
    .join("; ");
  return `\n\n_Based on what I know about you: ${snippets}_`;
}

// ── Main composer ────────────────────────────────────────────────────────────

export function composeReply(input: ReplyComposerInput): ComposedReply {
  const {
    skillResult,
    decision,
    context,
    conversationHistory,
    relevantMemories,
  } = input;

  const tone = selectTone(decision);
  const suggestions = getSuggestions(decision);

  // Confidence fallback
  if (!skillResult.success) {
    return {
      message:
        "I'm not fully confident about that request yet. You can teach me how to handle it by saying 'DJ, remember [fact]' or visiting the Teach DJ page.",
      tone: "professional",
      suggestions: [
        "Would you like to teach DJ a new rule?",
        "Try rephrasing your request.",
      ],
    };
  }

  // Build the main message
  const isFirstMessage = (conversationHistory?.length ?? 0) === 0;
  const prefix = isFirstMessage ? timePrefix(context.timeOfDay) : "";

  // Natural acknowledgement for action-type skills
  const ack = naturalAck(decision);
  const baseMessage = ack
    ? `${prefix}${ack} ${skillResult.message}`.trim()
    : `${prefix}${trimToLines(skillResult.message)}`.trim();

  // Append memory context if relevant and not an action reply
  const memoryContext =
    !ack && relevantMemories && relevantMemories.length > 0
      ? buildMemoryContext(relevantMemories)
      : "";

  return {
    message: `${baseMessage}${memoryContext}`,
    tone,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Flatten a ComposedReply to a plain string for chat/voice output.
 */
export function composedReplyToString(reply: ComposedReply): string {
  if (!reply.suggestions || reply.suggestions.length === 0) {
    return reply.message;
  }
  const suggestionText = reply.suggestions.map((s) => `• ${s}`).join("\n");
  return `${reply.message}\n\n${suggestionText}`;
}
