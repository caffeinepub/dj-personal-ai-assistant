/**
 * Intent Engine
 *
 * Stage 1 of the assistant pipeline.
 * Classifies user input into one of the known intent types.
 * Pure function — no side effects.
 */

export type Intent =
  | "SEARCH_KNOWLEDGE"
  | "SYNTHESIZE_KNOWLEDGE"
  | "REMEMBER"
  | "FORGET"
  | "LIST_MEMORIES"
  | "RESET_MEMORIES"
  | "MEMORY_QUERY"
  | "CREATE_COMMAND"
  | "SET_RULE"
  | "SET_PERSONALITY"
  | "ACTIVATE_MODULE"
  | "DEACTIVATE_MODULE"
  | "ADD_TASK"
  | "ADD_NOTE"
  | "ADD_FINANCE"
  | "CREATE_PLAN"
  | "SHOW_PLANS"
  | "AUTONOMY_REVIEW"
  | "DAILY_ROUTINE"
  | "GENERAL";

export interface IntentResult {
  intent: Intent;
  /** The regex match that triggered detection (used by entity extractor) */
  match?: RegExpMatchArray | null;
}

/**
 * Detect the intent of a user message.
 * Evaluated in priority order — first match wins.
 */
export function detectIntent(message: string): IntentResult {
  const lower = message.toLowerCase().trim();

  // ── Knowledge commands ─────────────────────────────────────────────────────
  const searchMatch = message.match(
    /(?:dj,?\s*)?(?:search\s+(?:my\s+)?knowledge\s+(?:base\s+)?for|what\s+do\s+you\s+know\s+about)\s+(.+)/i,
  );
  if (searchMatch) return { intent: "SEARCH_KNOWLEDGE", match: searchMatch };

  const synthesisMatch = message.match(
    /(?:what\s+do\s+(?:all\s+)?(?:my\s+)?(?:sources?|knowledge|files?)\s+say\s+about|summarize\s+(?:my\s+)?(?:knowledge|sources?)\s+(?:on|about)|tell\s+me\s+everything\s+(?:you\s+know\s+)?about)\s+(.+)/i,
  );
  if (synthesisMatch)
    return { intent: "SYNTHESIZE_KNOWLEDGE", match: synthesisMatch };

  // ── Memory commands ────────────────────────────────────────────────────────
  if (lower.match(/^(dj,?\s*)?remember\s+/i)) return { intent: "REMEMBER" };
  if (lower.match(/^(dj,?\s*)?forget\s+/i)) return { intent: "FORGET" };
  if (
    lower.includes("what do you remember") ||
    lower.includes("show memories") ||
    lower.includes("list memories")
  )
    return { intent: "LIST_MEMORIES" };
  if (lower.includes("reset all") && lower.includes("memor"))
    return { intent: "RESET_MEMORIES" };

  // ── Memory query (contextual lookup) ───────────────────────────────────────
  if (
    lower.includes("what do you know about me") ||
    lower.includes("what are my goals") ||
    lower.includes("what are my preferences") ||
    lower.includes("what are my habits") ||
    lower.includes("what projects am i") ||
    lower.includes("show my memories") ||
    lower.includes("what have you learned about me") ||
    lower.match(/what do you remember about\s+(.+)/i)
  )
    return { intent: "MEMORY_QUERY" };

  // ── Custom command creation ────────────────────────────────────────────────
  const commandMatch = message.match(
    /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i,
  );
  if (commandMatch) return { intent: "CREATE_COMMAND", match: commandMatch };

  // ── Behaviour rules ────────────────────────────────────────────────────────
  if (lower.includes("your new rule is") || lower.includes("set rule:"))
    return { intent: "SET_RULE" };

  // ── Personality ────────────────────────────────────────────────────────────
  if (
    lower.includes("be more formal") ||
    lower.includes("be more casual") ||
    lower.includes("be more concise") ||
    lower.includes("be more detailed") ||
    lower.includes("be more professional")
  )
    return { intent: "SET_PERSONALITY" };

  // ── Module activation ──────────────────────────────────────────────────────
  const activateMatch = message.match(
    /(?:dj,?\s*)?activate\s+(?:the\s+)?(\w+)\s+module/i,
  );
  if (activateMatch) return { intent: "ACTIVATE_MODULE", match: activateMatch };

  const deactivateMatch = message.match(
    /(?:dj,?\s*)?deactivate\s+(?:the\s+)?(\w+)\s+module/i,
  );
  if (deactivateMatch)
    return { intent: "DEACTIVATE_MODULE", match: deactivateMatch };

  // ── Autonomy review ────────────────────────────────────────────────────────
  if (
    lower.includes("review my goals") ||
    lower.includes("what should i focus on") ||
    lower.includes("suggest improvements") ||
    lower.includes("autonomy review") ||
    lower.match(/dj,?\s+(review|suggest|focus)/i)
  )
    return { intent: "AUTONOMY_REVIEW" };

  // ── Daily routines ─────────────────────────────────────────────────────────
  if (
    lower.includes("start my morning routine") ||
    lower.includes("morning routine") ||
    lower.includes("start work mode") ||
    lower.includes("work mode") ||
    lower.includes("review my day") ||
    lower.includes("end of day") ||
    lower.includes("daily briefing") ||
    lower.includes("start my day") ||
    lower.match(/^(dj,?\s*)?(morning|briefing|work mode|end.of.day)/i)
  )
    return { intent: "DAILY_ROUTINE" };

  // ── Planner ────────────────────────────────────────────────────────────────
  if (
    lower.includes("show my plans") ||
    lower.includes("show plans") ||
    lower.includes("list plans") ||
    lower.includes("my plans")
  )
    return { intent: "SHOW_PLANS" };

  if (
    lower.match(/(?:create|make|build|set\s+up)\s+a\s+plan\s+(?:for|to)/i) ||
    lower.match(
      /^(dj,?\s*)?(i\s+want\s+to|my\s+goal\s+is|i\s+plan\s+to)\s+/i,
    ) ||
    lower.match(/plan\s+for\s+.{3,}/i)
  )
    return { intent: "CREATE_PLAN" };

  // ── Task creation ──────────────────────────────────────────────────────────
  if (
    lower.match(
      /(?:add|create|set)\s+(?:a\s+)?(?:task|reminder|todo|to-do|to\s+do)/,
    ) ||
    lower.match(/remind\s+me\s+(?:to|about)/)
  )
    return { intent: "ADD_TASK" };

  // ── Note creation ─────────────────────────────────────────────────────────
  if (
    lower.match(/(?:add|save|create|write)\s+(?:a\s+)?note/) ||
    lower.match(/note:?\s+.{5,}/)
  )
    return { intent: "ADD_NOTE" };

  // ── Finance entry ─────────────────────────────────────────────────────────
  if (
    lower.match(
      /(?:add|log|record|track)\s+(?:a\s+)?(?:expense|income|transaction|payment|purchase)/,
    ) ||
    // "Add Food Expense 500", "Add Fuel expense 100"
    lower.match(/(?:add|log)\s+\w[\w\s]*\s+(?:expense|income)\b/i) ||
    // "Add expense 500 food", "Log income 1000"
    lower.match(/(?:add|log|record|track)\s+(?:expense|income)\s+\d/i) ||
    lower.match(/(?:i\s+)?(?:spent|paid|earned|received|bought)\s+/)
  )
    return { intent: "ADD_FINANCE" };

  return { intent: "GENERAL" };
}
