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
} from "../types/backendTypes";

// Knowledge Folder types (defined locally since they are not in backend.ts)
export interface KnowledgeFolder {
  id: bigint;
  name: string;
  parentId: bigint | null;
  createdAt: bigint;
}

// Extended actor type that includes chat-thread methods added after initial generation
interface DJActorExtended {
  getChatThreads(): Promise<ChatThread[]>;
  createChatThread(name: string, moduleTag: string | null): Promise<bigint>;
  deleteChatThread(id: bigint): Promise<void>;
  addThreadMessage(
    threadId: bigint,
    role: string,
    content: string,
  ): Promise<void>;
  getThreadMessages(
    threadId: bigint,
    offset: bigint,
    limit: bigint,
  ): Promise<ThreadMessage[]>;
  deleteThreadMessage(threadId: bigint, messageId: bigint): Promise<void>;
}

export interface WikiPage {
  id: bigint;
  folderId: bigint;
  overviewSection: string;
  keyConceptsSection: string;
  tipsSection: string;
  lastEditedAt: bigint;
}

export interface ChatThread {
  id: bigint;
  name: string;
  moduleTag: string | null;
  createdAt: bigint;
}

export interface ThreadMessage {
  id: bigint;
  threadId: bigint;
  role: string;
  content: string;
  timestamp: bigint;
}

import type { Plan } from "../assistant/planner/planTypes";
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
      return (actor as any).getCallerUserProfile();
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
      await (actor as any).createUserProfile(name);
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
      await (actor as any).saveCallerUserProfile(fullProfile);
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
      return (actor as any).getAllMemories();
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
      await (actor as any).addMemory(content);
      await (actor as any).addImprovementLog(
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
      await (actor as any).deleteMemory(id);
      await (actor as any).addImprovementLog(
        "Memory",
        `Deleted memory ID: ${id}`,
      );
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
      return (actor as any).getAllCommands();
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
      await (actor as any).createCommand(name, action);
      await (actor as any).addImprovementLog(
        "Command",
        `Created command: ${name}`,
      );
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
      await (actor as any).deleteCommand(id);
      await (actor as any).addImprovementLog(
        "Command",
        `Deleted command ID: ${id}`,
      );
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
      return (actor as any).getAllRules();
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
      return (actor as any).getAllRulesOrdered();
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
      await (actor as any).setBehaviorRule(ruleText, priority);
      await (actor as any).addImprovementLog(
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
      await (actor as any).updateRulePriority(id, newPriority);
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
      await (actor as any).saveOnboardingComplete(completed);
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
      await (actor as any).deleteRule(id);
      await (actor as any).addImprovementLog("Rule", `Deleted rule ID: ${id}`);
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
      return (actor as any).getPersonalitySettings();
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
      await (actor as any).setPersonalitySettings(style);
      await (actor as any).addImprovementLog(
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
      return (actor as any).getChatMessages(0n, 100n);
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
      await (actor as any).saveChatMessage(role, content);
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
      return (actor as any).getActiveModules();
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
      await (actor as any).activateModule(moduleName);
      await (actor as any).addImprovementLog(
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
      await (actor as any).deactivateModule(moduleName);
      await (actor as any).addImprovementLog(
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
      return (actor as any).getImprovementLogs(0n, 50n);
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
      return (actor as any).getCodeSnippets();
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
      await (actor as any).saveCodeSnippet(language, title, code);
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
      return (actor as any).getExcelFiles();
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
      await (actor as any).saveExcelFile(filename, data);
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
      await (actor as any).saveExcelAnalysis(fileId, analysis);
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
      return (actor as any).getWebsites();
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
      await (actor as any).saveWebsite(name, html, css, js);
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
      return (actor as any).getAllTasks() as Promise<Task[]>;
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
      await (actor as any).addTask(title, description, deadline, priority);
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
      await (actor as any).updateTaskCompletion(id, completed);
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
      await (actor as any).deleteTask(id);
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
      return (actor as any).getAllNotes() as Promise<Note[]>;
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
      await (actor as any).addNote(title, content, summary, tags);
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
      await (actor as any).updateNote(id, title, content, summary, tags);
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
      await (actor as any).deleteNote(id);
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
      return (actor as any).getAllFinanceEntries() as Promise<FinanceEntry[]>;
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
      await (actor as any).addFinanceEntry(
        amount,
        category,
        description,
        entryDate,
      );
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
      await (actor as any).deleteFinanceEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeEntries"] });
    },
  });
}

// Knowledge Folder Queries
export function useKnowledgeFolders() {
  const { actor, isFetching } = useActor();
  return useQuery<KnowledgeFolder[]>({
    queryKey: ["knowledgeFolders"],
    queryFn: async () => {
      if (!actor) return [];
      const folders = await (actor as any).getFolders();
      return folders as KnowledgeFolder[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateKnowledgeFolder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      parentId,
    }: { name: string; parentId: bigint | null }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).createFolder(name, parentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeFolders"] });
    },
  });
}

export function useDeleteKnowledgeFolder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).deleteFolder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeFolders"] });
    },
  });
}

// Wiki Page Queries
export function useWikiPageByFolder(folderId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<WikiPage | null>({
    queryKey: ["wikiPage", folderId?.toString()],
    queryFn: async () => {
      if (!actor || folderId === null) return null;
      return (actor as any).getWikiPageByFolder(folderId);
    },
    enabled: !!actor && !isFetching && folderId !== null,
  });
}

export function useSaveWikiPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      folderId,
      overview,
      keyConcepts,
      tips,
    }: {
      folderId: bigint;
      overview: string;
      keyConcepts: string;
      tips: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await (actor as any).saveWikiPage(folderId, overview, keyConcepts, tips);
    },
    onSuccess: (
      _data: unknown,
      variables: {
        folderId: bigint;
        overview: string;
        keyConcepts: string;
        tips: string;
      },
    ) => {
      queryClient.invalidateQueries({
        queryKey: ["wikiPage", variables.folderId.toString()],
      });
    },
  });
}

// Chat Thread Queries
export function useChatThreads() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatThread[]>({
    queryKey: ["chatThreads"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await (
        actor as unknown as DJActorExtended
      ).getChatThreads();
      return result as ChatThread[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useThreadMessages(threadId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ThreadMessage[]>({
    queryKey: ["threadMessages", threadId?.toString()],
    queryFn: async () => {
      if (!actor || threadId === null) return [];
      const result = await (
        actor as unknown as DJActorExtended
      ).getThreadMessages(threadId, 0n, 200n);
      return result as ThreadMessage[];
    },
    enabled: !!actor && !isFetching && threadId !== null,
    refetchInterval: 30000,
  });
}

// ── Plan Queries ──────────────────────────────────────────────────────────────

export function usePlans() {
  const { actor, isFetching } = useActor();
  return useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      if (!actor) return [];
      const results = await actor.getPlans();
      return results.map((raw: any) => ({
        id: raw.id,
        goal: raw.goal,
        steps: (() => {
          try {
            return JSON.parse(raw.stepsJson);
          } catch {
            return [];
          }
        })(),
        createdAt: Number(raw.createdAt),
        status: raw.status as Plan["status"],
      }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: Plan) => {
      if (!actor) throw new Error("Actor not available");
      await actor.savePlan(
        plan.id,
        plan.goal,
        JSON.stringify(plan.steps),
        plan.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useUpdatePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: Plan) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updatePlan(
        plan.id,
        plan.goal,
        JSON.stringify(plan.steps),
        plan.status,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useDeletePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deletePlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
