import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

import MixinStorage "blob-storage/Mixin";


actor {
  // ----- Storage Functionality -----
  include MixinStorage();

  // ----- Improvement Log Module -----
  module ImprovementLog {
    public func compareByTimestampReversed(log1 : { timestamp : Int }, log2 : { timestamp : Int }) : Order.Order {
      Int.compare(log2.timestamp, log1.timestamp);
    };
  };

  // ----- Behavior Rule Module -----
  module BehaviorRule {
    public func compareByPriority(rule1 : { priority : Nat }, rule2 : { priority : Nat }) : Order.Order {
      Nat.compare(rule1.priority, rule2.priority);
    };
  };

  // ----- User Profile Types -----
  public type UserProfile = {
    name : Text;
    preferences : Text;
    personalitySettings : Text;
    onboardingComplete : Bool;
  };

  // ----- Memory Node Types -----
  public type MemoryNode = {
    id : Nat;
    content : Text;
    timestamp : Int;
  };

  // ----- Plans Module -----
  public type Plan = {
    id : Text;
    goal : Text;
    stepsJson : Text;
    createdAt : Int;
    status : Text;
  };

  // ----- Chat Thread Types -----
  public type ChatThread = {
    id : Nat;
    name : Text;
    moduleTag : ?Text;
    createdAt : Int;
  };

  public type ThreadMessage = {
    id : Nat;
    threadId : Nat;
    role : Text;
    content : Text;
    timestamp : Int;
  };

  // ----- Task Types -----
  public type Task = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : ?Int;
    priority : Text;
    completed : Bool;
    createdAt : Int;
  };

  // ----- Note Types -----
  public type Note = {
    id : Nat;
    title : Text;
    content : Text;
    tags : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // ----- Finance Types -----
  public type FinanceEntry = {
    id : Nat;
    entryType : Text;
    amount : Nat;
    category : Text;
    description : Text;
    date : Int;
    createdAt : Int;
  };

  // ----- Knowledge Folder Types -----
  public type KnowledgeFolder = {
    id : Nat;
    name : Text;
    parentId : ?Nat;
    createdAt : Int;
  };

  public type WikiPage = {
    folderId : Nat;
    content : Text;
    updatedAt : Int;
  };

  // ----- Command Types -----
  public type Command = {
    id : Nat;
    trigger : Text;
    action : Text;
    description : Text;
    createdAt : Int;
  };

  // ----- Behavior Rule Types -----
  public type StoredBehaviorRule = {
    id : Nat;
    rule : Text;
    priority : Nat;
    enabled : Bool;
    createdAt : Int;
  };

  // ----- Module Status Types -----
  public type ModuleStatus = {
    moduleId : Text;
    active : Bool;
  };

  // ----- Legacy Chat Message Types -----
  public type LegacyChatMessage = {
    id : Nat;
    role : Text;
    content : Text;
    timestamp : Int;
  };

  // ----- Improvement Log Types -----
  public type ImprovementLogEntry = {
    id : Nat;
    message : Text;
    category : Text;
    timestamp : Int;
  };

  // ----- Excel File Types -----
  public type ExcelFile = {
    id : Nat;
    name : Text;
    dataJson : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type ExcelAnalysis = {
    fileId : Nat;
    analysisJson : Text;
    createdAt : Int;
  };

  // ----- Website Types -----
  public type Website = {
    id : Nat;
    url : Text;
    title : Text;
    contentJson : Text;
    savedAt : Int;
  };

  // ----- Storage -----
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userMemories = Map.empty<Principal, List.List<MemoryNode>>();
  var nextMemoryId : Nat = 1;
  let userPlans = Map.empty<Principal, List.List<Plan>>();
  let userThreads = Map.empty<Principal, List.List<ChatThread>>();
  let userThreadMessages = Map.empty<Principal, List.List<ThreadMessage>>();
  var nextThreadId : Nat = 1;
  var nextMessageId : Nat = 1;

  // New module storage
  let userTasks = Map.empty<Principal, List.List<Task>>();
  var nextTaskId : Nat = 1;

  let userNotes = Map.empty<Principal, List.List<Note>>();
  var nextNoteId : Nat = 1;

  let userFinanceEntries = Map.empty<Principal, List.List<FinanceEntry>>();
  var nextFinanceId : Nat = 1;

  let userFolders = Map.empty<Principal, List.List<KnowledgeFolder>>();
  var nextFolderId : Nat = 1;
  let userWikiPages = Map.empty<Principal, List.List<WikiPage>>();

  let userCommands = Map.empty<Principal, List.List<Command>>();
  var nextCommandId : Nat = 1;

  let userBehaviorRules = Map.empty<Principal, List.List<StoredBehaviorRule>>();
  var nextRuleId : Nat = 1;

  let userModuleStatuses = Map.empty<Principal, List.List<ModuleStatus>>();

  let userLegacyMessages = Map.empty<Principal, List.List<LegacyChatMessage>>();
  var nextLegacyMsgId : Nat = 1;

  let userImprovementLogs = Map.empty<Principal, List.List<ImprovementLogEntry>>();

  let userExcelFiles = Map.empty<Principal, List.List<ExcelFile>>();
  var nextExcelFileId : Nat = 1;
  let userExcelAnalyses = Map.empty<Principal, List.List<ExcelAnalysis>>();

  let userWebsites = Map.empty<Principal, List.List<Website>>();
  var nextWebsiteId : Nat = 1;

  // ----- Authorization -----
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ----- User Profile Management -----
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func createUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ----- saveOnboardingComplete -----
  public shared ({ caller }) func saveOnboardingComplete() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update onboarding status");
    };
    let current = switch (userProfiles.get(caller)) {
      case (null) {
        {
          name = "";
          preferences = "";
          personalitySettings = "";
          onboardingComplete = true;
        };
      };
      case (?p) {
        {
          name = p.name;
          preferences = p.preferences;
          personalitySettings = p.personalitySettings;
          onboardingComplete = true;
        };
      };
    };
    userProfiles.add(caller, current);
  };

  // ----- Memory Node Management -----
  public shared ({ caller }) func addMemory(content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add memories");
    };
    let id = nextMemoryId;
    nextMemoryId += 1;
    let memory : MemoryNode = {
      id;
      content;
      timestamp = Time.now();
    };
    let current = switch (userMemories.get(caller)) {
      case (null) { List.empty<MemoryNode>() };
      case (?m) { m };
    };
    current.add(memory);
    userMemories.add(caller, current);
    id;
  };

  public shared ({ caller }) func deleteMemory(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete memories");
    };
    switch (userMemories.get(caller)) {
      case (null) { false };
      case (?memories) {
        let filtered = memories.filter(func(m) { m.id != id });
        userMemories.add(caller, filtered);
        true;
      };
    };
  };

  public query ({ caller }) func getMemories() : async [MemoryNode] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get memories");
    };
    switch (userMemories.get(caller)) {
      case (null) { [] };
      case (?memories) { memories.toArray() };
    };
  };

  // ----- Chat Thread Management -----
  public shared ({ caller }) func createChatThread(name : Text, moduleTag : ?Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create chat threads");
    };
    let id = nextThreadId;
    nextThreadId += 1;
    let thread : ChatThread = {
      id;
      name;
      moduleTag;
      createdAt = Time.now();
    };
    let current = switch (userThreads.get(caller)) {
      case (null) { List.empty<ChatThread>() };
      case (?t) { t };
    };
    current.add(thread);
    userThreads.add(caller, current);
    id;
  };

  public query ({ caller }) func getChatThreads() : async [ChatThread] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get chat threads");
    };
    switch (userThreads.get(caller)) {
      case (null) { [] };
      case (?threads) { threads.toArray() };
    };
  };

  public shared ({ caller }) func deleteChatThread(threadId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete chat threads");
    };
    switch (userThreads.get(caller)) {
      case (null) { false };
      case (?threads) {
        let filtered = threads.filter(func(t) { t.id != threadId });
        userThreads.add(caller, filtered);
        // Also delete messages for this thread
        switch (userThreadMessages.get(caller)) {
          case (null) {};
          case (?msgs) {
            let filteredMsgs = msgs.filter(func(m) { m.threadId != threadId });
            userThreadMessages.add(caller, filteredMsgs);
          };
        };
        true;
      };
    };
  };

  public shared ({ caller }) func saveThreadMessage(threadId : Nat, role : Text, content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save thread messages");
    };
    let id = nextMessageId;
    nextMessageId += 1;
    let msg : ThreadMessage = {
      id;
      threadId;
      role;
      content;
      timestamp = Time.now();
    };
    let current = switch (userThreadMessages.get(caller)) {
      case (null) { List.empty<ThreadMessage>() };
      case (?m) { m };
    };
    current.add(msg);
    userThreadMessages.add(caller, current);
    id;
  };

  public query ({ caller }) func getThreadMessages(threadId : Nat, offset : Nat, limit : Nat) : async [ThreadMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get thread messages");
    };
    switch (userThreadMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) {
        let forThread = msgs.filter(func(m) { m.threadId == threadId }).toArray();
        let start = if (offset >= forThread.size()) { forThread.size() } else { offset };
        let end_ = if (start + limit > forThread.size()) { forThread.size() } else { start + limit };
        Array.tabulate<ThreadMessage>(end_ - start, func(i) { forThread[start + i] });
      };
    };
  };

  public shared ({ caller }) func deleteThreadMessage(threadId : Nat, messageId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete thread messages");
    };
    switch (userThreadMessages.get(caller)) {
      case (null) { false };
      case (?msgs) {
        let filtered = msgs.filter(func(m) { not (m.threadId == threadId and m.id == messageId) });
        userThreadMessages.add(caller, filtered);
        true;
      };
    };
  };

  // ----- Plan Management -----
  public shared ({ caller }) func savePlan(id : Text, goal : Text, stepsJson : Text, status : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save plans");
    };
    let newPlan : Plan = {
      id;
      goal;
      stepsJson;
      createdAt = Time.now();
      status;
    };
    let currentPlans = switch (userPlans.get(caller)) {
      case (null) { List.empty<Plan>() };
      case (?plans) { plans };
    };
    // FIX 3: Upsert — update existing plan if id matches, otherwise insert.
    let existing = currentPlans.filter(func(p) { p.id == id });
    if (existing.size() > 0) {
      let updated = currentPlans.map<Plan, Plan>(func(p) {
        if (p.id == id) {
          {
            id;
            goal;
            stepsJson;
            createdAt = p.createdAt;
            status;
          };
        } else { p };
      });
      userPlans.add(caller, updated);
    } else {
      currentPlans.add(newPlan);
      userPlans.add(caller, currentPlans);
    };
    true;
  };

  public query ({ caller }) func getPlans() : async [Plan] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get plans");
    };
    switch (userPlans.get(caller)) {
      case (null) { [] };
      case (?plans) { plans.toArray() };
    };
  };

  public query ({ caller }) func getPlanById(id : Text) : async ?Plan {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get plans");
    };
    switch (userPlans.get(caller)) {
      case (null) { null };
      case (?plans) {
        plans.toArray().find(func(p) { p.id == id });
      };
    };
  };

  public shared ({ caller }) func updatePlan(id : Text, goal : Text, stepsJson : Text, status : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update plans");
    };
    switch (userPlans.get(caller)) {
      case (null) { false };
      case (?plans) {
        let updatedPlans = plans.map<Plan, Plan>(
          func(plan) {
            if (plan.id == id) {
              {
                id;
                goal;
                stepsJson;
                createdAt = plan.createdAt;
                status;
              };
            } else { plan };
          }
        );
        userPlans.add(caller, updatedPlans);
        true;
      };
    };
  };

  public shared ({ caller }) func deletePlan(id : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete plans");
    };
    switch (userPlans.get(caller)) {
      case (null) { false };
      case (?plans) {
        let filteredPlans = plans.filter(func(p) { p.id != id });
        userPlans.add(caller, filteredPlans);
        true;
      };
    };
  };

  // ----- Task Management -----
  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get tasks");
    };
    switch (userTasks.get(caller)) {
      case (null) { [] };
      case (?tasks) { tasks.toArray() };
    };
  };

  public shared ({ caller }) func addTask(title : Text, description : Text, dueDate : ?Int, priority : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add tasks");
    };
    let id = nextTaskId;
    nextTaskId += 1;
    let task : Task = {
      id;
      title;
      description;
      dueDate;
      priority;
      completed = false;
      createdAt = Time.now();
    };
    let current = switch (userTasks.get(caller)) {
      case (null) { List.empty<Task>() };
      case (?t) { t };
    };
    current.add(task);
    userTasks.add(caller, current);
    id;
  };

  public shared ({ caller }) func updateTaskCompletion(id : Nat, completed : Bool) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };
    switch (userTasks.get(caller)) {
      case (null) { false };
      case (?tasks) {
        let updated = tasks.map<Task, Task>(func(t) {
          if (t.id == id) {
            { id = t.id; title = t.title; description = t.description; dueDate = t.dueDate; priority = t.priority; completed; createdAt = t.createdAt };
          } else { t };
        });
        userTasks.add(caller, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };
    switch (userTasks.get(caller)) {
      case (null) { false };
      case (?tasks) {
        let filtered = tasks.filter(func(t) { t.id != id });
        userTasks.add(caller, filtered);
        true;
      };
    };
  };

  // ----- Note Management -----
  public query ({ caller }) func getAllNotes() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get notes");
    };
    switch (userNotes.get(caller)) {
      case (null) { [] };
      case (?notes) { notes.toArray() };
    };
  };

  public shared ({ caller }) func addNote(title : Text, content : Text, tags : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add notes");
    };
    let id = nextNoteId;
    nextNoteId += 1;
    let now = Time.now();
    let note : Note = {
      id;
      title;
      content;
      tags;
      createdAt = now;
      updatedAt = now;
    };
    let current = switch (userNotes.get(caller)) {
      case (null) { List.empty<Note>() };
      case (?n) { n };
    };
    current.add(note);
    userNotes.add(caller, current);
    id;
  };

  public shared ({ caller }) func updateNote(id : Nat, title : Text, content : Text, tags : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update notes");
    };
    switch (userNotes.get(caller)) {
      case (null) { false };
      case (?notes) {
        let updated = notes.map<Note, Note>(func(n) {
          if (n.id == id) {
            { id = n.id; title; content; tags; createdAt = n.createdAt; updatedAt = Time.now() };
          } else { n };
        });
        userNotes.add(caller, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteNote(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };
    switch (userNotes.get(caller)) {
      case (null) { false };
      case (?notes) {
        let filtered = notes.filter(func(n) { n.id != id });
        userNotes.add(caller, filtered);
        true;
      };
    };
  };

  // ----- Finance Entry Management -----
  public query ({ caller }) func getAllFinanceEntries() : async [FinanceEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get finance entries");
    };
    switch (userFinanceEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public shared ({ caller }) func addFinanceEntry(entryType : Text, amount : Nat, category : Text, description : Text, date : Int) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add finance entries");
    };
    let id = nextFinanceId;
    nextFinanceId += 1;
    let entry : FinanceEntry = {
      id;
      entryType;
      amount;
      category;
      description;
      date;
      createdAt = Time.now();
    };
    let current = switch (userFinanceEntries.get(caller)) {
      case (null) { List.empty<FinanceEntry>() };
      case (?e) { e };
    };
    current.add(entry);
    userFinanceEntries.add(caller, current);
    id;
  };

  public shared ({ caller }) func deleteFinanceEntry(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete finance entries");
    };
    switch (userFinanceEntries.get(caller)) {
      case (null) { false };
      case (?entries) {
        let filtered = entries.filter(func(e) { e.id != id });
        userFinanceEntries.add(caller, filtered);
        true;
      };
    };
  };

  // ----- Knowledge Folder Management -----
  public query ({ caller }) func getFolders() : async [KnowledgeFolder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get folders");
    };
    switch (userFolders.get(caller)) {
      case (null) { [] };
      case (?folders) { folders.toArray() };
    };
  };

  public shared ({ caller }) func createFolder(name : Text, parentId : ?Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create folders");
    };
    let id = nextFolderId;
    nextFolderId += 1;
    let folder : KnowledgeFolder = {
      id;
      name;
      parentId;
      createdAt = Time.now();
    };
    let current = switch (userFolders.get(caller)) {
      case (null) { List.empty<KnowledgeFolder>() };
      case (?f) { f };
    };
    current.add(folder);
    userFolders.add(caller, current);
    id;
  };

  public shared ({ caller }) func deleteFolder(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete folders");
    };
    switch (userFolders.get(caller)) {
      case (null) { false };
      case (?folders) {
        let filtered = folders.filter(func(f) { f.id != id });
        userFolders.add(caller, filtered);
        // Remove wiki page for this folder too
        switch (userWikiPages.get(caller)) {
          case (null) {};
          case (?pages) {
            let filteredPages = pages.filter(func(p) { p.folderId != id });
            userWikiPages.add(caller, filteredPages);
          };
        };
        true;
      };
    };
  };

  public query ({ caller }) func getWikiPageByFolder(folderId : Nat) : async ?WikiPage {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get wiki pages");
    };
    switch (userWikiPages.get(caller)) {
      case (null) { null };
      case (?pages) {
        pages.toArray().find(func(p) { p.folderId == folderId });
      };
    };
  };

  public shared ({ caller }) func saveWikiPage(folderId : Nat, content : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save wiki pages");
    };
    let page : WikiPage = {
      folderId;
      content;
      updatedAt = Time.now();
    };
    let current = switch (userWikiPages.get(caller)) {
      case (null) { List.empty<WikiPage>() };
      case (?pages) { pages };
    };
    // Remove existing wiki page for this folder then add updated one
    let filtered = current.filter(func(p) { p.folderId != folderId });
    filtered.add(page);
    userWikiPages.add(caller, filtered);
    true;
  };

  // ----- Command Management -----
  public query ({ caller }) func getAllCommands() : async [Command] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get commands");
    };
    switch (userCommands.get(caller)) {
      case (null) { [] };
      case (?cmds) { cmds.toArray() };
    };
  };

  public shared ({ caller }) func createCommand(trigger : Text, action : Text, description : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create commands");
    };
    let id = nextCommandId;
    nextCommandId += 1;
    let cmd : Command = {
      id;
      trigger;
      action;
      description;
      createdAt = Time.now();
    };
    let current = switch (userCommands.get(caller)) {
      case (null) { List.empty<Command>() };
      case (?c) { c };
    };
    current.add(cmd);
    userCommands.add(caller, current);
    id;
  };

  public shared ({ caller }) func deleteCommand(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete commands");
    };
    switch (userCommands.get(caller)) {
      case (null) { false };
      case (?cmds) {
        let filtered = cmds.filter(func(c) { c.id != id });
        userCommands.add(caller, filtered);
        true;
      };
    };
  };

  // ----- Behavior Rule Management -----
  public query ({ caller }) func getAllRules() : async [StoredBehaviorRule] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get rules");
    };
    switch (userBehaviorRules.get(caller)) {
      case (null) { [] };
      case (?rules) { rules.toArray() };
    };
  };

  public query ({ caller }) func getAllRulesOrdered() : async [StoredBehaviorRule] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get rules");
    };
    switch (userBehaviorRules.get(caller)) {
      case (null) { [] };
      case (?rules) {
        let arr = rules.toArray();
        arr.sort(BehaviorRule.compareByPriority);
      };
    };
  };

  public shared ({ caller }) func setBehaviorRule(rule : Text, priority : Nat, enabled : Bool) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can set rules");
    };
    let id = nextRuleId;
    nextRuleId += 1;
    let newRule : StoredBehaviorRule = {
      id;
      rule;
      priority;
      enabled;
      createdAt = Time.now();
    };
    let current = switch (userBehaviorRules.get(caller)) {
      case (null) { List.empty<StoredBehaviorRule>() };
      case (?r) { r };
    };
    current.add(newRule);
    userBehaviorRules.add(caller, current);
    id;
  };

  public shared ({ caller }) func updateRulePriority(id : Nat, priority : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update rules");
    };
    switch (userBehaviorRules.get(caller)) {
      case (null) { false };
      case (?rules) {
        let updated = rules.map<StoredBehaviorRule, StoredBehaviorRule>(func(r) {
          if (r.id == id) {
            { id = r.id; rule = r.rule; priority; enabled = r.enabled; createdAt = r.createdAt };
          } else { r };
        });
        userBehaviorRules.add(caller, updated);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteRule(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete rules");
    };
    switch (userBehaviorRules.get(caller)) {
      case (null) { false };
      case (?rules) {
        let filtered = rules.filter(func(r) { r.id != id });
        userBehaviorRules.add(caller, filtered);
        true;
      };
    };
  };

  // ----- Module Status Management -----
  public query ({ caller }) func getActiveModules() : async [ModuleStatus] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get modules");
    };
    switch (userModuleStatuses.get(caller)) {
      case (null) { [] };
      case (?statuses) { statuses.toArray() };
    };
  };

  public shared ({ caller }) func activateModule(moduleId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can activate modules");
    };
    let current = switch (userModuleStatuses.get(caller)) {
      case (null) { List.empty<ModuleStatus>() };
      case (?s) { s };
    };
    // Remove existing entry for this moduleId, then add active entry
    let filtered = current.filter(func(s) { s.moduleId != moduleId });
    filtered.add({ moduleId; active = true });
    userModuleStatuses.add(caller, filtered);
    true;
  };

  public shared ({ caller }) func deactivateModule(moduleId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can deactivate modules");
    };
    let current = switch (userModuleStatuses.get(caller)) {
      case (null) { List.empty<ModuleStatus>() };
      case (?s) { s };
    };
    let filtered = current.filter(func(s) { s.moduleId != moduleId });
    filtered.add({ moduleId; active = false });
    userModuleStatuses.add(caller, filtered);
    true;
  };

  // ----- Legacy Chat Messages -----
  public query ({ caller }) func getChatMessages(offset : Nat, limit : Nat) : async [LegacyChatMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get chat messages");
    };
    switch (userLegacyMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) {
        let arr = msgs.toArray();
        let start = if (offset >= arr.size()) { arr.size() } else { offset };
        let end_ = if (start + limit > arr.size()) { arr.size() } else { start + limit };
        Array.tabulate<LegacyChatMessage>(end_ - start, func(i) { arr[start + i] });
      };
    };
  };

  public shared ({ caller }) func saveChatMessage(role : Text, content : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save chat messages");
    };
    let id = nextLegacyMsgId;
    nextLegacyMsgId += 1;
    let msg : LegacyChatMessage = {
      id;
      role;
      content;
      timestamp = Time.now();
    };
    let current = switch (userLegacyMessages.get(caller)) {
      case (null) { List.empty<LegacyChatMessage>() };
      case (?m) { m };
    };
    current.add(msg);
    userLegacyMessages.add(caller, current);
    id;
  };

  // ----- Improvement Logs -----
  public query ({ caller }) func getImprovementLogs() : async [ImprovementLogEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get improvement logs");
    };
    switch (userImprovementLogs.get(caller)) {
      case (null) { [] };
      case (?logs) {
        let arr = logs.toArray();
        arr.sort(ImprovementLog.compareByTimestampReversed);
      };
    };
  };

  // ----- Excel File Management -----
  public query ({ caller }) func getExcelFiles() : async [ExcelFile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get Excel files");
    };
    switch (userExcelFiles.get(caller)) {
      case (null) { [] };
      case (?files) { files.toArray() };
    };
  };

  public shared ({ caller }) func saveExcelFile(name : Text, dataJson : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save Excel files");
    };
    let id = nextExcelFileId;
    nextExcelFileId += 1;
    let now = Time.now();
    let file : ExcelFile = {
      id;
      name;
      dataJson;
      createdAt = now;
      updatedAt = now;
    };
    let current = switch (userExcelFiles.get(caller)) {
      case (null) { List.empty<ExcelFile>() };
      case (?f) { f };
    };
    current.add(file);
    userExcelFiles.add(caller, current);
    id;
  };

  public shared ({ caller }) func saveExcelAnalysis(fileId : Nat, analysisJson : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save Excel analyses");
    };
    let analysis : ExcelAnalysis = {
      fileId;
      analysisJson;
      createdAt = Time.now();
    };
    let current = switch (userExcelAnalyses.get(caller)) {
      case (null) { List.empty<ExcelAnalysis>() };
      case (?a) { a };
    };
    // Replace existing analysis for this fileId
    let filtered = current.filter(func(a) { a.fileId != fileId });
    filtered.add(analysis);
    userExcelAnalyses.add(caller, filtered);
    true;
  };

  // ----- Website Management -----
  public query ({ caller }) func getWebsites() : async [Website] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get websites");
    };
    switch (userWebsites.get(caller)) {
      case (null) { [] };
      case (?sites) { sites.toArray() };
    };
  };

  public shared ({ caller }) func saveWebsite(url : Text, title : Text, contentJson : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save websites");
    };
    let id = nextWebsiteId;
    nextWebsiteId += 1;
    let site : Website = {
      id;
      url;
      title;
      contentJson;
      savedAt = Time.now();
    };
    let current = switch (userWebsites.get(caller)) {
      case (null) { List.empty<Website>() };
      case (?s) { s };
    };
    current.add(site);
    userWebsites.add(caller, current);
    id;
  };
};
