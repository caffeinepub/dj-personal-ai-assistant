/**
 * Skill Registry
 *
 * The single source of truth for all registered skills.
 * To add a new skill (e.g. calendarSkill, excelSkill):
 *   1. Create the skill file implementing the Skill interface
 *   2. Import it here and add it to the `skills` array
 *
 * The Skill Router iterates this array to find a matching handler.
 */

import { DailyRoutineSkill } from "./dailyRoutineSkill";
import { FinanceSkill } from "./financeSkill";
import { KnowledgeSkill } from "./knowledgeSkill";
import { NotesSkill } from "./notesSkill";
import { PlannerSkill } from "./plannerSkill";
import { TasksSkill } from "./tasksSkill";
import type { Skill } from "./types";

export const skills: Skill[] = [
  TasksSkill,
  NotesSkill,
  FinanceSkill,
  KnowledgeSkill,
  PlannerSkill,
  DailyRoutineSkill,
];
