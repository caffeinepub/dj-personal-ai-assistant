const PATTERN_KEY = "dj_command_patterns";

export type CommandPatternType = "expense" | "reminder" | "note" | "task";

interface PatternEntry {
  count: number;
  lastSeen: number;
  suggested: boolean;
}

export function trackCommandPattern(type: CommandPatternType) {
  const data: Record<string, PatternEntry> = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}",
  );
  const entry = data[type] || { count: 0, lastSeen: 0, suggested: false };
  data[type] = {
    count: entry.count + 1,
    lastSeen: Date.now(),
    suggested: entry.suggested,
  };
  localStorage.setItem(PATTERN_KEY, JSON.stringify(data));
}

export function getSuggestedRules(): CommandPatternType[] {
  const data: Record<string, PatternEntry> = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}",
  );
  return (Object.entries(data) as [CommandPatternType, PatternEntry][])
    .filter(([, v]) => v.count >= 3 && !v.suggested)
    .map(([k]) => k);
}

export function markRuleSuggested(type: CommandPatternType) {
  const data: Record<string, PatternEntry> = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}",
  );
  if (data[type]) data[type].suggested = true;
  localStorage.setItem(PATTERN_KEY, JSON.stringify(data));
}

export function getPatternRuleText(type: CommandPatternType): {
  trigger: string;
  action: string;
} {
  const rules: Record<CommandPatternType, { trigger: string; action: string }> =
    {
      expense: {
        trigger: "add expense",
        action: "Log to Finance Tracker automatically",
      },
      reminder: {
        trigger: "remind me",
        action: "Create task with deadline automatically",
      },
      note: { trigger: "note:", action: "Save to Notes automatically" },
      task: { trigger: "add task", action: "Create task automatically" },
    };
  return rules[type] || { trigger: type, action: "Handle automatically" };
}

export function getPatternCount(type: CommandPatternType): number {
  const data: Record<string, PatternEntry> = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}",
  );
  return data[type]?.count ?? 0;
}
