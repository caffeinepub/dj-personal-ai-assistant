/**
 * Memory Store
 *
 * CRUD layer for MemoryGraph nodes.
 * Works with the cached Memory[] from the canister — no extra
 * network calls during the hot pipeline path.
 *
 * Storage format in canister memory.content:
 *   "MEMORY_GRAPH:{...MemoryNode JSON (without backendId)...}"
 */

import type { Memory } from "../../types/backendTypes";
import { MEMORY_PREFIX, generateMemoryId } from "./memoryGraph";
import type { MemoryNode, MemoryType } from "./memoryGraph";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// ── Serialization helpers ─────────────────────────────────────────────────────

function serialize(node: MemoryNode): string {
  const { backendId: _backendId, ...rest } = node;
  return MEMORY_PREFIX + JSON.stringify(rest);
}

export function parseMemoryNode(mem: Memory): MemoryNode | null {
  try {
    if (!mem.content.startsWith(MEMORY_PREFIX)) return null;
    const json = mem.content.slice(MEMORY_PREFIX.length);
    const parsed = JSON.parse(json) as MemoryNode;
    parsed.backendId = mem.id;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Parse all MemoryGraph nodes from a cached Memory[] array.
 * Filters out non-MEMORY_GRAPH entries and archived nodes.
 */
export function parseMemoryNodes(
  memories: Memory[],
  includeArchived = false,
): MemoryNode[] {
  return memories
    .map(parseMemoryNode)
    .filter((n): n is MemoryNode => n !== null)
    .filter((n) => includeArchived || !n.archived);
}

// ── Mutation helpers (require live actor) ─────────────────────────────────────

/** Save a new memory node. Returns the node with generated id. */
export async function saveMemoryNode(
  actor: any,
  data: Omit<
    MemoryNode,
    "id" | "backendId" | "createdAt" | "lastAccessed" | "archived"
  >,
): Promise<MemoryNode> {
  const node: MemoryNode = {
    id: generateMemoryId(),
    type: data.type,
    content: data.content,
    tags: data.tags,
    importance: data.importance,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    archived: false,
  };
  await actor.addMemory(serialize(node));
  return node;
}

/** Update a memory node by deleting the old one and saving a new entry. */
export async function updateMemoryNode(
  actor: any,
  node: MemoryNode,
): Promise<void> {
  if (node.backendId !== undefined) {
    await actor.deleteMemory(node.backendId);
  }
  await actor.addMemory(serialize(node));
}

/** Delete a memory node by its canister ID. */
export async function deleteMemoryNode(
  actor: any,
  backendId: bigint,
): Promise<void> {
  await actor.deleteMemory(backendId);
}

/**
 * Check for duplicate content before saving.
 * Returns true if an identical (non-archived) node already exists.
 * Side-effect: updates lastAccessed on the duplicate.
 */
export async function deduplicateOrSave(
  actor: any,
  memories: Memory[],
  data: Omit<
    MemoryNode,
    "id" | "backendId" | "createdAt" | "lastAccessed" | "archived"
  >,
): Promise<MemoryNode | null> {
  const existing = parseMemoryNodes(memories);
  const duplicate = existing.find(
    (n) => n.content.toLowerCase() === data.content.toLowerCase(),
  );

  if (duplicate) {
    // Update lastAccessed timestamp
    const updated: MemoryNode = {
      ...duplicate,
      lastAccessed: Date.now(),
    };
    await updateMemoryNode(actor, updated);
    return null; // duplicate, not newly saved
  }

  return saveMemoryNode(actor, data);
}

/**
 * Apply memory decay: reduce importance of nodes not accessed in 30 days.
 * Archives nodes that reach importance 0.
 */
export async function applyMemoryDecay(
  actor: any,
  memories: Memory[],
): Promise<void> {
  const nodes = parseMemoryNodes(memories, true);
  const now = Date.now();

  for (const node of nodes) {
    const daysSinceAccess = (now - node.lastAccessed) / THIRTY_DAYS_MS;
    if (daysSinceAccess >= 1) {
      const newImportance = Math.max(0, node.importance - 1);
      const updated: MemoryNode = {
        ...node,
        importance: newImportance,
        archived: newImportance === 0,
      };
      await updateMemoryNode(actor, updated);
    }
  }
}

// Re-export MemoryType for convenience
export type { MemoryType };
