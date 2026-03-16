/**
 * Autonomy Suggestions
 *
 * Defines the AutonomySuggestion type and dispatcher that fires
 * suggestions through the Proactive Engine event bus.
 */

export type AutonomySuggestionType = "goal" | "plan" | "task" | "knowledge";

export interface AutonomySuggestion {
  type: AutonomySuggestionType;
  message: string;
  suggestedActions?: string[];
  triggerId: string;
}

/**
 * Dispatch a suggestion through the Proactive Engine.
 * Fires the "dj-proactive-message" custom event consumed by ProactiveEngine.
 */
export function dispatchAutonomySuggestion(
  suggestion: AutonomySuggestion,
): void {
  window.dispatchEvent(
    new CustomEvent("dj-proactive-message", {
      detail: {
        content: suggestion.message,
        type: "suggestion",
        isCritical: false,
        triggerId: suggestion.triggerId,
      },
    }),
  );
}
