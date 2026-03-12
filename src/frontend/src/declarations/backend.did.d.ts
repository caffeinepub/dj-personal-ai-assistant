import type { Principal } from '@icp-sdk/core/principal';
import type { ActorMethod } from '@icp-sdk/core/actor';
import type { IDL } from '@icp-sdk/core/candid';

export interface BehaviorRule {
  'id' : bigint,
  'ruleText' : string,
  'timestamp' : Time,
  'priority' : bigint,
}
export interface ChatMessage {
  'id' : bigint,
  'content' : string,
  'role' : string,
  'timestamp' : Time,
}
export interface CodeSnippet {
  'id' : bigint,
  'title' : string,
  'codeContent' : string,
  'language' : string,
  'timestamp' : Time,
}
export interface Command {
  'id' : bigint,
  'name' : string,
  'timestamp' : Time,
  'actionDescription' : string,
}
export interface ExcelFile {
  'id' : bigint,
  'analysisResult' : [] | [string],
  'uploadTimestamp' : Time,
  'filename' : string,
  'rawData' : Uint8Array,
}
export interface ImprovementLog {
  'id' : bigint,
  'entryType' : string,
  'description' : string,
  'timestamp' : Time,
}
export interface Memory {
  'id' : bigint,
  'content' : string,
  'timestamp' : Time,
}
export interface PersonalitySettings { 'communicationStyle' : string }
export type Time = bigint;
export interface UserProfile {
  'name' : string,
  'onboardingComplete' : boolean,
  'preferences' : string,
  'personalitySettings' : PersonalitySettings,
}
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface Website {
  'id' : bigint,
  'htmlContent' : string,
  'templateName' : string,
  'timestamp' : Time,
  'cssContent' : string,
  'jsContent' : string,
}
export interface Task {
  'id' : bigint,
  'title' : string,
  'description' : string,
  'deadline' : [] | [Time],
  'priority' : string,
  'completed' : boolean,
  'createdAt' : Time,
}
export interface Note {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'summary' : string,
  'tags' : Array<string>,
  'createdAt' : Time,
  'updatedAt' : Time,
}
export interface FinanceEntry {
  'id' : bigint,
  'amount' : bigint,
  'category' : string,
  'description' : string,
  'entryDate' : Time,
  'createdAt' : Time,
}
export interface _SERVICE {
  '_initializeAccessControlWithSecret' : ActorMethod<[string], undefined>,
  'activateModule' : ActorMethod<[string], undefined>,
  'addImprovementLog' : ActorMethod<[string, string], undefined>,
  'addMemory' : ActorMethod<[string], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'createCommand' : ActorMethod<[string, string], undefined>,
  'createUserProfile' : ActorMethod<[string], undefined>,
  'deactivateModule' : ActorMethod<[string], undefined>,
  'deleteCommand' : ActorMethod<[bigint], undefined>,
  'deleteMemory' : ActorMethod<[bigint], undefined>,
  'deleteRule' : ActorMethod<[bigint], undefined>,
  'executeCommand' : ActorMethod<[string], string>,
  'getActiveModules' : ActorMethod<[], Array<string>>,
  'getAllCommands' : ActorMethod<[], Array<Command>>,
  'getAllMemories' : ActorMethod<[], Array<Memory>>,
  'getAllRules' : ActorMethod<[], Array<BehaviorRule>>,
  'getAllRulesOrdered' : ActorMethod<[], Array<BehaviorRule>>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getChatMessages' : ActorMethod<[bigint, bigint], Array<ChatMessage>>,
  'getCodeSnippets' : ActorMethod<[], Array<CodeSnippet>>,
  'getExcelFiles' : ActorMethod<[], Array<ExcelFile>>,
  'getImprovementLogs' : ActorMethod<[bigint, bigint], Array<ImprovementLog>>,
  'getPersonalitySettings' : ActorMethod<[], PersonalitySettings>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'getWebsites' : ActorMethod<[], Array<Website>>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'saveChatMessage' : ActorMethod<[string, string], undefined>,
  'saveCodeSnippet' : ActorMethod<[string, string, string], undefined>,
  'saveExcelAnalysis' : ActorMethod<[bigint, string], undefined>,
  'saveExcelFile' : ActorMethod<[string, Uint8Array], undefined>,
  'saveOnboardingComplete' : ActorMethod<[boolean], undefined>,
  'saveWebsite' : ActorMethod<[string, string, string, string], undefined>,
  'setBehaviorRule' : ActorMethod<[string, bigint], undefined>,
  'setPersonalitySettings' : ActorMethod<[string], undefined>,
  'updatePreferences' : ActorMethod<[string], undefined>,
  'updateRulePriority' : ActorMethod<[bigint, bigint], undefined>,
  // Tasks
  'addTask' : ActorMethod<[string, string, [] | [bigint], string], undefined>,
  'getAllTasks' : ActorMethod<[], Array<Task>>,
  'updateTaskCompletion' : ActorMethod<[bigint, boolean], undefined>,
  'deleteTask' : ActorMethod<[bigint], undefined>,
  // Notes
  'addNote' : ActorMethod<[string, string, string, Array<string>], undefined>,
  'getAllNotes' : ActorMethod<[], Array<Note>>,
  'updateNote' : ActorMethod<[bigint, string, string, string, Array<string>], undefined>,
  'deleteNote' : ActorMethod<[bigint], undefined>,
  // Finance
  'addFinanceEntry' : ActorMethod<[bigint, string, string, bigint], undefined>,
  'getAllFinanceEntries' : ActorMethod<[], Array<FinanceEntry>>,
  'deleteFinanceEntry' : ActorMethod<[bigint], undefined>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
