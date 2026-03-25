import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Plan {
    id: string;
    status: string;
    goal: string;
    stepsJson: string;
    createdAt: bigint;
}
export interface ChatThread {
    id: bigint;
    moduleTag?: string;
    name: string;
    createdAt: bigint;
}
export interface MemoryNode {
    id: bigint;
    content: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    onboardingComplete: boolean;
    preferences: string;
    personalitySettings: string;
}
export interface ThreadMessage {
    id: bigint;
    content: string;
    role: string;
    timestamp: bigint;
    threadId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMemory(content: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatThread(name: string, moduleTag: string | null): Promise<bigint>;
    createUserProfile(profile: UserProfile): Promise<void>;
    deleteChatThread(threadId: bigint): Promise<boolean>;
    deleteMemory(id: bigint): Promise<boolean>;
    deletePlan(id: string): Promise<boolean>;
    deleteThreadMessage(threadId: bigint, messageId: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatThreads(): Promise<Array<ChatThread>>;
    getMemories(): Promise<Array<MemoryNode>>;
    getPlanById(id: string): Promise<Plan | null>;
    getPlans(): Promise<Array<Plan>>;
    getThreadMessages(threadId: bigint, offset: bigint, limit: bigint): Promise<Array<ThreadMessage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePlan(id: string, goal: string, stepsJson: string, status: string): Promise<boolean>;
    saveThreadMessage(threadId: bigint, role: string, content: string): Promise<bigint>;
    updatePlan(id: string, goal: string, stepsJson: string, status: string): Promise<boolean>;
}
