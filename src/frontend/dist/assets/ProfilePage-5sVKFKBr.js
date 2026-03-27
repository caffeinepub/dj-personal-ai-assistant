import { b as useMemories, c as useCustomCommands, e as useBehaviorRules, d as useImprovementLogs, w as useAddMemory, x as useDeleteMemory, y as useCreateCustomCommand, Z as useDeleteCommand, z as useSetBehaviorRule, _ as useDeleteBehaviorRule, r as reactExports, j as jsxRuntimeExports, k as ue, u as useUserProfile, v as usePersonalitySettings, $ as useUpdateUserProfile, A as useSetPersonalitySettings, L as Link } from "./index-D4lUgCCM.js";
import { A as AlertDialog, h as AlertDialogTrigger, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D6TXgbbC.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-iyETJf1A.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { L as Layout, S as Settings, U as User, B as Brain } from "./Layout-y-fTRwTO.js";
import { S as ScrollArea } from "./scroll-area-D1D6khfo.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-eotKpg0e.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import { G as GraduationCap } from "./proxy-CDDWEtkX.js";
import "./index-DREpW-Gk.js";
import "./index-IXOTxK3N.js";
import "./index-Cj4N10C2.js";
import "./chevron-up-QZ-Q9T3F.js";
import "./check-CyKGSNZc.js";
function SelfImprovementPanel() {
  const { data: allMemories = [] } = useMemories();
  const memories = allMemories.filter(
    (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]")
  );
  const { data: commands = [] } = useCustomCommands();
  const { data: rules = [] } = useBehaviorRules();
  const { data: logs = [] } = useImprovementLogs();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();
  const createCommand = useCreateCustomCommand();
  const deleteCommand = useDeleteCommand();
  const setRule = useSetBehaviorRule();
  const deleteRule = useDeleteBehaviorRule();
  const [memoryInput, setMemoryInput] = reactExports.useState("");
  const [commandName, setCommandName] = reactExports.useState("");
  const [commandAction, setCommandAction] = reactExports.useState("");
  const [ruleInput, setRuleInput] = reactExports.useState("");
  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) / 1e6);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleAddMemory = async () => {
    if (!memoryInput.trim()) {
      ue.error("Please enter a memory");
      return;
    }
    try {
      await addMemory.mutateAsync(memoryInput.trim());
      setMemoryInput("");
      ue.success("Memory added successfully");
    } catch (_error) {
      ue.error("Failed to add memory");
    }
  };
  const handleDeleteMemory = async (id) => {
    try {
      await deleteMemory.mutateAsync(id);
      ue.success("Memory deleted");
    } catch (_error) {
      ue.error("Failed to delete memory");
    }
  };
  const handleCreateCommand = async () => {
    if (!commandName.trim() || !commandAction.trim()) {
      ue.error("Please enter command name and action");
      return;
    }
    try {
      await createCommand.mutateAsync({
        name: commandName.trim(),
        action: commandAction.trim()
      });
      setCommandName("");
      setCommandAction("");
      ue.success("Command created successfully");
    } catch (_error) {
      ue.error("Failed to create command");
    }
  };
  const handleDeleteCommand = async (id) => {
    try {
      await deleteCommand.mutateAsync(id);
      ue.success("Command deleted");
    } catch (_error) {
      ue.error("Failed to delete command");
    }
  };
  const handleSetRule = async () => {
    if (!ruleInput.trim()) {
      ue.error("Please enter a rule");
      return;
    }
    try {
      await setRule.mutateAsync({
        ruleText: ruleInput.trim(),
        priority: BigInt(rules.length + 1)
      });
      setRuleInput("");
      ue.success("Rule set successfully");
    } catch (_error) {
      ue.error("Failed to set rule");
    }
  };
  const handleDeleteRule = async (id) => {
    try {
      await deleteRule.mutateAsync(id);
      ue.success("Rule deleted");
    } catch (_error) {
      ue.error("Failed to delete rule");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-2xl", children: "Self-Improvement Engine" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Train DJ by adding memories, commands, and behavior rules" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "memories", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "memories", children: "Memories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "commands", children: "Commands" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "rules", children: "Rules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "logs", children: "Log" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "memories", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Add a new memory...",
              value: memoryInput,
              onChange: (e) => setMemoryInput(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleAddMemory()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleAddMemory,
              disabled: addMemory.isPending,
              className: "bg-primary",
              children: addMemory.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: memories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No memories stored yet" }) : memories.map((memory) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: memory.content }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: formatTimestamp(memory.timestamp) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "text-destructive hover:bg-destructive/10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Memory" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this memory? This action cannot be undone." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: () => handleDeleteMemory(memory.id),
                    className: "bg-destructive",
                    children: "Delete"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }, memory.id.toString())) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "commands", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Command name...",
              value: commandName,
              onChange: (e) => setCommandName(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Action description...",
              value: commandAction,
              onChange: (e) => setCommandAction(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleCreateCommand()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleCreateCommand,
              disabled: createCommand.isPending,
              className: "w-full bg-primary",
              children: createCommand.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Creating..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Create Command"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[350px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: commands.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No commands created yet" }) : commands.map((command) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: command.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(command.timestamp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: command.actionDescription })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "text-destructive hover:bg-destructive/10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Command" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this command?" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: () => handleDeleteCommand(command.id),
                    className: "bg-destructive",
                    children: "Delete"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }, command.id.toString())) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "rules", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Add a behavior rule...",
              value: ruleInput,
              onChange: (e) => setRuleInput(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSetRule()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSetRule,
              disabled: setRule.isPending,
              className: "bg-primary",
              children: setRule.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No behavior rules set yet" }) : rules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: rule.ruleText }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: formatTimestamp(rule.timestamp) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "text-destructive hover:bg-destructive/10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Rule" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Are you sure you want to delete this rule?" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: () => handleDeleteRule(rule.id),
                    className: "bg-destructive",
                    children: "Delete"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }, rule.id.toString())) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "logs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[450px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No improvements logged yet" }) : logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-l-4 border-l-primary border-muted",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: log.entryType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTimestamp(log.timestamp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", children: log.description })
          ] })
        },
        log.id.toString()
      )) }) }) })
    ] }) })
  ] });
}
const VALID_STYLES = [
  "professional",
  "casual",
  "formal",
  "concise",
  "detailed"
];
function normalizeStyle(value) {
  if (value && VALID_STYLES.includes(value)) {
    return value;
  }
  return "professional";
}
function ProfilePage() {
  const { data: profile } = useUserProfile();
  const { data: personalitySettings } = usePersonalitySettings();
  const updateProfile = useUpdateUserProfile();
  const updatePersonality = useSetPersonalitySettings();
  const { data: allMemories = [] } = useMemories();
  const { data: commands = [] } = useCustomCommands();
  const { data: rules = [] } = useBehaviorRules();
  const deleteMemory = useDeleteMemory();
  const deleteCommand = useDeleteCommand();
  const deleteRule = useDeleteBehaviorRule();
  const memories = allMemories.filter(
    (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]")
  );
  const [name, setName] = reactExports.useState("");
  const [style, setStyle] = reactExports.useState("professional");
  const [isResetting, setIsResetting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profile == null ? void 0 : profile.name) setName(profile.name);
  }, [profile == null ? void 0 : profile.name]);
  reactExports.useEffect(() => {
    setStyle(normalizeStyle(personalitySettings == null ? void 0 : personalitySettings.communicationStyle));
  }, [personalitySettings == null ? void 0 : personalitySettings.communicationStyle]);
  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      ue.error("Please enter your name");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        preferences: (profile == null ? void 0 : profile.preferences) || "",
        personalitySettings: (profile == null ? void 0 : profile.personalitySettings) || JSON.stringify({ communicationStyle: "professional" }),
        onboardingComplete: (profile == null ? void 0 : profile.onboardingComplete) ?? true
      });
      ue.success("Profile updated successfully!");
    } catch (_error) {
      ue.error("Failed to update profile");
    }
  };
  const handleUpdatePersonality = async () => {
    try {
      await updatePersonality.mutateAsync(style);
      ue.success("Communication style updated!");
    } catch (_error) {
      ue.error("Failed to update communication style");
    }
  };
  const handleResetAll = async () => {
    setIsResetting(true);
    try {
      for (const m of allMemories) {
        await deleteMemory.mutateAsync(m.id);
      }
      for (const c of commands) {
        await deleteCommand.mutateAsync(c.id);
      }
      for (const r of rules) {
        await deleteRule.mutateAsync(r.id);
      }
      ue.success("All data has been reset. DJ starts fresh.");
    } catch (_error) {
      ue.error("Failed to reset some data. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };
  const displayName = (profile == null ? void 0 : profile.name) || name || "User";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-6 px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage your account and DJ's behavior" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", "data-ocid": "profile.link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "border-primary/40 text-primary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-4 w-4" }),
              " Full Settings"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/teach", "data-ocid": "profile.link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "border-secondary/40 text-secondary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "mr-2 h-4 w-4" }),
              " Teach DJ"
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "glow-border border-primary/40 bg-gradient-to-br from-card to-muted/20",
        style: { boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.1)" },
        "data-ocid": "profile.card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-primary/60 bg-primary/10",
              style: { boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.3)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10 text-primary" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "DJ Personal AI Assistant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "mt-2 border-primary/30 bg-primary/15 text-primary text-xs", children: [
              normalizeStyle(personalitySettings == null ? void 0 : personalitySettings.communicationStyle),
              " mode"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 sm:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary", children: memories.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Memories" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/30 bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-secondary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-secondary", children: commands.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Commands" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5 text-amber-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-amber-400", children: rules.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Rules" })
            ] })
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }),
            "Personal Information"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Update your profile details" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Your Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Enter your name",
                "data-ocid": "profile.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleUpdateProfile,
              disabled: updateProfile.isPending,
              className: "w-full bg-primary",
              "data-ocid": "profile.save_button",
              children: updateProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Updating..."
              ] }) : "Update Profile"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-secondary/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "DJ Personality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Adjust DJ's communication style" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Communication Style" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: style,
                onValueChange: (v) => setStyle(normalizeStyle(v)),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "profile.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "professional", children: "Professional" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "casual", children: "Casual" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "formal", children: "Formal" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "concise", children: "Concise" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "detailed", children: "Detailed" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleUpdatePersonality,
              disabled: updatePersonality.isPending,
              className: "w-full bg-secondary text-secondary-foreground",
              "data-ocid": "profile.save_button",
              children: updatePersonality.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Updating..."
              ] }) : "Update Style"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-destructive/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Danger Zone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Irreversible actions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              className: "w-full",
              disabled: isResetting,
              "data-ocid": "profile.open_modal_button",
              children: isResetting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Resetting..."
              ] }) : "Reset All Data"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "profile.dialog", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Are you absolutely sure?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently delete all your memories, commands, behavior rules, and improvement logs. This action cannot be undone." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "profile.cancel_button", children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogAction,
                {
                  onClick: handleResetAll,
                  className: "bg-destructive",
                  disabled: isResetting,
                  "data-ocid": "profile.confirm_button",
                  children: isResetting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Resetting..."
                  ] }) : "Reset Everything"
                }
              )
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelfImprovementPanel, {})
  ] }) });
}
export {
  ProfilePage
};
