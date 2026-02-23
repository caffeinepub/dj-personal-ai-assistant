import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  UserProfile,
  Memory,
  Command,
  BehaviorRule,
  PersonalitySettings,
  ChatMessage,
  ImprovementLog,
  CodeSnippet,
  ExcelFile,
  Website,
} from "../backend.d.ts";

// User Profile Queries
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
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
      await actor.addImprovementLog("Memory", `Added memory: ${content.substring(0, 50)}...`);
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

export function useSetBehaviorRule() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ruleText: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setBehaviorRule(ruleText);
      await actor.addImprovementLog("Rule", `Set rule: ${ruleText.substring(0, 50)}...`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["behaviorRules"] });
      queryClient.invalidateQueries({ queryKey: ["improvementLogs"] });
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
      await actor.addImprovementLog("Personality", `Changed style to: ${style}`);
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
    mutationFn: async ({ role, content }: { role: string; content: string }) => {
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
      await actor.addImprovementLog("Module", `Activated module: ${moduleName}`);
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
      await actor.addImprovementLog("Module", `Deactivated module: ${moduleName}`);
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
    mutationFn: async ({ filename, data }: { filename: string; data: Uint8Array }) => {
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
    mutationFn: async ({ fileId, analysis }: { fileId: bigint; analysis: string }) => {
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
