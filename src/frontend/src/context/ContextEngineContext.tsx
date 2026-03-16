import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTasks, useUserProfile } from "../hooks/useQueries";

export type RecentActionType =
  | "page_visit"
  | "chat_message"
  | "task_added"
  | "note_added"
  | "finance_entry_added";

export interface RecentAction {
  type: RecentActionType;
  label: string;
  timestamp: number;
}

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface LearnedPatterns {
  financeEntriesEvening: number;
  financeEntriesMorning: number;
  notesWeekday: number;
  notesWeekend: number;
  pageVisitCounts: Record<string, number>;
  tasksAddedCount: number;
}

const DEFAULT_PATTERNS: LearnedPatterns = {
  financeEntriesEvening: 0,
  financeEntriesMorning: 0,
  notesWeekday: 0,
  notesWeekend: 0,
  pageVisitCounts: {},
  tasksAddedCount: 0,
};

export interface ActiveTask {
  title: string;
  deadline?: bigint;
  priority: string;
  completed: boolean;
}

export interface UserPreferences {
  name?: string;
  profession?: string;
  goals?: string;
  preferences?: string;
}

export interface ContextEngineState {
  currentPage: string;
  recentActions: RecentAction[];
  activeTasks: ActiveTask[];
  timeOfDay: TimeOfDay;
  userPreferences: UserPreferences | null;
  learnedPatterns: LearnedPatterns;
  isTyping: boolean;
  isVoiceListening: boolean;
  setIsTyping: (v: boolean) => void;
  setIsVoiceListening: (v: boolean) => void;
  logAction: (type: RecentActionType, label: string) => void;
  setCurrentPage: (path: string) => void;
}

const ContextEngineContext = createContext<ContextEngineState | null>(null);

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function loadRecentActions(): RecentAction[] {
  try {
    const raw = sessionStorage.getItem("dj_recent_actions");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveRecentActions(actions: RecentAction[]) {
  try {
    sessionStorage.setItem("dj_recent_actions", JSON.stringify(actions));
  } catch {}
}

function loadLearnedPatterns(): LearnedPatterns {
  try {
    const raw = localStorage.getItem("dj_learned_patterns");
    if (raw) return { ...DEFAULT_PATTERNS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PATTERNS };
}

function saveLearnedPatterns(patterns: LearnedPatterns) {
  try {
    localStorage.setItem("dj_learned_patterns", JSON.stringify(patterns));
  } catch {}
}

export function ContextEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use React Query cached data — avoids redundant actor calls
  const { data: profileData } = useUserProfile();
  const { data: tasksData } = useTasks();

  const [currentPage, setCurrentPageState] = useState("/");
  const [recentActions, setRecentActions] =
    useState<RecentAction[]>(loadRecentActions);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() =>
    getTimeOfDay(new Date().getHours()),
  );
  const [learnedPatterns, setLearnedPatterns] =
    useState<LearnedPatterns>(loadLearnedPatterns);

  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const learnedPatternsRef = useRef(learnedPatterns);
  learnedPatternsRef.current = learnedPatterns;

  // Update time of day every 30 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        setTimeOfDay(getTimeOfDay(new Date().getHours()));
      },
      30 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  // Derive user preferences from cached profile data
  const userPreferences: UserPreferences | null = profileData
    ? (() => {
        const prefs: UserPreferences = {};
        if (profileData.name) prefs.name = profileData.name;
        if (profileData.preferences) {
          try {
            const parsed = JSON.parse(profileData.preferences);
            if (parsed.name) prefs.name = parsed.name;
            if (parsed.profession) prefs.profession = parsed.profession;
            if (parsed.goals) prefs.goals = parsed.goals;
            if (parsed.preferences) prefs.preferences = parsed.preferences;
          } catch {
            prefs.preferences = profileData.preferences;
          }
        }
        return prefs;
      })()
    : null;

  // Derive active tasks (due today or overdue) from cached task data
  const activeTasks: ActiveTask[] = (tasksData ?? [])
    .filter((t) => {
      if (t.completed) return false;
      if (!t.deadline) return false;
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const deadlineMs = Number(t.deadline) / 1_000_000;
      return deadlineMs <= todayEnd.getTime();
    })
    .map((t) => ({
      title: t.title,
      deadline: t.deadline,
      priority: t.priority,
      completed: t.completed,
    }));

  const logAction = useCallback((type: RecentActionType, label: string) => {
    const action: RecentAction = { type, label, timestamp: Date.now() };

    setRecentActions((prev) => {
      const next = [action, ...prev].slice(0, 10);
      saveRecentActions(next);
      return next;
    });

    // Update learned patterns
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    const current = learnedPatternsRef.current;
    let updated: LearnedPatterns | null = null;

    if (type === "finance_entry_added") {
      if (hour >= 17) {
        updated = {
          ...current,
          financeEntriesEvening: current.financeEntriesEvening + 1,
        };
      } else if (hour < 12) {
        updated = {
          ...current,
          financeEntriesMorning: current.financeEntriesMorning + 1,
        };
      }
    } else if (type === "note_added") {
      if (isWeekend) {
        updated = { ...current, notesWeekend: current.notesWeekend + 1 };
      } else {
        updated = { ...current, notesWeekday: current.notesWeekday + 1 };
      }
    } else if (type === "page_visit") {
      const counts = { ...current.pageVisitCounts };
      counts[label] = (counts[label] || 0) + 1;
      updated = { ...current, pageVisitCounts: counts };
    } else if (type === "task_added") {
      updated = { ...current, tasksAddedCount: current.tasksAddedCount + 1 };
    }

    if (updated) {
      saveLearnedPatterns(updated);
      setLearnedPatterns(updated);
    }
  }, []);

  const setCurrentPage = useCallback((path: string) => {
    setCurrentPageState(path);
  }, []);

  const value: ContextEngineState = {
    currentPage,
    recentActions,
    activeTasks,
    timeOfDay,
    userPreferences,
    learnedPatterns,
    isTyping,
    isVoiceListening,
    setIsTyping,
    setIsVoiceListening,
    logAction,
    setCurrentPage,
  };

  return (
    <ContextEngineContext.Provider value={value}>
      {children}
    </ContextEngineContext.Provider>
  );
}

export function useContextEngine(): ContextEngineState {
  const ctx = useContext(ContextEngineContext);
  if (!ctx) {
    throw new Error(
      "useContextEngine must be used within ContextEngineProvider",
    );
  }
  return ctx;
}

function getPageLabel(path: string): string {
  const map: Record<string, string> = {
    "/": "Dashboard",
    "/chat": "Chat",
    "/tasks": "Tasks",
    "/notes": "Notes",
    "/finance": "Finance",
    "/knowledge": "Knowledge",
    "/settings": "Settings",
    "/profile": "Profile",
    "/excel": "Excel",
    "/coding": "Coding",
    "/website": "Website",
    "/teach": "Teach DJ",
  };
  return map[path] || path;
}

function getMostVisitedPage(counts: Record<string, number>): string | null {
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return getPageLabel(entries[0][0]);
}

function formatRelativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs === 1) return "1 hour ago";
  return `${hrs} hours ago`;
}

function getActionLabel(action: RecentAction): string {
  const rel = formatRelativeTime(action.timestamp);
  switch (action.type) {
    case "page_visit":
      return `visited ${getPageLabel(action.label)} page ${rel}`;
    case "chat_message":
      return `sent a message ${rel}`;
    case "task_added":
      return `added task "${action.label}" ${rel}`;
    case "note_added":
      return `saved note "${action.label}" ${rel}`;
    case "finance_entry_added":
      return `logged a ${action.label} entry ${rel}`;
    default:
      return `${action.label} ${rel}`;
  }
}

function formatTaskDeadline(deadline: bigint): string {
  const ms = Number(deadline) / 1_000_000;
  const now = Date.now();
  if (ms < now) return "overdue";
  return "due today";
}

export function buildContextPrompt(ctx: ContextEngineState): string {
  const parts: string[] = [];

  const pageLabel = getPageLabel(ctx.currentPage);
  parts.push(
    `You are currently helping the user on the ${pageLabel} page. The time is ${ctx.timeOfDay}.`,
  );

  const allRecent = [...ctx.recentActions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  if (allRecent.length > 0) {
    const actionList = allRecent.map(getActionLabel).join(", ");
    parts.push(`Recent actions: ${actionList}.`);
  }

  if (ctx.activeTasks.length > 0) {
    const taskList = ctx.activeTasks
      .slice(0, 3)
      .map((t) => {
        const status = t.deadline ? formatTaskDeadline(t.deadline) : "active";
        return `"${t.title}" (${status})`;
      })
      .join(", ");
    parts.push(`Active/overdue tasks: ${taskList}.`);
  }

  if (ctx.userPreferences) {
    const p = ctx.userPreferences;
    const infoParts: string[] = [];
    if (p.name) infoParts.push(`Name is ${p.name}`);
    if (p.profession) infoParts.push(`profession is ${p.profession}`);
    if (p.goals) infoParts.push(`goals are ${p.goals}`);
    if (infoParts.length > 0) {
      parts.push(`User info: ${infoParts.join(", ")}.`);
    }
  }

  const patternParts: string[] = [];
  const { learnedPatterns: lp } = ctx;
  if (lp.financeEntriesEvening >= 3) {
    patternParts.push("User often logs finance entries in the evening");
  } else if (lp.financeEntriesMorning >= 3) {
    patternParts.push("User often logs finance entries in the morning");
  }
  if (lp.notesWeekday >= 5 && lp.notesWeekday > lp.notesWeekend * 2) {
    patternParts.push("User tends to take notes on weekdays");
  }
  if (lp.tasksAddedCount >= 5) {
    patternParts.push("User is a frequent task planner");
  }
  const mostVisited = getMostVisitedPage(lp.pageVisitCounts);
  if (mostVisited) {
    patternParts.push(`Most visited page: ${mostVisited}`);
  }
  if (patternParts.length > 0) {
    parts.push(`Learned patterns: ${patternParts.join(". ")}.`);
  }

  if (parts.length === 0) return "";
  return `[CONTEXT: ${parts.join(" ")}]`;
}
