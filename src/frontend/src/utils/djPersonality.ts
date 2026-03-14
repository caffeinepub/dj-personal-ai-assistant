/**
 * DJ Personality System
 * Handles tone detection, response wrapping, and varied confirmations
 * to make DJ feel more natural, warm, and intelligent.
 */

// ── Tone Detection ────────────────────────────────────────────────────────────

export type Tone = "task" | "knowledge" | "conversational";

export function detectTone(message: string): Tone {
  const lower = message.toLowerCase().trim();

  // Task commands
  if (
    /^(remind(er)?\s+me|add\s+(a\s+)?(task|note|expense|income)|note:|save\s+(a\s+)?note|spent|paid|income|earning|received|got\s+\d)/.test(
      lower,
    )
  ) {
    return "task";
  }

  // Knowledge questions
  if (
    /^(what|how|why|explain|tell me|define|describe|who|when|where|is there|can you explain|what is|what are|how does|how do|why does|why do)/.test(
      lower,
    )
  ) {
    return "knowledge";
  }

  return "conversational";
}

// ── Phrase Libraries ──────────────────────────────────────────────────────────

const knowledgeOpeners = [
  "Here's what I know about that —",
  "Good question.",
  "Let me break that down —",
  "Sure, here's the rundown:",
  "Here's the short version:",
  "Glad you asked —",
  "Here's a solid overview:",
  "Let me walk you through it:",
  "Right, so here's the deal:",
];

const conversationalTransitions = [
  "",
  "Got it. ",
  "Sure thing. ",
  "Of course. ",
  "",
];

const taskConfirmations: Record<"task" | "note" | "finance", string[]> = {
  task: [
    "Done! That's on your task list now.",
    "Got it — task saved.",
    "Added to your tasks. You're on it.",
    "Saved to your tasks. I'll keep track.",
    "Task locked in. Nothing slipping through the cracks.",
  ],
  note: [
    "Saved that note for you.",
    "Note captured.",
    "I've got that noted.",
    "Noted and stored.",
    "That's saved in your Notes — easy to find later.",
  ],
  finance: [
    "Logged it to your finances.",
    "Entry recorded.",
    "Finance entry saved.",
    "Got it — added to the Finance Tracker.",
    "Recorded. Your finances are up to date.",
  ],
};

const fallbackResponses: Array<(msg: string) => string> = [
  (msg: string) =>
    `That's a good one — I don't have specific info on "${msg.slice(0, 40)}" yet, but you can teach me by going to the Knowledge section.`,
  () =>
    "Hmm, I'm still learning that area. Try adding a source in Knowledge and I'll be able to help next time.",
  () =>
    "I don't have a built-in answer for that just yet. Head to the Knowledge section to add sources — then I can give you a real answer.",
  () =>
    "Good question, but I'm drawing a blank on that one. Add it to my Knowledge base and I'll be much more useful next time you ask!",
];

// ── Pick random item ───────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Wrap Response ─────────────────────────────────────────────────────────────

export function wrapResponse(rawAnswer: string, tone: Tone): string {
  if (tone === "task") return rawAnswer;

  if (tone === "knowledge") {
    const opener = pick(knowledgeOpeners);
    const separator =
      opener.endsWith("—") || opener.endsWith(":") ? "\n\n" : " ";
    return `${opener}${separator}${rawAnswer}`;
  }

  // conversational
  const transition = pick(conversationalTransitions);
  return `${transition}${rawAnswer}`;
}

// ── Random Task Confirmation ──────────────────────────────────────────────────

export function randomTaskConfirm(
  type: "task" | "note" | "finance",
  detail: string,
): string {
  const base = pick(taskConfirmations[type]);
  if (!detail) return base;
  return `${base} (${detail})`;
}

// ── Smart Fallback ────────────────────────────────────────────────────────────

export function smartFallback(message: string): string {
  const fn = pick(fallbackResponses);
  return fn(message);
}

// ── Greeting variants ─────────────────────────────────────────────────────────

const greetingReplies: Array<(name?: string) => string> = [
  (name?: string) =>
    name
      ? `Hey ${name}! Good to hear from you. What can I do for you today?`
      : "Hey! Good to hear from you. What can I do for you today?",
  (name?: string) =>
    name
      ? `Hello, ${name}! I'm all yours — what's on your mind?`
      : "Hello! I'm all yours — what's on your mind?",
  (name?: string) =>
    name
      ? `Hi ${name}! Ready when you are. What do you need?`
      : "Hi! Ready when you are. What do you need?",
  (name?: string) =>
    name
      ? `Hey ${name}, what's up? I'm here to help.`
      : "Hey, what's up? I'm here to help.",
];

export function randomGreeting(name?: string): string {
  return pick(greetingReplies)(name);
}
