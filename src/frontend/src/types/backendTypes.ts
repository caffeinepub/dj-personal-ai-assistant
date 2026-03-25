/**
 * backendTypes.ts
 *
 * Local type definitions for all legacy backend types that were previously
 * exported from backend.d.ts but are no longer present after the latest
 * canister regeneration.
 *
 * These types must stay in sync with the Motoko backend data structures.
 */

// ── Core user types ───────────────────────────────────────────────────────────

export interface PersonalitySettings {
  communicationStyle: string;
}

export interface UserProfile {
  name: string;
  preferences: string;
  personalitySettings: string;
  onboardingComplete: boolean;
}

// ── Memory (legacy key-value store) ──────────────────────────────────────────

export interface Memory {
  id: bigint;
  content: string;
  timestamp: bigint;
}

// ── Improvement log ──────────────────────────────────────────────────────────

export interface ImprovementLog {
  id: bigint;
  entryType: string;
  description: string;
  timestamp: bigint;
}

// ── Custom commands ───────────────────────────────────────────────────────────

export interface Command {
  id: bigint;
  name: string;
  action: string;
  actionDescription: string;
  timestamp: bigint;
  createdAt: bigint;
}

// ── Behaviour rules ───────────────────────────────────────────────────────────

export interface BehaviorRule {
  id: bigint;
  ruleText: string;
  priority: bigint;
  timestamp: bigint;
  createdAt: bigint;
}

// ── Chat messages (legacy single-thread store) ────────────────────────────────

export interface ChatMessage {
  id: bigint;
  role: string;
  content: string;
  timestamp: bigint;
  threadId?: string;
}

// ── Code snippets ─────────────────────────────────────────────────────────────

export interface CodeSnippet {
  id: bigint;
  language: string;
  title: string;
  codeContent: string;
  createdAt: bigint;
}

// ── Excel files ───────────────────────────────────────────────────────────────

export interface ExcelFile {
  id: bigint;
  filename: string;
  data: Uint8Array;
  analysis: string;
  createdAt: bigint;
}

// ── Websites ──────────────────────────────────────────────────────────────────

export interface Website {
  id: bigint;
  templateName: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  createdAt: bigint;
}
