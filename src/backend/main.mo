import Map "mo:core/Map";
import Set "mo:core/Set";
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

  // ----- Chat Message Module -----
  module ChatMessage {
    public func compareByTimestampReversed(msg1 : { timestamp : Int }, msg2 : { timestamp : Int }) : Order.Order {
      Int.compare(msg2.timestamp, msg1.timestamp);
    };
  };

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

  // ----- Storage -----
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userMemories = Map.empty<Principal, List.List<MemoryNode>>();
  var nextMemoryId : Nat = 1;
  let userPlans = Map.empty<Principal, List.List<Plan>>();
  let userThreads = Map.empty<Principal, List.List<ChatThread>>();
  let userThreadMessages = Map.empty<Principal, List.List<ThreadMessage>>();
  var nextThreadId : Nat = 1;
  var nextMessageId : Nat = 1;

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
    currentPlans.add(newPlan);
    userPlans.add(caller, currentPlans);
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
};
