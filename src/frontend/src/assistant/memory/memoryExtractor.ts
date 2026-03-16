/**
 * Memory Extractor
 *
 * Stage 2.5 of the assistant pipeline.
 * Scans user messages and extracts structured memory candidates
 * using pattern matching — no external AI.
 */

import type { MemoryNode, MemoryType } from "./memoryGraph";
import { generateMemoryId } from "./memoryGraph";

const INIT_FLAG_KEY = "dj_memory_extraction_initialized";

export function isMemoryExtractionInitialized(): boolean {
  return localStorage.getItem(INIT_FLAG_KEY) === "true";
}

export function setMemoryExtractionInitialized(): void {
  localStorage.setItem(INIT_FLAG_KEY, "true");
}

interface ExtractionCandidate
  extends Omit<
    MemoryNode,
    "id" | "backendId" | "createdAt" | "lastAccessed" | "archived"
  > {}

/** True for messages we should skip. */
function shouldSkip(message: string): boolean {
  if (message.trim().length < 10) return true;
  // Skip DJ's own messages and commands directed to DJ (handled separately)
  if (/^dj[,\s]/i.test(message.trim())) return true;
  return false;
}

function candidate(
  type: MemoryType,
  content: string,
  tags: string[] = [],
  importance = 3,
): ExtractionCandidate {
  return { type, content, tags, importance };
}

/**
 * Extract memory candidates from a single user message.
 * Returns an array — one message can produce multiple memories.
 */
export function extractMemories(message: string): ExtractionCandidate[] {
  if (shouldSkip(message)) return [];

  const found: ExtractionCandidate[] = [];
  const m = message.trim();

  // ── user_profile ─────────────────────────────────────────────────────────
  const nameMatch = m.match(
    /(?:my name is|i am called|i'm called)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  );
  if (nameMatch)
    found.push(
      candidate(
        "user_profile",
        `Name: ${nameMatch[1]}`,
        ["name", "profile"],
        5,
      ),
    );

  const profMatch = m.match(
    /(?:i (?:am|work as|work at)|i'm)\s+(a |an )?(developer|engineer|designer|accountant|manager|teacher|doctor|lawyer|student|analyst|consultant|architect|nurse|chef|writer|journalist|entrepreneur|freelancer|artist|musician|scientist|researcher)[\s.!,]/i,
  );
  if (profMatch) {
    const profession = profMatch[2];
    found.push(
      candidate(
        "user_profile",
        `Profession: ${profession}`,
        ["profession", "work"],
        4,
      ),
    );
  }

  const workAtMatch = m.match(/i work at\s+([^.,!?]+)/i);
  if (workAtMatch)
    found.push(
      candidate(
        "user_profile",
        `Works at: ${workAtMatch[1].trim()}`,
        ["work", "company"],
        3,
      ),
    );

  const ageMatch = m.match(/i(?:'m| am)\s+(\d{1,3})\s+years? old/i);
  if (ageMatch)
    found.push(
      candidate("user_profile", `Age: ${ageMatch[1]}`, ["age", "profile"], 3),
    );

  const locationMatch = m.match(
    /(?:i live in|i'm from|i am from|i'm based in)\s+([^.,!?]+)/i,
  );
  if (locationMatch)
    found.push(
      candidate(
        "user_profile",
        `Location: ${locationMatch[1].trim()}`,
        ["location", "profile"],
        3,
      ),
    );

  // ── user_goal ─────────────────────────────────────────────────────────────
  const goalMatch = m.match(
    /(?:i want to|i'd like to|my goal is|i'm trying to|i plan to|i hope to|i aim to)\s+([^.,!?]{10,80})/i,
  );
  if (goalMatch)
    found.push(
      candidate("user_goal", goalMatch[1].trim(), ["goal", "objective"], 4),
    );

  // ── user_preference ───────────────────────────────────────────────────────
  const likeMatch = m.match(
    /(?:i (?:prefer|like|love|enjoy|use))\s+([^.,!?]{5,60})/i,
  );
  if (likeMatch)
    found.push(
      candidate(
        "user_preference",
        `Likes: ${likeMatch[1].trim()}`,
        ["preference", "like"],
        3,
      ),
    );

  const dislikeMatch = m.match(
    /(?:i (?:don't like|hate|dislike|avoid))\s+([^.,!?]{5,60})/i,
  );
  if (dislikeMatch)
    found.push(
      candidate(
        "user_preference",
        `Dislikes: ${dislikeMatch[1].trim()}`,
        ["preference", "dislike"],
        3,
      ),
    );

  // ── habit ─────────────────────────────────────────────────────────────────
  const habitMatch = m.match(
    /(?:i always|i usually|i typically|every morning|every evening|every day|each day|daily)\s+([^.,!?]{5,80})/i,
  );
  if (habitMatch)
    found.push(
      candidate("habit", habitMatch[1].trim(), ["habit", "routine"], 3),
    );

  // ── fact ─────────────────────────────────────────────────────────────────
  const factMatch = m.match(
    /(?:remember that|note that|important:|fyi:?)\s+([^.,!?]{5,120})/i,
  );
  if (factMatch)
    found.push(candidate("fact", factMatch[1].trim(), ["fact"], 3));

  // ── project ──────────────────────────────────────────────────────────────
  const projectMatch = m.match(
    /(?:i(?:'m| am) working on|my project|our project)\s+([^.,!?]{5,80})/i,
  );
  if (projectMatch)
    found.push(
      candidate("project", projectMatch[1].trim(), ["project", "work"], 4),
    );

  // ── knowledge_topic ───────────────────────────────────────────────────────
  const learnMatch = m.match(
    /(?:i(?:'m| am) (?:learning|studying|reading about|interested in|exploring))\s+([^.,!?]{5,80})/i,
  );
  if (learnMatch)
    found.push(
      candidate(
        "knowledge_topic",
        learnMatch[1].trim(),
        ["learning", "topic"],
        3,
      ),
    );

  return found;
}

/** Convert a candidate to a full MemoryNode (no backendId yet). */
export function candidateToNode(c: ExtractionCandidate): MemoryNode {
  const now = Date.now();
  return {
    id: generateMemoryId(),
    type: c.type,
    content: c.content,
    tags: c.tags,
    importance: c.importance,
    createdAt: now,
    lastAccessed: now,
    archived: false,
  };
}
