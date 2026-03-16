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
import type {
  BehaviorRule,
  Memory,
  PersonalitySettings,
} from "../../backend.d.ts";
import type { ContextEngineState } from "../../context/ContextEngineContext";
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

    // ── Stage 1: Intent ──────────────────────────────────────────────────────
    const { intent } = detectIntent(userMessage);

    // ── Stage 2: Entity extraction ───────────────────────────────────────────
    const entities = extractEntities(userMessage, intent);

    // ── Stage 2.5: Memory extraction (fire-and-forget) ───────────────────────
    if (actor) {
      // Retroactive scan on first run
      if (!isMemoryExtractionInitialized()) {
        const retroMessages = memories.filter(
          (m) =>
            !m.content.startsWith("MEMORY_GRAPH:") &&
            !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
        );
        for (const mem of retroMessages) {
          const candidates = extractMemories(mem.content);
          for (const c of candidates) {
            deduplicateOrSave(actor, memories, c).catch(() => {});
          }
        }
        setMemoryExtractionInitialized();
      }

      // Extract from current message (skip DJ commands)
      if (
        intent !== "REMEMBER" &&
        intent !== "FORGET" &&
        intent !== "MEMORY_QUERY"
      ) {
        const candidates = extractMemories(userMessage);
        for (const c of candidates) {
          deduplicateOrSave(actor, memories, c).catch(() => {});
        }
      }
    }

    // ── Stage 3 is context — already in deps.contextEngine ──────────────────

    // ── Stage 4: Decision ───────────────────────────────────────────────────
    const decision = makeDecision(intent, entities, userMessage);

    // ── Stage 5 + 6: Skill Router → Skill Execution ─────────────────────────
    const skillContext: SkillContext = {
      actor,
      queryClient,
      memories,
      contextEngine,
    };

    const skillResult = await routeToSkill(decision, skillContext);

    // ── Stage 6.5: Reply Composer ────────────────────────────────────────────
    if (skillResult !== null) {
      // Search for relevant memories to enrich the reply
      const memoryNodes = parseMemoryNodes(memories);
      const relevantMemories = searchRelevantMemories(memoryNodes, userMessage);

      const composed = composeReply({
        skillResult,
        decision,
        context: contextEngine,
        userProfile: contextEngine.userPreferences ?? undefined,
        conversationHistory: conversationHistory.slice(-5),
        relevantMemories,
      });
      return composedReplyToString(composed);
    }

    // ── Stage 7: Built-in handlers (memory, rules, modules) ──────────────────
    switch (decision.action) {
      // ── Memory Graph commands ──────────────────────────────────────────────
      case "REMEMBER": {
        if (decision.content) {
          // Save to legacy memory
          await addMemory(decision.content);
          // Also save to Memory Graph as a 'fact'
          if (actor) {
            deduplicateOrSave(actor, memories, {
              type: "fact",
              content: decision.content,
              tags: ["manual"],
              importance: 3,
            }).catch(() => {});
          }
          return "Understood. I've stored that in my memory — it'll help me give you better answers.";
        }
        return "I didn't catch what to remember — could you say that again?";
      }

      case "FORGET": {
        const regularMemories = memories.filter(
          (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
        );
        const matchingMemory = regularMemories.find((m) =>
          m.content.toLowerCase().includes(decision.content.toLowerCase()),
        );
        if (matchingMemory) {
          await deleteMemory(matchingMemory.id);
          return "Understood. I've removed that from my memory.";
        }
        return "I couldn't find a matching memory to forget.";
      }

      case "LIST_MEMORIES": {
        const regularMemories = memories.filter(
          (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
        );
        if (regularMemories.length === 0) {
          return "I don't have any stored memories yet. Teach me by saying 'DJ, remember [something]'.";
        }
        return `Here's everything I remember:\n\n${regularMemories
          .map((m, i) => `${i + 1}. ${m.content}`)
          .join("\n")}`;
      }

      case "RESET_MEMORIES": {
        const regularMemories = memories.filter(
          (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
        );
        for (const m of regularMemories) {
          await deleteMemory(m.id);
        }
        return "Done. All memories have been cleared. I'm starting fresh.";
      }

      // ── Memory Query (contextual lookup) ─────────────────────────────────
      case "MEMORY_QUERY": {
        const nodes = parseMemoryNodes(memories);
        if (nodes.length === 0) {
          return "I don't have any stored memories about you yet. Chat with me more and I'll learn as we go!";
        }

        // Check if querying a specific topic
        const topicMatch = userMessage.match(
          /what do you remember about\s+(.+)/i,
        );
        if (topicMatch) {
          const relevant = searchRelevantMemories(nodes, topicMatch[1]);
          return `Here's what I remember about "${topicMatch[1]}":\n\n${formatMemoriesForReply(relevant)}`;
        }

        // Goals query
        if (userMessage.toLowerCase().includes("goals")) {
          const goals = nodes.filter((n) => n.type === "user_goal");
          return goals.length > 0
            ? `Here are your goals I've noted:\n\n${formatMemoriesForReply(goals)}`
            : "I haven't noted any goals yet. Tell me what you're working towards!";
        }

        // Preferences query
        if (userMessage.toLowerCase().includes("preferences")) {
          const prefs = nodes.filter((n) => n.type === "user_preference");
          return prefs.length > 0
            ? `Here are your preferences I've learned:\n\n${formatMemoriesForReply(prefs)}`
            : "I haven't picked up any specific preferences yet.";
        }

        // General memory overview
        const profile = nodes.filter((n) => n.type === "user_profile");
        const goals = nodes.filter((n) => n.type === "user_goal");
        const habits = nodes.filter((n) => n.type === "habit");
        const projects = nodes.filter((n) => n.type === "project");

        const parts: string[] = ["Here's what I know about you:"];
        if (profile.length)
          parts.push(
            `\n**Profile:** ${profile.map((n) => n.content).join(" · ")}`,
          );
        if (goals.length)
          parts.push(`\n**Goals:** ${goals.map((n) => n.content).join(" · ")}`);
        if (habits.length)
          parts.push(
            `\n**Habits:** ${habits.map((n) => n.content).join(" · ")}`,
          );
        if (projects.length)
          parts.push(
            `\n**Projects:** ${projects.map((n) => n.content).join(" · ")}`,
          );
        if (parts.length === 1)
          parts.push(
            "\nNot much yet — keep chatting and I'll learn more about you.",
          );

        return parts.join("");
      }

      // ── Commands & rules ──────────────────────────────────────────────────
      case "CREATE_COMMAND": {
        await createCommand({
          name: decision.name,
          action: decision.commandAction,
        });
        return `Understood. I've created the custom command "${decision.name}". Activate it by saying "${decision.name}".`;
      }

      case "SET_RULE": {
        if (decision.ruleText) {
          await setBehaviorRule({
            ruleText: decision.ruleText,
            priority: BigInt(rules.length + 1),
          });
          return "Understood. I've set that as a new behavior rule and will follow it in every future response.";
        }
        return "I didn't catch the rule — could you rephrase that?";
      }

      case "SET_PERSONALITY": {
        await setPersonality(decision.style);
        return `Understood. I've adjusted my communication style to be more ${decision.style}.`;
      }

      // ── Modules ───────────────────────────────────────────────────────────
      case "ACTIVATE_MODULE": {
        await activateModule(decision.moduleName);
        return `The ${decision.moduleName} module has been activated.`;
      }

      case "DEACTIVATE_MODULE": {
        await deactivateModule(decision.moduleName);
        return `The ${decision.moduleName} module has been deactivated.`;
      }

      // ── General / conversational ──────────────────────────────────────────
      default:
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

  return { process };
}
