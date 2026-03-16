# DJ Personal AI Assistant

## Current State

DJ has a fully modular assistant pipeline:
- Skill-based architecture with TasksSkill, NotesSkill, FinanceSkill, KnowledgeSkill, PlannerSkill
- Memory Graph system (on-chain, with extraction, search, decay)
- Cognitive Planning Engine (on-chain plans with steps)
- Proactive Behavior Engine (task reminders, overdue alerts, knowledge staleness, daily briefing)
- Context Engine (current page, recent actions, time of day)
- proactiveState.ts with persistent localStorage cooldown + trigger dedup

## Requested Changes (Diff)

### Add
- `assistant/autonomy/autonomyEngine.ts` — React hook that runs an evaluation every 30 minutes and on-demand via chat commands; integrates with the Proactive Engine to dispatch suggestions
- `assistant/autonomy/autonomyRules.ts` — 5 rule definitions: Stalled Plan (7 days no progress), Goal Support (goal in memory but no plan), Habit Reinforcement (frequent behavior patterns), Knowledge Growth (followed topics not reviewed recently), Task Overload (too many tasks today)
- `assistant/autonomy/autonomyEvaluator.ts` — Evaluates system state (plans, tasks, memories, knowledge topics) against all rules and returns an array of `AutonomySuggestion` objects
- `assistant/autonomy/autonomySuggestions.ts` — `AutonomySuggestion` type definition and helper to route suggestions through the Proactive Engine
- New intent detection in `intentEngine.ts` for: "DJ review my goals", "DJ what should I focus on", "DJ suggest improvements" → `AUTONOMY_REVIEW` intent
- New case in `assistantController.ts` for `AUTONOMY_REVIEW` action — triggers immediate evaluation
- `AutonomyEngine` component mounted in `App.tsx`
- Settings toggle: "Enable Autonomy Suggestions" in the Assistant Behavior section of SettingsPage

### Modify
- `intentEngine.ts` — add `AUTONOMY_REVIEW` intent
- `decisionEngine.ts` — add `AUTONOMY_REVIEW` action case
- `assistantController.ts` — handle `AUTONOMY_REVIEW` action
- `SettingsPage.tsx` — add "Enable Autonomy Suggestions" toggle in Assistant Behavior section
- `App.tsx` — mount `<AutonomyEngine />` component

### Remove
- Nothing removed; all existing features preserved

## Implementation Plan

1. Create `autonomySuggestions.ts` with `AutonomySuggestion` type and dispatch helper
2. Create `autonomyRules.ts` with 5 rule functions, each returning `AutonomySuggestion | null`
3. Create `autonomyEvaluator.ts` that runs all rules against system state and returns suggestions
4. Create `autonomyEngine.ts` React hook with 30-min interval + manual trigger via custom event
5. Add `AUTONOMY_REVIEW` to `intentEngine.ts`
6. Add `AUTONOMY_REVIEW` action to `decisionEngine.ts`
7. Handle `AUTONOMY_REVIEW` in `assistantController.ts`
8. Add "Enable Autonomy Suggestions" toggle to SettingsPage
9. Mount `<AutonomyEngine />` in App.tsx
