import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // Old type definitions
  type OldPersonalitySettings = {
    communicationStyle : Text;
  };

  type OldMemory = {
    id : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  type OldCommand = {
    id : Nat;
    name : Text;
    actionDescription : Text;
    timestamp : Time.Time;
  };

  type OldBehaviorRule = {
    id : Nat;
    ruleText : Text;
    timestamp : Time.Time;
  };

  type OldChatMessage = {
    id : Nat;
    role : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type OldImprovementLog = {
    id : Nat;
    entryType : Text;
    description : Text;
    timestamp : Time.Time;
  };

  type OldExcelFile = {
    id : Nat;
    filename : Text;
    uploadTimestamp : Time.Time;
    rawData : [Nat8];
    analysisResult : ?Text;
  };

  type OldCodeSnippet = {
    id : Nat;
    language : Text;
    title : Text;
    codeContent : Text;
    timestamp : Time.Time;
  };

  type OldWebsite = {
    id : Nat;
    templateName : Text;
    htmlContent : Text;
    cssContent : Text;
    jsContent : Text;
    timestamp : Time.Time;
  };

  type OldUserProfile = {
    name : Text;
    preferences : Text;
    personalitySettings : OldPersonalitySettings;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    userMemories : Map.Map<Principal, List.List<OldMemory>>;
    userCommands : Map.Map<Principal, List.List<OldCommand>>;
    userRules : Map.Map<Principal, List.List<OldBehaviorRule>>;
    userChatHistory : Map.Map<Principal, List.List<OldChatMessage>>;
    userModules : Map.Map<Principal, Set.Set<Text>>;
    userImprovementLogs : Map.Map<Principal, List.List<OldImprovementLog>>;
    userExcelFiles : Map.Map<Principal, List.List<OldExcelFile>>;
    userCodeSnippets : Map.Map<Principal, List.List<OldCodeSnippet>>;
    userWebsites : Map.Map<Principal, List.List<OldWebsite>>;
    nextMemoryId : Nat;
    nextCommandId : Nat;
    nextRuleId : Nat;
    nextChatMessageId : Nat;
    nextLogId : Nat;
    nextExcelFileId : Nat;
    nextSnippetId : Nat;
    nextWebsiteId : Nat;
  };

  // New type definitions
  type NewPersonalitySettings = {
    communicationStyle : Text;
  };

  type NewMemory = {
    id : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  type NewCommand = {
    id : Nat;
    name : Text;
    actionDescription : Text;
    timestamp : Time.Time;
  };

  type NewBehaviorRule = {
    id : Nat;
    ruleText : Text;
    priority : Nat;
    timestamp : Time.Time;
  };

  type NewChatMessage = {
    id : Nat;
    role : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type NewImprovementLog = {
    id : Nat;
    entryType : Text;
    description : Text;
    timestamp : Time.Time;
  };

  type NewExcelFile = {
    id : Nat;
    filename : Text;
    uploadTimestamp : Time.Time;
    rawData : [Nat8];
    analysisResult : ?Text;
  };

  type NewCodeSnippet = {
    id : Nat;
    language : Text;
    title : Text;
    codeContent : Text;
    timestamp : Time.Time;
  };

  type NewWebsite = {
    id : Nat;
    templateName : Text;
    htmlContent : Text;
    cssContent : Text;
    jsContent : Text;
    timestamp : Time.Time;
  };

  type NewUserProfile = {
    name : Text;
    preferences : Text;
    personalitySettings : NewPersonalitySettings;
    onboardingComplete : Bool;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    userMemories : Map.Map<Principal, List.List<NewMemory>>;
    userCommands : Map.Map<Principal, List.List<NewCommand>>;
    userRules : Map.Map<Principal, List.List<NewBehaviorRule>>;
    userChatHistory : Map.Map<Principal, List.List<NewChatMessage>>;
    userModules : Map.Map<Principal, Set.Set<Text>>;
    userImprovementLogs : Map.Map<Principal, List.List<NewImprovementLog>>;
    userExcelFiles : Map.Map<Principal, List.List<NewExcelFile>>;
    userCodeSnippets : Map.Map<Principal, List.List<NewCodeSnippet>>;
    userWebsites : Map.Map<Principal, List.List<NewWebsite>>;
    nextMemoryId : Nat;
    nextCommandId : Nat;
    nextRuleId : Nat;
    nextChatMessageId : Nat;
    nextLogId : Nat;
    nextExcelFileId : Nat;
    nextSnippetId : Nat;
    nextWebsiteId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          name = oldProfile.name;
          preferences = oldProfile.preferences;
          personalitySettings = {
            communicationStyle = oldProfile.personalitySettings.communicationStyle;
          };
          onboardingComplete = false; // Default to false for new field
        };
      }
    );

    let newUserRules = old.userRules.map<Principal, List.List<OldBehaviorRule>, List.List<NewBehaviorRule>>(
      func(_principal, oldRules) {
        oldRules.map<OldBehaviorRule, NewBehaviorRule>(
          func(oldRule) {
            {
              id = oldRule.id;
              ruleText = oldRule.ruleText;
              priority = 0; // Default priority for old rules
              timestamp = oldRule.timestamp;
            };
          }
        );
      }
    );

    {
      old with
      userProfiles = newUserProfiles;
      userRules = newUserRules;
    };
  };
};
