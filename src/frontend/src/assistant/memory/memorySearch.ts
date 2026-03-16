/**
 * Memory Search
 *
 * Pure functions for querying MemoryGraph nodes.
 * All functions operate on a pre-fetched MemoryNode[] —
 * no network calls.
 */

import type { MemoryNode } from "./memoryGraph";

/** Score a node against a query (higher = more relevant). */
function scoreNode(node: MemoryNode, query: string): number {
  const q = query.toLowerCase();
  const content = node.content.toLowerCase();
  const tags = node.tags.join(" ").toLowerCase();

  let score = 0;

  // Exact content match
  if (content.includes(q)) score += 10;

  // Word-level matches in content
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  for (const word of words) {
    if (content.includes(word)) score += 3;
    if (tags.includes(word)) score += 2;
  }

  // Boost by importance
  score += node.importance;

  return score;
}

/**
 * Search nodes by keyword relevance.
 * Returns up to `limit` non-archived nodes sorted by score desc.
 */
export function searchRelevantMemories(
  nodes: MemoryNode[],
  query: string,
  limit = 5,
): MemoryNode[] {
  if (!query.trim()) return [];

  return nodes
    .filter((n) => !n.archived)
    .map((n) => ({ node: n, score: scoreNode(n, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ node }) => node);
}

/** Return the most recently accessed nodes. */
export function getRecentMemories(
  nodes: MemoryNode[],
  limit = 10,
): MemoryNode[] {
  return nodes
    .filter((n) => !n.archived)
    .sort((a, b) => b.lastAccessed - a.lastAccessed)
    .slice(0, limit);
}

/** Return nodes with importance >= 3 sorted by importance desc. */
export function getImportantMemories(
  nodes: MemoryNode[],
  limit = 10,
): MemoryNode[] {
  return nodes
    .filter((n) => !n.archived && n.importance >= 3)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, limit);
}

/** Format a list of MemoryNodes as a human-readable bullet list. */
export function formatMemoriesForReply(nodes: MemoryNode[]): string {
  if (nodes.length === 0)
    return "I don't have any stored memories on that topic yet.";
  return nodes
    .map((n) => `• ${n.content} _(${n.type.replace("_", " ")})_`)
    .join("\n");
}
