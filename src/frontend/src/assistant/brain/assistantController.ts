/**
 * Assistant Controller
 *
 * Orchestrator of the full assistant pipeline:
 *
 *   User Input
 *   → Stage 1: intentEngine.detectIntent()
 *   → Stage 2: entityExtractor.extractEntities()
 *   → Stage 2.5: memoryExtractor (fire-and-forget)
 *   → Stage 3: contextEngine (passed in via deps)
 *   → Stage 4: decisionEngine.makeDecision()
 *   → Stage 5: skillRouter.routeToSkill()
 *   → Stage 6: skill.handle()  (inside routeToSkill)
 *   → Stage 6.5: replyComposer.composeReply()
 *   → Stage 7: responseGenerator.generateResponse()
 *   → string returned to Voice + Chat Output
 */

import type { QueryClient } from "@tanstack/react-query";
import type { ContextEngineState } from "../../context/ContextEngineContext";
import type {
  BehaviorRule,
  Memory,
  PersonalitySettings,
} from "../../types/backendTypes";
import {
  extractMemories,
  isMemoryExtractionInitialized,
  setMemoryExtractionInitialized,
} from "../memory/memoryExtractor";
import {
  formatMemoriesForReply,
  searchRelevantMemories,
} from "../memory/memorySearch";
import { deduplicateOrSave, parseMemoryNodes } from "../memory/memoryStore";
import type { SkillContext } from "../skills/types";
import type { ConversationMessage } from "./contextEngine";
import { makeDecision } from "./decisionEngine";
import { extractEntities } from "./entityExtractor";
import { detectIntent } from "./intentEngine";
import { composeReply, composedReplyToString } from "./replyComposer";
import { generateResponse } from "./responseGenerator";
import { routeToSkill } from "./skillRouter";

// ── Deps interface ────────────────────────────────────────────────────────────

export interface AssistantDeps {
  /** Live ICP actor — may be null if not yet ready */
  actor: any;
  queryClient: QueryClient;
  memories: Memory[];
  rules: BehaviorRule[];
  personalitySettings?: PersonalitySettings;
  contextEngine: ContextEngineState;
  /** Recent conversation history for contextual replies */
  conversationHistory: ConversationMessage[];
  /** Ref tracking the last knowledge topic discussed (mutated in place) */
  activeTopicRef: { current: string };
  // Mutation functions (return Promise; throw on error)
  addMemory(content: string): Promise<void>;
  deleteMemory(id: bigint): Promise<void>;
  createCommand(params: { name: string; action: string }): Promise<void>;
  setBehaviorRule(params: {
    ruleText: string;
    priority: bigint;
  }): Promise<void>;
  setPersonality(style: string): Promise<void>;
  activateModule(name: string): Promise<void>;
  deactivateModule(name: string): Promise<void>;
}

// ── Controller factory ────────────────────────────────────────────────────────

export interface AssistantController {
  /**
   * Run the full assistant pipeline for a user message.
   * Returns the text response to display / speak.
   */
  process(userMessage: string): Promise<string>;
}

export function createAssistantController(
  getDeps: () => AssistantDeps,
): AssistantController {
  async function process(userMessage: string): Promise<string> {
    const deps = getDeps();
    const {
      actor,
      queryClient,
      memories,
      rules,
      personalitySettings,
      contextEngine,
      conversationHistory,
      activeTopicRef,
      addMemory,
      deleteMemory,
      createCommand,
      setBehaviorRule,
      setPersonality,
      activateModule,
      deactivateModule,
    } = deps;

    // ── Stage 1: Intent detection ─────────────────────────────────────────────
    const intentResult = detectIntent(userMessage);
    const intent = intentResult.intent;

    // ── Stage 2: Entity extraction ────────────────────────────────────────────
    const entities = extractEntities(userMessage, intent);

    // ── Stage 2.5: Memory extraction (fire-and-forget) ────────────────────────
    if (actor) {
      // One-time retroactive scan on first run
      if (!isMemoryExtractionInitialized()) {
        setMemoryExtractionInitialized();
        const retroMessages = memories
          .filter((m) => !m.content.startsWith("MEMORY_GRAPH:"))
          .map((m) => ({ role: "user" as const, content: m.content }));
        for (const msg of retroMessages) {
          const extracted = extractMemories(msg.content);
          for (const node of extracted) {
            deduplicateOrSave(actor, memories, node).catch(() => {});
          }
        }
      }
      // Extract from current message
      const extracted = extractMemories(userMessage);
      for (const node of extracted) {
        deduplicateOrSave(actor, memories, node).catch(() => {});
      }
    }

    // ── Stage 3: Context (passed in) ─────────────────────────────────────────
    // contextEngine is already up-to-date from the provider

    // ── Stage 4: Decision engine ─────────────────────────────────────────────
    const decision = makeDecision(intent, entities, userMessage);

    // ── Stage 5–6: Skill router ───────────────────────────────────────────────
    const skillContext: SkillContext = {
      actor,
      queryClient,
      memories,
      contextEngine,
    };

    const skillResult = await routeToSkill(decision, skillContext);

    // ── Stage 6.5: Reply composer ─────────────────────────────────────────────
    if (skillResult !== null) {
      // Skill handled it — compose an intelligent reply
      const memoryNodes = parseMemoryNodes(memories);
      const relevantMemories = searchRelevantMemories(memoryNodes, userMessage);
      const composed = composeReply({
        skillResult,
        decision,
        context: contextEngine,
        userProfile: undefined,
        conversationHistory,
        relevantMemories,
      });
      return composedReplyToString(composed);
    }

    // ── Stage 7: Built-in / general response ─────────────────────────────────
    // Handle special intents not covered by skills
    switch (decision.action) {
      case "REMEMBER": {
        if (actor) {
          try {
            await addMemory(decision.content);
            return `Got it. I've remembered: "${decision.content}"${decision.content.length > 60 ? "..." : ""}`;
          } catch {
            return "I had trouble saving that memory. Please try again.";
          }
        }
        return "What would you like me to remember?";
      }

      case "FORGET": {
        if (actor) {
          const memoryNodes = parseMemoryNodes(memories);
          const target = memoryNodes.find((n) =>
            n.content.toLowerCase().includes(decision.content.toLowerCase()),
          );
          if (target?.backendId !== undefined) {
            try {
              await deleteMemory(target.backendId);
              return `Done. I've forgotten: "${target.content}"${target.content.length > 60 ? "..." : ""}`;
            } catch {
              return "I had trouble deleting that memory. Please try again.";
            }
          }
          return `I don't have a memory matching "${decision.content}".`;
        }
        return "What would you like me to forget?";
      }

      case "LIST_MEMORIES": {
        const memoryNodes = parseMemoryNodes(memories);
        const formatted = formatMemoriesForReply(memoryNodes.slice(0, 5));
        return formatted;
      }

      case "MEMORY_QUERY": {
        const memoryNodes = parseMemoryNodes(memories);
        const relevant = searchRelevantMemories(memoryNodes, decision.query);
        const formatted = formatMemoriesForReply(relevant);
        if (formatted) return formatted;
        return "I don't have any relevant memories about that yet. Tell me more and I'll remember it.";
      }

      case "CREATE_COMMAND": {
        if (actor) {
          try {
            await createCommand({
              name: decision.name,
              action: decision.commandAction,
            });
            return `Done. I've created the command "${decision.name}" → "${decision.commandAction}".`;
          } catch {
            return "I had trouble creating that command. Please try again.";
          }
        }
        return "To create a command, say something like: 'Create command called \"morning routine\" that opens tasks'.";
      }

      case "SET_RULE": {
        if (actor) {
          try {
            await setBehaviorRule({
              ruleText: decision.ruleText,
              priority: 0n,
            });
            return `Understood. I'll always remember: "${decision.ruleText}".`;
          } catch {
            return "I had trouble saving that rule. Please try again.";
          }
        }
        return "What rule would you like me to follow?";
      }

      case "SET_PERSONALITY": {
        if (actor) {
          try {
            await setPersonality(decision.style);
            return `Done. I'll communicate in a ${decision.style} style from now on.`;
          } catch {
            return "I had trouble updating my personality. Please try again.";
          }
        }
        return "What communication style would you like? Options include: professional, casual, formal, friendly, concise.";
      }

      case "ACTIVATE_MODULE": {
        if (actor) {
          try {
            await activateModule(decision.moduleName);
            return `The ${decision.moduleName} module is now active.`;
          } catch {
            return `I had trouble activating ${decision.moduleName}. Please try again.`;
          }
        }
        return "Which module would you like to activate?";
      }

      case "DEACTIVATE_MODULE": {
        if (actor) {
          try {
            await deactivateModule(decision.moduleName);
            return `The ${decision.moduleName} module has been deactivated.`;
          } catch {
            return `I had trouble deactivating ${decision.moduleName}. Please try again.`;
          }
        }
        return "Which module would you like to deactivate?";
      }

      case "AUTONOMY_REVIEW": {
        window.dispatchEvent(new CustomEvent("dj-autonomy-review"));
        return "Running a full autonomy review now. I'll check your goals, plans, tasks, and knowledge and suggest what to focus on next.";
      }

      default: {
        // General conversational / knowledge response
        return generateResponse(userMessage, {
          memories,
          rules,
          personalitySettings,
          contextEngine,
          conversationHistory,
          activeTopicRef,
        });
      }
    }
  }

  return { process };
}
