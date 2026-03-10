import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CodeSnippet {
    id: bigint;
    title: string;
    codeContent: string;
    language: string;
    timestamp: Time;
}
export interface BehaviorRule {
    id: bigint;
    ruleText: string;
    timestamp: Time;
    priority: bigint;
}
export type Time = bigint;
export interface ImprovementLog {
    id: bigint;
    entryType: string;
    description: string;
    timestamp: Time;
}
export interface Memory {
    id: bigint;
    content: string;
    timestamp: Time;
}
export interface PersonalitySettings {
    communicationStyle: string;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    role: string;
    timestamp: Time;
}
export interface Command {
    id: bigint;
    name: string;
    timestamp: Time;
    actionDescription: string;
}
export interface Website {
    id: bigint;
    htmlContent: string;
    templateName: string;
    timestamp: Time;
    cssContent: string;
    jsContent: string;
}
export interface UserProfile {
    name: string;
    onboardingComplete: boolean;
    preferences: string;
    personalitySettings: PersonalitySettings;
}
export interface ExcelFile {
    id: bigint;
    analysisResult?: string;
    uploadTimestamp: Time;
    filename: string;
    rawData: Uint8Array;
}
export interface Task {
    id: bigint;
    title: string;
    description: string;
    deadline?: Time;
    priority: string;
    completed: boolean;
    createdAt: Time;
}
export interface Note {
    id: bigint;
    title: string;
    content: string;
    summary: string;
    tags: string[];
    createdAt: Time;
    updatedAt: Time;
}
export interface FinanceEntry {
    id: bigint;
    amount: bigint;
    category: string;
    description: string;
    entryDate: Time;
    createdAt: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateModule(moduleName: string): Promise<void>;
    addImprovementLog(entryType: string, description: string): Promise<void>;
    addMemory(content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCommand(name: string, actionDescription: string): Promise<void>;
    createUserProfile(name: string): Promise<void>;
    deactivateModule(moduleName: string): Promise<void>;
    deleteCommand(id: bigint): Promise<void>;
    deleteMemory(id: bigint): Promise<void>;
    deleteRule(id: bigint): Promise<void>;
    executeCommand(name: string): Promise<string>;
    getActiveModules(): Promise<Array<string>>;
    getAllCommands(): Promise<Array<Command>>;
    getAllMemories(): Promise<Array<Memory>>;
    getAllRules(): Promise<Array<BehaviorRule>>;
    getAllRulesOrdered(): Promise<Array<BehaviorRule>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(page: bigint, pageSize: bigint): Promise<Array<ChatMessage>>;
    getCodeSnippets(): Promise<Array<CodeSnippet>>;
    getExcelFiles(): Promise<Array<ExcelFile>>;
    getImprovementLogs(page: bigint, pageSize: bigint): Promise<Array<ImprovementLog>>;
    getPersonalitySettings(): Promise<PersonalitySettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWebsites(): Promise<Array<Website>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveChatMessage(role: string, content: string): Promise<void>;
    saveCodeSnippet(language: string, title: string, codeContent: string): Promise<void>;
    saveExcelAnalysis(fileId: bigint, analysis: string): Promise<void>;
    saveExcelFile(filename: string, rawData: Uint8Array): Promise<void>;
    saveOnboardingComplete(completed: boolean): Promise<void>;
    saveWebsite(templateName: string, htmlContent: string, cssContent: string, jsContent: string): Promise<void>;
    setBehaviorRule(ruleText: string, priority: bigint): Promise<void>;
    setPersonalitySettings(style: string): Promise<void>;
    updatePreferences(preferences: string): Promise<void>;
    updateRulePriority(id: bigint, newPriority: bigint): Promise<void>;
    // Tasks
    addTask(title: string, description: string, deadline: Time | null, priority: string): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    updateTaskCompletion(id: bigint, completed: boolean): Promise<void>;
    deleteTask(id: bigint): Promise<void>;
    // Notes
    addNote(title: string, content: string, summary: string, tags: string[]): Promise<void>;
    getAllNotes(): Promise<Array<Note>>;
    updateNote(id: bigint, title: string, content: string, summary: string, tags: string[]): Promise<void>;
    deleteNote(id: bigint): Promise<void>;
    // Finance
    addFinanceEntry(amount: bigint, category: string, description: string, entryDate: Time): Promise<void>;
    getAllFinanceEntries(): Promise<Array<FinanceEntry>>;
    deleteFinanceEntry(id: bigint): Promise<void>;
}
