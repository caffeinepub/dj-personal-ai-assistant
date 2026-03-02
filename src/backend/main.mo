import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // ----- Types -----

  type PersonalitySettings = {
    communicationStyle : Text; // formal, casual, etc.
  };

  type Memory = {
    id : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  type Command = {
    id : Nat;
    name : Text;
    actionDescription : Text;
    timestamp : Time.Time;
  };

  type BehaviorRule = {
    id : Nat;
    ruleText : Text;
    priority : Nat;
    timestamp : Time.Time;
  };

  type ChatMessage = {
    id : Nat;
    role : Text; // user or assistant
    content : Text;
    timestamp : Time.Time;
  };

  type ImprovementLog = {
    id : Nat;
    entryType : Text; // memory, command, etc.
    description : Text;
    timestamp : Time.Time;
  };

  type ExcelFile = {
    id : Nat;
    filename : Text;
    uploadTimestamp : Time.Time;
    rawData : [Nat8];
    analysisResult : ?Text;
  };

  type CodeSnippet = {
    id : Nat;
    language : Text;
    title : Text;
    codeContent : Text;
    timestamp : Time.Time;
  };

  type Website = {
    id : Nat;
    templateName : Text;
    htmlContent : Text;
    cssContent : Text;
    jsContent : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    preferences : Text;
    personalitySettings : PersonalitySettings;
    onboardingComplete : Bool;
  };

  module Memory {
    public func toTimestampOrder(memory1 : Memory, memory2 : Memory) : Order.Order {
      Int.compare(memory1.timestamp, memory2.timestamp);
    };
  };

  module ChatMessage {
    public func compareByTimestampReversed(msg1 : ChatMessage, msg2 : ChatMessage) : Order.Order {
      Int.compare(msg2.timestamp, msg1.timestamp); // Reverse order (newest first)
    };
  };

  module ImprovementLog {
    public func compareByTimestampReversed(log1 : ImprovementLog, log2 : ImprovementLog) : Order.Order {
      Int.compare(log2.timestamp, log1.timestamp); // Reverse order (newest first)
    };
  };

  module BehaviorRule {
    public func compareByPriority(rule1 : BehaviorRule, rule2 : BehaviorRule) : Order.Order {
      Nat.compare(rule1.priority, rule2.priority);
    };
  };

  // ----- Storage -----
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userMemories = Map.empty<Principal, List.List<Memory>>();
  let userCommands = Map.empty<Principal, List.List<Command>>();
  let userRules = Map.empty<Principal, List.List<BehaviorRule>>();
  let userChatHistory = Map.empty<Principal, List.List<ChatMessage>>();
  let userModules = Map.empty<Principal, Set.Set<Text>>();
  let userImprovementLogs = Map.empty<Principal, List.List<ImprovementLog>>();
  let userExcelFiles = Map.empty<Principal, List.List<ExcelFile>>();
  let userCodeSnippets = Map.empty<Principal, List.List<CodeSnippet>>();
  let userWebsites = Map.empty<Principal, List.List<Website>>();

  // ----- ID Counters -----
  var nextMemoryId = 1;
  var nextCommandId = 1;
  var nextRuleId = 1;
  var nextChatMessageId = 1;
  var nextLogId = 1;
  var nextExcelFileId = 1;
  var nextSnippetId = 1;
  var nextWebsiteId = 1;

  // ----- Authorization -----
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ----- User Profile Management (Required Interface) -----
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ----- Legacy Profile Functions -----
  public shared ({ caller }) func createUserProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    if (userProfiles.containsKey(caller)) { Runtime.trap("User profile already exists") };
    let profile : UserProfile = {
      name;
      preferences = "";
      personalitySettings = { communicationStyle = "formal" };
      onboardingComplete = false;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updatePreferences(preferences : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update preferences");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          preferences;
          personalitySettings = profile.personalitySettings;
          onboardingComplete = profile.onboardingComplete;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func saveOnboardingComplete(completed : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update onboarding status");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          preferences = profile.preferences;
          personalitySettings = profile.personalitySettings;
          onboardingComplete = completed;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // ----- Memory System -----
  public shared ({ caller }) func addMemory(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add memories");
    };
    let memory : Memory = {
      id = nextMemoryId;
      content;
      timestamp = Time.now();
    };
    nextMemoryId += 1;

    let currentMemories = switch (userMemories.get(caller)) {
      case (null) { List.empty<Memory>() };
      case (?memories) { memories };
    };

    currentMemories.add(memory);
    userMemories.add(caller, currentMemories);
  };

  public query ({ caller }) func getAllMemories() : async [Memory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access memories");
    };
    switch (userMemories.get(caller)) {
      case (null) { [] };
      case (?memories) { memories.toArray().sort(Memory.toTimestampOrder) };
    };
  };

  public shared ({ caller }) func deleteMemory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete memories");
    };
    switch (userMemories.get(caller)) {
      case (null) { Runtime.trap("No memories found") };
      case (?memories) {
        let filtered = memories.filter(func(m) { m.id != id });
        userMemories.add(caller, filtered);
      };
    };
  };

  // ----- Command System -----
  public shared ({ caller }) func createCommand(name : Text, actionDescription : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create commands");
    };
    let command : Command = {
      id = nextCommandId;
      name;
      actionDescription;
      timestamp = Time.now();
    };
    nextCommandId += 1;

    let currentCommands = switch (userCommands.get(caller)) {
      case (null) { List.empty<Command>() };
      case (?commands) { commands };
    };

    currentCommands.add(command);
    userCommands.add(caller, currentCommands);
  };

  public query ({ caller }) func getAllCommands() : async [Command] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access commands");
    };
    switch (userCommands.get(caller)) {
      case (null) { [] };
      case (?commands) { commands.toArray() };
    };
  };

  public query ({ caller }) func executeCommand(name : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can execute commands");
    };
    switch (userCommands.get(caller)) {
      case (null) { Runtime.trap("No commands found") };
      case (?commands) {
        switch (commands.find(func(c) { c.name == name })) {
          case (null) { Runtime.trap("Command not found") };
          case (?command) { command.actionDescription };
        };
      };
    };
  };

  public shared ({ caller }) func deleteCommand(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete commands");
    };
    switch (userCommands.get(caller)) {
      case (null) { Runtime.trap("No commands found") };
      case (?commands) {
        let filtered = commands.filter(func(c) { c.id != id });
        userCommands.add(caller, filtered);
      };
    };
  };

  // ----- Behavior Rules System -----
  public shared ({ caller }) func setBehaviorRule(ruleText : Text, priority : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set behavior rules");
    };
    let rule : BehaviorRule = {
      id = nextRuleId;
      ruleText;
      priority;
      timestamp = Time.now();
    };
    nextRuleId += 1;

    let currentRules = switch (userRules.get(caller)) {
      case (null) { List.empty<BehaviorRule>() };
      case (?rules) { rules };
    };

    currentRules.add(rule);
    userRules.add(caller, currentRules);
  };

  public query ({ caller }) func getAllRules() : async [BehaviorRule] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access behavior rules");
    };
    switch (userRules.get(caller)) {
      case (null) { [] };
      case (?rules) { rules.toArray() };
    };
  };

  public shared ({ caller }) func updateRulePriority(id : Nat, newPriority : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update rule priority");
    };
    switch (userRules.get(caller)) {
      case (null) { Runtime.trap("No rules found") };
      case (?rules) {
        let updatedRules = rules.map<BehaviorRule, BehaviorRule>(
          func(rule) {
            if (rule.id == id) { { rule with priority = newPriority } } else {
              rule;
            };
          }
        );
        userRules.add(caller, updatedRules);
      };
    };
  };

  public query ({ caller }) func getAllRulesOrdered() : async [BehaviorRule] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access behavior rules");
    };
    switch (userRules.get(caller)) {
      case (null) { [] };
      case (?rules) { rules.toArray().sort(BehaviorRule.compareByPriority) };
    };
  };

  public shared ({ caller }) func deleteRule(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete behavior rules");
    };
    switch (userRules.get(caller)) {
      case (null) { Runtime.trap("No rules found") };
      case (?rules) {
        let filtered = rules.filter(func(r) { r.id != id });
        userRules.add(caller, filtered);
      };
    };
  };

  // ----- Personality Settings -----
  public shared ({ caller }) func setPersonalitySettings(style : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set personality settings");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let newSettings : PersonalitySettings = {
          communicationStyle = style;
        };
        let updatedProfile : UserProfile = {
          name = profile.name;
          preferences = profile.preferences;
          personalitySettings = newSettings;
          onboardingComplete = profile.onboardingComplete;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getPersonalitySettings() : async PersonalitySettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access personality settings");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile.personalitySettings };
    };
  };

  // ----- Chat History -----
  public shared ({ caller }) func saveChatMessage(role : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save chat messages");
    };
    let message : ChatMessage = {
      id = nextChatMessageId;
      role;
      content;
      timestamp = Time.now();
    };
    nextChatMessageId += 1;

    let currentHistory = switch (userChatHistory.get(caller)) {
      case (null) { List.empty<ChatMessage>() };
      case (?history) { history };
    };

    currentHistory.add(message);
    userChatHistory.add(caller, currentHistory);
  };

  public query ({ caller }) func getChatMessages(page : Nat, pageSize : Nat) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat messages");
    };
    switch (userChatHistory.get(caller)) {
      case (null) { [] };
      case (?history) {
        let sorted = history.toArray().sort(ChatMessage.compareByTimestampReversed);
        let start = page * pageSize;
        if (start >= sorted.size()) { return [] };
        let end = Int.min(start + pageSize, sorted.size());
        sorted.sliceToArray(start, end);
      };
    };
  };

  // ----- Module Management -----
  public shared ({ caller }) func activateModule(moduleName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can activate modules");
    };
    let currentModules = switch (userModules.get(caller)) {
      case (null) { Set.empty<Text>() };
      case (?modules) { modules };
    };

    currentModules.add(moduleName);
    userModules.add(caller, currentModules);
  };

  public shared ({ caller }) func deactivateModule(moduleName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deactivate modules");
    };
    switch (userModules.get(caller)) {
      case (null) { Runtime.trap("No modules found") };
      case (?modules) {
        modules.remove(moduleName);
        userModules.add(caller, modules);
      };
    };
  };

  public query ({ caller }) func getActiveModules() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access active modules");
    };
    switch (userModules.get(caller)) {
      case (null) { [] };
      case (?modules) { modules.toArray() };
    };
  };

  // ----- Improvement Log -----
  public shared ({ caller }) func addImprovementLog(entryType : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add improvement logs");
    };
    let log : ImprovementLog = {
      id = nextLogId;
      entryType;
      description;
      timestamp = Time.now();
    };
    nextLogId += 1;

    let currentLogs = switch (userImprovementLogs.get(caller)) {
      case (null) { List.empty<ImprovementLog>() };
      case (?logs) { logs };
    };

    currentLogs.add(log);
    userImprovementLogs.add(caller, currentLogs);
  };

  public query ({ caller }) func getImprovementLogs(page : Nat, pageSize : Nat) : async [ImprovementLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access improvement logs");
    };
    switch (userImprovementLogs.get(caller)) {
      case (null) { [] };
      case (?logs) {
        let sorted = logs.toArray().sort(ImprovementLog.compareByTimestampReversed);
        let start = page * pageSize;
        if (start >= sorted.size()) { return [] };
        let end = Int.min(start + pageSize, sorted.size());
        sorted.sliceToArray(start, end);
      };
    };
  };

  // ----- Excel Data Storage -----
  public shared ({ caller }) func saveExcelFile(filename : Text, rawData : [Nat8]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save Excel files");
    };
    let file : ExcelFile = {
      id = nextExcelFileId;
      filename;
      uploadTimestamp = Time.now();
      rawData;
      analysisResult = null;
    };
    nextExcelFileId += 1;

    let currentFiles = switch (userExcelFiles.get(caller)) {
      case (null) { List.empty<ExcelFile>() };
      case (?files) { files };
    };

    currentFiles.add(file);
    userExcelFiles.add(caller, currentFiles);
  };

  public shared ({ caller }) func saveExcelAnalysis(fileId : Nat, analysis : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save Excel analysis");
    };
    switch (userExcelFiles.get(caller)) {
      case (null) { Runtime.trap("No files found") };
      case (?files) {
        let updatedFiles = files.map<ExcelFile, ExcelFile>(
          func(file) {
            if (file.id == fileId) {
              return {
                id = file.id;
                filename = file.filename;
                uploadTimestamp = file.uploadTimestamp;
                rawData = file.rawData;
                analysisResult = ?analysis;
              };
            } else { file };
          }
        );
        userExcelFiles.add(caller, updatedFiles);
      };
    };
  };

  public query ({ caller }) func getExcelFiles() : async [ExcelFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access Excel files");
    };
    switch (userExcelFiles.get(caller)) {
      case (null) { [] };
      case (?files) { files.toArray() };
    };
  };

  // ----- Code Snippet Storage -----
  public shared ({ caller }) func saveCodeSnippet(language : Text, title : Text, codeContent : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save code snippets");
    };
    let snippet : CodeSnippet = {
      id = nextSnippetId;
      language;
      title;
      codeContent;
      timestamp = Time.now();
    };
    nextSnippetId += 1;

    let currentSnippets = switch (userCodeSnippets.get(caller)) {
      case (null) { List.empty<CodeSnippet>() };
      case (?snippets) { snippets };
    };

    currentSnippets.add(snippet);
    userCodeSnippets.add(caller, currentSnippets);
  };

  public query ({ caller }) func getCodeSnippets() : async [CodeSnippet] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access code snippets");
    };
    switch (userCodeSnippets.get(caller)) {
      case (null) { [] };
      case (?snippets) { snippets.toArray() };
    };
  };

  // ----- Website Template Storage -----
  public shared ({ caller }) func saveWebsite(templateName : Text, htmlContent : Text, cssContent : Text, jsContent : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save websites");
    };
    let website : Website = {
      id = nextWebsiteId;
      templateName;
      htmlContent;
      cssContent;
      jsContent;
      timestamp = Time.now();
    };
    nextWebsiteId += 1;

    let currentWebsites = switch (userWebsites.get(caller)) {
      case (null) { List.empty<Website>() };
      case (?websites) { websites };
    };

    currentWebsites.add(website);
    userWebsites.add(caller, currentWebsites);
  };

  public query ({ caller }) func getWebsites() : async [Website] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access websites");
    };
    switch (userWebsites.get(caller)) {
      case (null) { [] };
      case (?websites) { websites.toArray() };
    };
  };
};
