import { u as useUserProfile, a as useActiveModules, b as useMemories, c as useCustomCommands, d as useImprovementLogs, e as useBehaviorRules, f as useTasks, g as useFinanceEntries, h as useActivateModule, i as useDeactivateModule, r as reactExports, j as jsxRuntimeExports, L as Link, k as ue } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-iyETJf1A.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BpTMTJ9f.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { S as Switch } from "./switch-DRk_tZ1N.js";
import { L as Layout, S as Settings, B as Brain, a as BookOpen, F as FileSpreadsheet, C as Code, G as Globe, b as SquareCheckBig, c as StickyNote, D as DollarSign, A as Activity } from "./Layout-y-fTRwTO.js";
import { i as isKnowledgeSource } from "./knowledgeSources-u_u5fZVB.js";
import { G as GraduationCap } from "./proxy-CDDWEtkX.js";
import { S as Sparkles } from "./sparkles-DIDRgt7x.js";
import { M as Mic } from "./mic-q3q9Ut1L.js";
import { T as TrendingUp, a as TrendingDown } from "./trending-up-BvVn1384.js";
import "./index-DREpW-Gk.js";
import "./index-Cj4N10C2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("cloud", __iconNode);
function getTodayDateKey() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getGreeting() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function DashboardPage() {
  const { data: profile } = useUserProfile();
  const { data: activeModules = [] } = useActiveModules();
  const { data: memories = [] } = useMemories();
  const { data: commands = [] } = useCustomCommands();
  const { data: logs = [] } = useImprovementLogs();
  const { data: rules = [] } = useBehaviorRules();
  const { data: tasks = [] } = useTasks();
  const { data: financeEntries = [] } = useFinanceEntries();
  const knowledgeSourceCount = memories.filter(isKnowledgeSource).length;
  const regularMemoryCount = memories.filter(
    (m) => !isKnowledgeSource(m)
  ).length;
  const activateModule = useActivateModule();
  const deactivateModule = useDeactivateModule();
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const [briefingOpen, setBriefingOpen] = reactExports.useState(false);
  const [weatherCity, setWeatherCity] = reactExports.useState(
    () => localStorage.getItem("dj_weather_city") || ""
  );
  const [weatherInput, setWeatherInput] = reactExports.useState(
    () => localStorage.getItem("dj_weather_city") || ""
  );
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  reactExports.useEffect(() => {
    const key = `dj_briefing_dismissed_${getTodayDateKey()}`;
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setBriefingOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, []);
  reactExports.useEffect(() => {
    const handler = () => {
      const key = `dj_briefing_dismissed_${getTodayDateKey()}`;
      if (!localStorage.getItem(key)) {
        setBriefingOpen(true);
      }
    };
    window.addEventListener("dj-show-briefing", handler);
    return () => window.removeEventListener("dj-show-briefing", handler);
  }, []);
  const dismissBriefing = () => {
    localStorage.setItem(`dj_briefing_dismissed_${getTodayDateKey()}`, "1");
    setBriefingOpen(false);
  };
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  const todayTasks = tasks.filter((t) => {
    if (t.completed) return false;
    if (!t.deadline) return false;
    const dl = new Date(Number(t.deadline) / 1e6);
    return dl >= today && dl <= todayEnd;
  });
  const now = /* @__PURE__ */ new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEntries = financeEntries.filter(
    (e) => Number(e.entryDate) / 1e6 >= monthStart
  );
  const totalIncome = monthEntries.filter((e) => Number(e.amount) > 0).reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = monthEntries.filter((e) => Number(e.amount) < 0).reduce((sum, e) => sum + Math.abs(Number(e.amount)), 0);
  const balance = totalIncome - totalExpenses;
  const formatAmount = (cents) => `₹${(cents / 100).toFixed(2)}`;
  const modules = [
    {
      id: "excel",
      name: "Excel Analysis",
      icon: FileSpreadsheet,
      description: "Upload and analyze spreadsheets",
      path: "/excel"
    },
    {
      id: "coding",
      name: "Coding Assistant",
      icon: Code,
      description: "Write and debug code",
      path: "/coding"
    },
    {
      id: "website",
      name: "Website Builder",
      icon: Globe,
      description: "Generate websites instantly",
      path: "/website"
    },
    {
      id: "tasks",
      name: "Tasks & Reminders",
      icon: SquareCheckBig,
      description: "Set tasks with deadlines",
      path: "/tasks"
    },
    {
      id: "notes",
      name: "Notes",
      icon: StickyNote,
      description: "Quick capture and organize notes",
      path: "/notes"
    },
    {
      id: "finance",
      name: "Finance Tracker",
      icon: DollarSign,
      description: "Track income and expenses",
      path: "/finance"
    }
  ];
  const handleToggleModule = async (moduleName, isActive) => {
    try {
      if (isActive) {
        await deactivateModule.mutateAsync(moduleName);
        ue.success(`${moduleName} module deactivated`);
      } else {
        await activateModule.mutateAsync(moduleName);
        ue.success(`${moduleName} module activated`);
      }
    } catch (_error) {
      ue.error("Failed to toggle module");
    }
  };
  const formatTime = (date) => date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const formatDate = (date) => date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const formatTimestamp = (timestamp) => new Date(Number(timestamp) / 1e6).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const initials = ((profile == null ? void 0 : profile.name) || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-8 px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-gradient-to-br from-card to-muted/30 p-5",
          style: { boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.15)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-display text-lg font-bold text-primary",
                  style: { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.5)" },
                  children: initials
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: (profile == null ? void 0 : profile.name) || "User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 text-xs capitalize", children: (() => {
                    try {
                      return JSON.parse((profile == null ? void 0 : profile.personalitySettings) || "{}").communicationStyle;
                    } catch {
                      return void 0;
                    }
                  })() || "professional" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-0.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    rules.length,
                    " rules"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    memories.length,
                    " memories"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    commands.length,
                    " commands"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "border-primary/40 text-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-1 h-3.5 w-3.5" }),
                    " Settings"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/teach", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "border-secondary/40 text-secondary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "mr-1 h-3.5 w-3.5" }),
                    " Teach"
                  ]
                }
              ) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glow-border rounded-lg border-2 border-primary bg-gradient-to-br from-card to-muted p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "glow-text font-display text-5xl font-bold md:text-7xl", children: formatTime(currentTime) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-lg text-muted-foreground", children: formatDate(currentTime) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "glow-text-cyan mb-2 font-display text-3xl font-bold md:text-4xl", children: [
          "Welcome back, ",
          (profile == null ? void 0 : profile.name) || "User"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground", children: "I'm DJ, your personal AI assistant. How can I help you today?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "dashboard.briefing_button",
            onClick: () => setBriefingOpen(true),
            className: "bg-primary/90 hover:bg-primary gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              "Get Today's Briefing"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50 lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-2xl", children: "Voice Interface" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: 'Say "Hey DJ" to activate voice commands' })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-border-cyan pulse-ring absolute inset-0 rounded-full border-4 border-secondary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-border relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-gradient-to-br from-primary/20 to-secondary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-16 w-16 text-primary" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center font-display text-lg text-muted-foreground", children: "Voice commands ready" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-6 w-6 text-primary" }),
              " DJ Brain"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Self-improvement metrics" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Memories" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "border-primary text-primary",
                  children: regularMemoryCount
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5" }),
                " Knowledge Sources"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "border-blue-400 text-blue-400",
                  children: knowledgeSourceCount
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Custom Commands" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "border-secondary text-secondary",
                  children: commands.length
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Active Modules" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-accent text-accent", children: activeModules.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Active Rules" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "border-chart-3 text-chart-3",
                  children: rules.length
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Improvements" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "border-chart-5 text-chart-5",
                  children: logs.length
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-2xl font-bold", children: "Modules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModules.includes(module.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: `glow-border transition-all ${isActive ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10" : "border-muted"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: module.path,
                      className: "flex items-center gap-3 flex-1 min-w-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-primary/20" : "bg-muted"}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Icon,
                              {
                                className: `h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CardTitle,
                          {
                            className: `text-lg ${isActive ? "text-primary" : ""}`,
                            children: module.name
                          }
                        ) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: isActive,
                      onCheckedChange: () => handleToggleModule(module.id, isActive),
                      disabled: activateModule.isPending || deactivateModule.isPending
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: module.description })
              ] })
            },
            module.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-6 w-6 text-primary" }),
            " Recent Activity"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Latest improvements and changes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No activity yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: logs.slice(0, 5).map((log) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-start justify-between border-l-2 border-primary/50 pl-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: log.entryType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: formatTimestamp(log.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", children: log.description })
            ] })
          },
          log.id.toString()
        )) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: briefingOpen, onOpenChange: setBriefingOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg border-primary/40 bg-card/95 backdrop-blur",
        "data-ocid": "dashboard.briefing.dialog",
        style: { boxShadow: "0 0 40px oklch(0.65 0.25 220 / 0.25)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-2xl glow-text", children: [
            getGreeting(),
            ", ",
            (profile == null ? void 0 : profile.name) || "there",
            " ✨"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-primary", children: "Today's Tasks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary text-xs", children: todayTasks.length })
              ] }),
              todayTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No tasks due today. 🎉" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5", children: [
                todayTasks.slice(0, 5).map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-2 text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: task.title }),
                      task.deadline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto shrink-0 text-xs text-muted-foreground", children: new Date(
                        Number(task.deadline) / 1e6
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      }) })
                    ]
                  },
                  task.id.toString()
                )),
                todayTasks.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-muted-foreground", children: [
                  "+",
                  todayTasks.length - 5,
                  " more"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-secondary/20 bg-secondary/5 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-secondary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-secondary", children: "Finance This Month" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-green-500/10 p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "mx-auto h-4 w-4 text-green-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Income" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-green-400", children: formatAmount(totalIncome) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-red-500/10 p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "mx-auto h-4 w-4 text-red-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Expenses" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-red-400", children: formatAmount(totalExpenses) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `rounded-md p-2 ${balance >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        DollarSign,
                        {
                          className: `mx-auto h-4 w-4 ${balance >= 0 ? "text-green-400" : "text-red-400"}`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Balance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: `text-sm font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`,
                          children: [
                            balance >= 0 ? "+" : "",
                            formatAmount(Math.abs(balance))
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-muted/40 bg-muted/10 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-muted-foreground", children: "Weather" })
              ] }),
              weatherCity ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 text-sm text-muted-foreground", children: [
                "City saved:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: weatherCity }),
                " ",
                "— live weather requires an external API."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-sm text-muted-foreground", children: "Weather data not available — enter your city below." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "dashboard.weather.input",
                    placeholder: "Enter city name",
                    value: weatherInput,
                    onChange: (e) => setWeatherInput(e.target.value),
                    className: "flex-1 border-muted/40 bg-card/50 text-sm"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "dashboard.weather.button",
                    size: "sm",
                    variant: "outline",
                    className: "border-muted/40",
                    onClick: () => {
                      if (weatherInput.trim()) {
                        localStorage.setItem(
                          "dj_weather_city",
                          weatherInput.trim()
                        );
                        setWeatherCity(weatherInput.trim());
                      }
                      ue.info(
                        "Weather lookup not supported — no external APIs available. City saved for reference."
                      );
                    },
                    children: "Check"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setBriefingOpen(false),
                className: "text-muted-foreground",
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "dashboard.briefing.dismiss_button",
                size: "sm",
                onClick: dismissBriefing,
                className: "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30",
                children: "Dismiss for today"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  DashboardPage
};
