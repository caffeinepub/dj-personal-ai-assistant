/**
 * Notes Skill
 *
 * Handles ADD_NOTE decisions — saves notes via the backend actor
 * and invalidates the React Query notes cache.
 */

import { randomTaskConfirm } from "../../utils/djPersonality";
import { trackCommandPattern } from "../../utils/patternLearning";
import type { Decision } from "../brain/decisionEngine";
import type { Skill, SkillContext, SkillResult } from "./types";

export const NotesSkill: Skill = {
  name: "notes",
  description: "Saves notes via natural language commands",
  intents: ["ADD_NOTE"],

  async handle(
    decision: Decision,
    context: SkillContext,
  ): Promise<SkillResult> {
    if (decision.action !== "ADD_NOTE") {
      return { success: false, message: "Invalid decision for NotesSkill." };
    }

    const { actor, queryClient } = context;
    const { noteTitle, noteContent } = decision;

    try {
      if (!actor) throw new Error("Actor not available");

      await actor.addNote(
        noteTitle,
        noteContent,
        noteContent.slice(0, 100),
        [],
      );

      queryClient.invalidateQueries({ queryKey: ["notes"] });
      trackCommandPattern("note");

      const shortNote =
        noteContent.slice(0, 60) + (noteContent.length > 60 ? "..." : "");

      return {
        success: true,
        message: `${randomTaskConfirm("note", shortNote)} Find it in your Notes section.`,
      };
    } catch {
      return {
        success: false,
        message:
          "I understood you want to save this note. However I couldn't save it right now — please try again or add it directly in the Notes section.",
      };
    }
  },
};
