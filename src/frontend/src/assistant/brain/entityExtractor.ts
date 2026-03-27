/**
 * Entity Extractor
 *
 * Stage 2 of the assistant pipeline.
 * Extracts typed, structured data from a raw user message given its intent.
 * Pure function — no side effects.
 */

import type { Intent } from "./intentEngine";

// ── Entity shapes ────────────────────────────────────────────────────────────

export interface TaskEntities {
  taskTitle: string;
  deadlineMs: bigint | null;
  alreadyPassedToday: boolean;
  timeRaw?: string;
}

export interface NoteEntities {
  noteContent: string;
  noteTitle: string;
}

export interface FinanceEntities {
  amount: number; // stored value (cents)
  amountStr: string; // original string for display
  description: string;
  category: string;
  isIncome: boolean;
}

export interface KnowledgeQueryEntities {
  query: string;
}

export interface MemoryEntities {
  content: string;
}

export interface RuleEntities {
  ruleText: string;
}

export interface PersonalityEntities {
  style: string;
}

export interface CommandEntities {
  name: string;
  action: string;
}

export interface ModuleEntities {
  moduleName: string;
}

export type ExtractedEntities =
  | { kind: "task"; data: TaskEntities }
  | { kind: "note"; data: NoteEntities }
  | { kind: "finance"; data: FinanceEntities }
  | { kind: "knowledgeQuery"; data: KnowledgeQueryEntities }
  | { kind: "memory"; data: MemoryEntities }
  | { kind: "rule"; data: RuleEntities }
  | { kind: "personality"; data: PersonalityEntities }
  | { kind: "command"; data: CommandEntities }
  | { kind: "module"; data: ModuleEntities }
  | { kind: "general" };

// ── Main extractor ───────────────────────────────────────────────────────────

export function extractEntities(
  message: string,
  intent: Intent,
): ExtractedEntities {
  switch (intent) {
    case "SEARCH_KNOWLEDGE":
    case "SYNTHESIZE_KNOWLEDGE": {
      const m =
        message.match(
          /(?:dj,?\s*)?(?:search\s+(?:my\s+)?knowledge\s+(?:base\s+)?for|what\s+do\s+you\s+know\s+about)\s+(.+)/i,
        ) ||
        message.match(
          /(?:what\s+do\s+(?:all\s+)?(?:my\s+)?(?:sources?|knowledge|files?)\s+say\s+about|summarize\s+(?:my\s+)?(?:knowledge|sources?)\s+(?:on|about)|tell\s+me\s+everything\s+(?:you\s+know\s+)?about)\s+(.+)/i,
        );
      return {
        kind: "knowledgeQuery",
        data: { query: m ? m[1].trim() : message.trim() },
      };
    }

    case "REMEMBER":
    case "FORGET": {
      const content = message
        .replace(/^(dj,?\s*)?(?:remember|forget)\s+/i, "")
        .trim();
      return { kind: "memory", data: { content } };
    }

    case "LIST_MEMORIES":
    case "RESET_MEMORIES":
    case "GENERAL":
      return { kind: "general" };

    case "CREATE_COMMAND": {
      const m = message.match(
        /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i,
      );
      if (!m) return { kind: "general" };
      return { kind: "command", data: { name: m[1], action: m[2] } };
    }

    case "SET_RULE": {
      const ruleText = message
        .replace(/^(dj,?\s*)?(?:your\s+new\s+rule\s+is|set\s+rule:)\s*/i, "")
        .trim();
      return { kind: "rule", data: { ruleText } };
    }

    case "SET_PERSONALITY": {
      const lower = message.toLowerCase();
      let style = "professional";
      if (lower.includes("casual")) style = "casual";
      else if (lower.includes("concise")) style = "concise";
      else if (lower.includes("detailed")) style = "detailed";
      else if (lower.includes("formal")) style = "formal";
      return { kind: "personality", data: { style } };
    }

    case "ACTIVATE_MODULE":
    case "DEACTIVATE_MODULE": {
      const m = message.match(
        /(?:dj,?\s*)?(?:activate|deactivate)\s+(?:the\s+)?(\w+)\s+module/i,
      );
      if (!m) return { kind: "general" };
      return { kind: "module", data: { moduleName: m[1].toLowerCase() } };
    }

    case "ADD_TASK": {
      return { kind: "task", data: extractTaskEntities(message) };
    }

    case "ADD_NOTE": {
      const m = message.match(
        /(?:add\s+(?:a\s+)?note[:\s]+|note[:\s]+|save\s+(?:a\s+)?note[:\s]+|remember\s+this\s+note[:\s]+)(.+)/i,
      );
      const noteContent = m ? m[1].trim() : message.trim();
      const noteTitle = noteContent.split(" ").slice(0, 5).join(" ");
      return { kind: "note", data: { noteContent, noteTitle } };
    }

    case "ADD_FINANCE": {
      return { kind: "finance", data: extractFinanceEntities(message) };
    }

    default:
      return { kind: "general" };
  }
}

// ── Task entity helpers ───────────────────────────────────────────────────────

function extractTaskEntities(message: string): TaskEntities {
  const lower = message.toLowerCase();

  const taskMatch = message.match(
    /(?:remind(?:er)?\s+me\s+(?:to\s+)?|add\s+(?:a\s+)?task[:\s]+|set\s+(?:a\s+)?reminder[:\s]+|schedule[:\s]+)(.+?)(?:\s+(?:at|by|on|before|today|tomorrow)\s+(.+))?$/i,
  );

  const titleRaw = taskMatch
    ? taskMatch[1].trim()
    : message
        .replace(
          /^(dj,?\s*)?(add\s+task|remind\s+me|reminder\s+me|set\s+reminder|new\s+task)[:\s]*/i,
          "",
        )
        .trim();

  const timeRaw = taskMatch ? taskMatch[2] : undefined;

  const cleanTitle = titleRaw
    .replace(/\b(today|tomorrow)\b/gi, "")
    .replace(/\b(at|by|on|before)\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b/gi, "")
    .replace(/\b\d{1,2}:\d{2}\s*(am|pm)?\b/gi, "")
    .replace(/\b\d{1,2}\s*(am|pm)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const taskTitle = cleanTitle || titleRaw;

  let deadlineMs: bigint | null = null;
  let alreadyPassedToday = false;

  const timePat1 = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
  const timePat2 = /(\d{1,2})\s*(am|pm)/i;
  const timeMatch1 = message.match(timePat1);
  const timeMatch2 = !timeMatch1 ? message.match(timePat2) : null;

  if (timeMatch1) {
    let hours = Number.parseInt(timeMatch1[1]);
    const minutes = Number.parseInt(timeMatch1[2]);
    const ampm = timeMatch1[3]?.toLowerCase();
    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() < Date.now()) {
      if (lower.includes("today")) alreadyPassedToday = true;
      else d.setDate(d.getDate() + 1);
    }
    deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
  } else if (timeMatch2) {
    let hours = Number.parseInt(timeMatch2[1]);
    const ampm = timeMatch2[2]?.toLowerCase();
    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, 0, 0, 0);
    if (d.getTime() < Date.now()) {
      if (lower.includes("today")) alreadyPassedToday = true;
      else d.setDate(d.getDate() + 1);
    }
    deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
  } else if (lower.includes("today")) {
    const d = new Date();
    d.setHours(23, 59, 0, 0);
    deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
  } else if (lower.includes("tomorrow")) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
  }

  return { taskTitle, deadlineMs, alreadyPassedToday, timeRaw };
}

// ── Finance entity helpers ────────────────────────────────────────────────────

function extractFinanceEntities(message: string): FinanceEntities {
  // Pattern: "Add Food Expense 500", "Add Fuel income 100", "Log Coffee Expense 250"
  const fmCategory = message.match(
    /(?:add|log|record|track)\s+([\w][\w\s]*?)\s+(expense|income)\s+(?:rs\.?|inr|₹|\$|usd)?\s*(\d+(?:\.\d{1,2})?)/i,
  );

  if (fmCategory) {
    const categoryRaw = fmCategory[1].trim();
    const typeKeyword = fmCategory[2].toLowerCase();
    const amountStr = fmCategory[3];
    const amount = Math.round(Number.parseFloat(amountStr) * 100);
    const isIncome = typeKeyword === "income";
    return {
      amount,
      amountStr,
      description: categoryRaw,
      category: categoryRaw.toLowerCase(),
      isIncome,
    };
  }

  const fm1 = message.match(
    /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?|inr|₹|\$|usd)?\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:rs\.?|inr|₹|\$)?)?\s*\.?\s*(?:(?:on|for|as|from)\s+(.+?))?(?:\/[-]?)?$/i,
  );
  const fm2 = message.match(
    /(?:rs\.?|inr|₹|\$|usd)\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:on|for|as|from)\s+(.+?))?(?:\/[-]?)?\s*(?:expense|income|earned?)?$/i,
  );
  const fm3 = message.match(
    /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?\s+)(\d+(?:\.\d{1,2})?)/i,
  );
  const fm = fm1 || fm2 || fm3;

  const amountStr = fm ? fm[1] : "0";
  const descRaw = fm?.[2]?.trim().replace(/[\/\-]+$/, "") || "";
  const amount = Math.round(Number.parseFloat(amountStr) * 100);
  const isIncome = /income|earning|received?|got/i.test(message);
  const category = isIncome ? "income" : descRaw || "general";
  const description = descRaw || (isIncome ? "Income" : "Expense");

  return { amount, amountStr, description, category, isIncome };
}
