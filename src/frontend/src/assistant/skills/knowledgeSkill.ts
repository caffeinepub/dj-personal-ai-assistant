/**
 * Knowledge Skill
 *
 * Handles SEARCH_KNOWLEDGE and SYNTHESIZE_KNOWLEDGE decisions —
 * queries user-saved sources and DJ's built-in knowledge base.
 */

import { searchBuiltinKnowledge } from "../../utils/builtinKnowledge";
import {
  parseKnowledgeSource,
  searchKnowledgeSources,
} from "../../utils/knowledgeSources";
import type { Decision } from "../brain/decisionEngine";
import type { Skill, SkillContext, SkillResult } from "./types";

export const KnowledgeSkill: Skill = {
  name: "knowledge",
  description:
    "Searches and synthesizes knowledge from saved and built-in sources",
  intents: ["SEARCH_KNOWLEDGE", "SYNTHESIZE_KNOWLEDGE"],

  async handle(
    decision: Decision,
    context: SkillContext,
  ): Promise<SkillResult> {
    if (
      decision.action !== "SEARCH_KNOWLEDGE" &&
      decision.action !== "SYNTHESIZE_KNOWLEDGE"
    ) {
      return {
        success: false,
        message: "Invalid decision for KnowledgeSkill.",
      };
    }

    const { memories } = context;
    const { query } = decision;

    const knowledgeSources = memories
      .map(parseKnowledgeSource)
      .filter((s) => s !== null);

    const userResults = searchKnowledgeSources(
      knowledgeSources as Parameters<typeof searchKnowledgeSources>[0],
      query,
    );
    const builtinHits = searchBuiltinKnowledge(query);

    if (decision.action === "SEARCH_KNOWLEDGE") {
      if (userResults.length === 0 && builtinHits.length === 0) {
        return {
          success: false,
          message: `I don't have any knowledge sources matching "${query}". You can add some at the Knowledge page, or ask me directly about IT, Finance, or Productivity topics.`,
        };
      }

      let response = `Here's what I found for **"${query}"**:\n\n`;

      if (userResults.length > 0) {
        response += "**From your saved knowledge:**\n";
        response += userResults
          .slice(0, 3)
          .map(
            (s) =>
              `- **${s.title}** (${s.sourceType}): ${s.content.slice(0, 200)}...`,
          )
          .join("\n");
        response += "\n\n";
      }

      if (builtinHits.length > 0) {
        response += "**From DJ's built-in knowledge:**\n";
        response += builtinHits
          .map(
            (b) => `**${b.topic}** (${b.category})\n${b.content.slice(0, 400)}`,
          )
          .join("\n\n");
      }

      return { success: true, message: response };
    }

    // SYNTHESIZE_KNOWLEDGE
    if (userResults.length === 0 && builtinHits.length === 0) {
      return {
        success: false,
        message: `I searched all sources but found nothing specifically about "${query}". Try saving relevant knowledge at the Knowledge page.`,
      };
    }

    const total = userResults.length + builtinHits.length;
    let synthesis = `**Comprehensive answer on "${query}"** (synthesized from ${total} source${
      total !== 1 ? "s" : ""
    }):\n\n`;

    if (builtinHits.length > 0) {
      synthesis += `**Built-in Knowledge:**\n${builtinHits
        .map((b) => `*${b.topic}*: ${b.content.slice(0, 350)}`)
        .join("\n\n")}\n\n`;
    }

    if (userResults.length > 0) {
      synthesis += `**Your Saved Sources:**\n${userResults
        .slice(0, 3)
        .map((s) => `*${s.title}*: ${s.content.slice(0, 300)}`)
        .join("\n\n")}`;
    }

    return { success: true, message: synthesis };
  },
};
