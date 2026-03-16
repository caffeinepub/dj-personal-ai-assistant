import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
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

  // ----- Plans Module -----
  public type Plan = {
    id : Text;
    goal : Text;
    stepsJson : Text;
    createdAt : Int;
    status : Text;
  };

  // ----- Storage -----
  let userPlans = Map.empty<Principal, List.List<Plan>>();

  // ----- Authorization -----
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

