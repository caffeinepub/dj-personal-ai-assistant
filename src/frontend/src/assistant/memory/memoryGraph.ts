/**
 * Memory Graph — Core Types
 *
 * Defines the MemoryNode and MemoryRelationship types used
 * throughout the memory system. MemoryNodes are serialized
 * as JSON with a MEMORY_GRAPH: prefix and stored in the
 * Motoko canister's memory store.
 */

export type MemoryType =
  | "user_profile"
  | "user_goal"
  | "user_preference"
  | "fact"
  | "project"
  | "habit"
  | "knowledge_topic";

export const MEMORY_PREFIX = "MEMORY_GRAPH:";

export interface MemoryNode {
  /** Frontend-generated ID: "mg_" + timestamp */
  id: string;
  /** Backend bigint ID for deletion — present after save */
  backendId?: bigint;
  type: MemoryType;
  content: string;
  tags: string[];
  createdAt: number;
  lastAccessed: number;
  /** 1–5, decays over time. 0 → archived */
  importance: number;
  archived: boolean;
}

/** Placeholder for future graph extensions */
export interface MemoryRelationship {
  fromId: string;
  toId: string;
  relationshipType: string;
}

export function generateMemoryId(): string {
  return `mg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
