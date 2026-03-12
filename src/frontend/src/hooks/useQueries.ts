import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BehaviorRule,
  ChatMessage,
  CodeSnippet,
  Command,
  ExcelFile,
  ImprovementLog,
  Memory,
  PersonalitySettings,
  UserProfile,
  Website,
} from "../backend.d.ts";
import { useActor } from "./useActor";

// Local type definitions for new modules (not yet in generated backend.ts)
export interface Task {
  id: bigint;
  title: string;
  description: string;
  deadline?: bigint;
  priority: string;
  completed: boolean;
  createdAt: bigint;
}

export interface Note {
  id: bigint;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  createdAt: bigint;
  updatedAt: bigint;
}

export interface FinanceEntry {
  id: bigint;
  amount: bigint;
  category: string;
  description: string;
  entryDate: bigint;
  createdAt: bigint;
}

// User Profile Queries
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useCreateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createUserProfile(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      profile: Partial<UserProfile> & {
        name: string;
        preferences: string;
        personalitySettings: PersonalitySettings;
      },
    ) => {
      if (!actor) throw new Error("Actor not available");
      const fullProfile: UserProfile = {
        name: profile.name,
        preferences: profile.preferences,
        personalitySettings: profile.personalitySettings,
        onboardingComplete: profile.onboardingComplete ?? false,
      };
      await actor.saveCallerUserProfile(fullProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Memory Queries
export function useMemories() {
  const { actor, isFetching } = useActor();
  return useQuery<Memory[]>({
    queryKey: ["memories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addMemory(content);
      await actor.addImprovementLog(
        "Memory",
        `Added memory: ${content.substring(0, 50)}...`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

export function useDeleteMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteMemory(id);
      await actor.addImprovementLog("Memory", `Deleted memory ID: ${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

// Custom Commands Queries
export function useCustomCommands() {
  const { actor, isFetching } = useActor();
  return useQuery<Command[]>({
    queryKey: ["customCommands"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommands();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCustomCommand() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, action }: { name: string; action: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.createCommand(name, action);
      await actor.addImprovementLog("Command", `Created command: ${name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCommands"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

export function useDeleteCommand() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteCommand(id);
      await actor.addImprovementLog("Command", `Deleted command ID: ${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCommands"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

// Behavior Rules Queries
export function useBehaviorRules() {
  const { actor, isFetching } = useActor();
  return useQuery<BehaviorRule[]>({
    queryKey: ["behaviorRules"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRules();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRulesOrdered() {
  const { actor, isFetching } = useActor();
  return useQuery<BehaviorRule[]>({
    queryKey: ["behaviorRulesOrdered"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRulesOrdered();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetBehaviorRule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ruleText,
      priority = 0n,
    }: { ruleText: string; priority?: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setBehaviorRule(ruleText, priority);
      await actor.addImprovementLog(
        "Rule",
        `Set rule: ${ruleText.substring(0, 50)}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behaviorRules"] });
      queryClient.invalidateQueries({ queryKey: ["behaviorRulesOrdered"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

export function useUpdateRulePriority() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      newPriority,
    }: { id: bigint; newPriority: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateRulePriority(id, newPriority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behaviorRules"] });
      queryClient.invalidateQueries({ queryKey: ["behaviorRulesOrdered"] });
    },
  });
}

export function useSaveOnboardingComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (completed: boolean) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveOnboardingComplete(completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useDeleteBehaviorRule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteRule(id);
      await actor.addImprovementLog("Rule", `Deleted rule ID: ${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behaviorRules"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

// Personality Settings Queries
export function usePersonalitySettings() {
  const { actor, isFetching } = useActor();
  return useQuery<PersonalitySettings>({
    queryKey: ["personalitySettings"],
    queryFn: async () => {
      if (!actor) return { communicationStyle: "professional" };
      return actor.getPersonalitySettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetPersonalitySettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (style: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setPersonalitySettings(style);
      await actor.addImprovementLog(
        "Personality",
        `Changed style to: ${style}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalitySettings"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

// Chat Messages Queries
export function useChatMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatMessages(0n, 100n);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      role,
      content,
    }: { role: string; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveChatMessage(role, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
  });
}

// Module Management Queries
export function useActiveModules() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["activeModules"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveModules();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActivateModule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleName: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.activateModule(moduleName);
      await actor.addImprovementLog(
        "Module",
        `Activated module: ${moduleName}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeModules"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

export function useDeactivateModule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moduleName: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deactivateModule(moduleName);
      await actor.addImprovementLog(
        "Module",
        `Deactivated module: ${moduleName}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeModules"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
    },
  });
}

// Improvement Log Queries
export function useImprovementLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<ImprovementLog[]>({
    queryKey: ["improvementLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getImprovementLogs(0n, 50n);
    },
    enabled: !!actor && !isFetching,
  });
}

// Code Snippets Queries
export function useCodeSnippets() {
  const { actor, isFetching } = useActor();
  return useQuery<CodeSnippet[]>({
    queryKey: ["codeSnippets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCodeSnippets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCodeSnippet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      language,
      title,
      code,
    }: {
      language: string;
      title: string;
      code: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCodeSnippet(language, title, code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["codeSnippets"] });
    },
  });
}

// Excel Files Queries
export function useExcelFiles() {
  const { actor, isFetching } = useActor();
  return useQuery<ExcelFile[]>({
    queryKey: ["excelFiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExcelFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveExcelFile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      filename,
      data,
    }: { filename: string; data: Uint8Array }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveExcelFile(filename, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["excelFiles"] });
    },
  });
}

export function useSaveExcelAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fileId,
      analysis,
    }: { fileId: bigint; analysis: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveExcelAnalysis(fileId, analysis);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["excelFiles"] });
    },
  });
}

// Website Templates Queries
export function useWebsites() {
  const { actor, isFetching } = useActor();
  return useQuery<Website[]>({
    queryKey: ["websites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWebsites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      html,
      css,
      js,
    }: {
      name: string;
      html: string;
      css: string;
      js: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveWebsite(name, html, css, js);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });
}

// Tasks Queries
export function useTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks() as Promise<Task[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      deadline,
      priority,
    }: {
      title: string;
      description: string;
      deadline: bigint | null;
      priority: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addTask(title, description, deadline, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTaskCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: { id: bigint; completed: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateTaskCompletion(id, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Notes Queries
export function useNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes() as Promise<Note[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      summary,
      tags,
    }: {
      title: string;
      content: string;
      summary: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addNote(title, content, summary, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      summary,
      tags,
    }: {
      id: bigint;
      title: string;
      content: string;
      summary: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateNote(id, title, content, summary, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Finance Queries
export function useFinanceEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<FinanceEntry[]>({
    queryKey: ["financeEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFinanceEntries() as Promise<FinanceEntry[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFinanceEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      category,
      description,
      entryDate,
    }: {
      amount: bigint;
      category: string;
      description: string;
      entryDate: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addFinanceEntry(amount, category, description, entryDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeEntries"] });
    },
  });
}

export function useDeleteFinanceEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteFinanceEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeEntries"] });
    },
  });
}
