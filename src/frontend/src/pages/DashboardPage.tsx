import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  BookOpen,
  Brain,
  CheckSquare,
  Cloud,
  Code,
  DollarSign,
  FileSpreadsheet,
  Globe,
  GraduationCap,
  Mic,
  Settings,
  Sparkles,
  StickyNote,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useActivateModule,
  useActiveModules,
  useBehaviorRules,
  useCustomCommands,
  useDeactivateModule,
  useFinanceEntries,
  useImprovementLogs,
  useMemories,
  useTasks,
  useUserProfile,
} from "../hooks/useQueries";
import { Link } from "../lib/router-shim";
import { isKnowledgeSource } from "../utils/knowledgeSources";

function getTodayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
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
    (m) => !isKnowledgeSource(m),
  ).length;
  const activateModule = useActivateModule();
  const deactivateModule = useDeactivateModule();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [weatherCity, setWeatherCity] = useState(
    () => localStorage.getItem("dj_weather_city") || "",
  );
  const [weatherInput, setWeatherInput] = useState(
    () => localStorage.getItem("dj_weather_city") || "",
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-show briefing once per day
  useEffect(() => {
    const key = `dj_briefing_dismissed_${getTodayDateKey()}`;
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setBriefingOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  // Listen for proactive engine briefing trigger
  useEffect(() => {
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

  // Today's tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  const todayTasks = tasks.filter((t) => {
    if (t.completed) return false;
    if (!t.deadline) return false;
    const dl = new Date(Number(t.deadline) / 1_000_000);
    return dl >= today && dl <= todayEnd;
  });

  // Finance summary for current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEntries = financeEntries.filter(
    (e) => Number(e.entryDate) / 1_000_000 >= monthStart,
  );
  const totalIncome = monthEntries
    .filter((e) => Number(e.amount) > 0)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = monthEntries
    .filter((e) => Number(e.amount) < 0)
    .reduce((sum, e) => sum + Math.abs(Number(e.amount)), 0);
  const balance = totalIncome - totalExpenses;

  const formatAmount = (cents: number) => `₹${(cents / 100).toFixed(2)}`;

  const modules = [
    {
      id: "excel",
      name: "Excel Analysis",
      icon: FileSpreadsheet,
      description: "Upload and analyze spreadsheets",
      path: "/excel",
    },
    {
      id: "coding",
      name: "Coding Assistant",
      icon: Code,
      description: "Write and debug code",
      path: "/coding",
    },
    {
      id: "website",
      name: "Website Builder",
      icon: Globe,
      description: "Generate websites instantly",
      path: "/website",
    },
    {
      id: "tasks",
      name: "Tasks & Reminders",
      icon: CheckSquare,
      description: "Set tasks with deadlines",
      path: "/tasks",
    },
    {
      id: "notes",
      name: "Notes",
      icon: StickyNote,
      description: "Quick capture and organize notes",
      path: "/notes",
    },
    {
      id: "finance",
      name: "Finance Tracker",
      icon: DollarSign,
      description: "Track income and expenses",
      path: "/finance",
    },
  ];

  const handleToggleModule = async (moduleName: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateModule.mutateAsync(moduleName);
        toast.success(`${moduleName} module deactivated`);
      } else {
        await activateModule.mutateAsync(moduleName);
        toast.success(`${moduleName} module activated`);
      }
    } catch (_error) {
      toast.error("Failed to toggle module");
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTimestamp = (timestamp: bigint) =>
    new Date(Number(timestamp) / 1000000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const initials = (profile?.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* DJ Profile Card */}
        <div
          className="flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-gradient-to-br from-card to-muted/30 p-5"
          style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.15)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-display text-lg font-bold text-primary"
              style={{ boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.5)" }}
            >
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-bold">
                  {profile?.name || "User"}
                </p>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs capitalize">
                  {(() => {
                    try {
                      return JSON.parse(profile?.personalitySettings || "{}")
                        .communicationStyle;
                    } catch {
                      return undefined;
                    }
                  })() || "professional"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-muted-foreground">
                <span>{rules.length} rules</span>
                <span>{memories.length} memories</span>
                <span>{commands.length} commands</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/settings">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/40 text-primary"
              >
                <Settings className="mr-1 h-3.5 w-3.5" /> Settings
              </Button>
            </Link>
            <Link to="/teach">
              <Button
                variant="outline"
                size="sm"
                className="border-secondary/40 text-secondary"
              >
                <GraduationCap className="mr-1 h-3.5 w-3.5" /> Teach
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glow-border rounded-lg border-2 border-primary bg-gradient-to-br from-card to-muted p-8 text-center">
          <div className="mb-6">
            <p className="glow-text font-display text-5xl font-bold md:text-7xl">
              {formatTime(currentTime)}
            </p>
            <p className="mt-2 text-lg text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>
          <h1 className="glow-text-cyan mb-2 font-display text-3xl font-bold md:text-4xl">
            Welcome back, {profile?.name || "User"}
          </h1>
          <p className="text-lg text-muted-foreground">
            I&apos;m DJ, your personal AI assistant. How can I help you today?
          </p>
          <div className="mt-6">
            <Button
              data-ocid="dashboard.briefing_button"
              onClick={() => setBriefingOpen(true)}
              className="bg-primary/90 hover:bg-primary gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Get Today&apos;s Briefing
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Voice Interface */}
          <Card className="glow-border border-primary/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Voice Interface
              </CardTitle>
              <CardDescription>
                Say &quot;Hey DJ&quot; to activate voice commands
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="glow-border-cyan pulse-ring absolute inset-0 rounded-full border-4 border-secondary" />
                <div className="glow-border relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Mic className="h-16 w-16 text-primary" />
                </div>
              </div>
              <p className="mt-6 text-center font-display text-lg text-muted-foreground">
                Voice commands ready
              </p>
            </CardContent>
          </Card>

          {/* DJ Brain Stats */}
          <Card className="glow-border border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Brain className="h-6 w-6 text-primary" /> DJ Brain
              </CardTitle>
              <CardDescription>Self-improvement metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Memories</span>
                <Badge
                  variant="outline"
                  className="border-primary text-primary"
                >
                  {regularMemoryCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> Knowledge Sources
                </div>
                <Badge
                  variant="outline"
                  className="border-blue-400 text-blue-400"
                >
                  {knowledgeSourceCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Custom Commands</span>
                <Badge
                  variant="outline"
                  className="border-secondary text-secondary"
                >
                  {commands.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Modules</span>
                <Badge variant="outline" className="border-accent text-accent">
                  {activeModules.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Rules</span>
                <Badge
                  variant="outline"
                  className="border-chart-3 text-chart-3"
                >
                  {rules.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Improvements</span>
                <Badge
                  variant="outline"
                  className="border-chart-5 text-chart-5"
                >
                  {logs.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Tiles */}
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">Modules</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModules.includes(module.id);
              return (
                <Card
                  key={module.id}
                  className={`glow-border transition-all ${
                    isActive
                      ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10"
                      : "border-muted"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Link
                        to={module.path}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                            isActive ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <CardTitle
                            className={`text-lg ${
                              isActive ? "text-primary" : ""
                            }`}
                          >
                            {module.name}
                          </CardTitle>
                        </div>
                      </Link>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() =>
                          handleToggleModule(module.id, isActive)
                        }
                        disabled={
                          activateModule.isPending || deactivateModule.isPending
                        }
                      />
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="glow-border border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Activity className="h-6 w-6 text-primary" /> Recent Activity
            </CardTitle>
            <CardDescription>Latest improvements and changes</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No activity yet
              </p>
            ) : (
              <div className="space-y-4">
                {logs.slice(0, 5).map((log) => (
                  <div
                    key={log.id.toString()}
                    className="flex items-start justify-between border-l-2 border-primary/50 pl-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {log.entryType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Briefing Dialog */}
      <Dialog open={briefingOpen} onOpenChange={setBriefingOpen}>
        <DialogContent
          className="max-w-lg border-primary/40 bg-card/95 backdrop-blur"
          data-ocid="dashboard.briefing.dialog"
          style={{ boxShadow: "0 0 40px oklch(0.65 0.25 220 / 0.25)" }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl glow-text">
              {getGreeting()}, {profile?.name || "there"} ✨
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Today's Tasks */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-primary">
                  Today&apos;s Tasks
                </h3>
                <Badge className="bg-primary/20 text-primary text-xs">
                  {todayTasks.length}
                </Badge>
              </div>
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks due today. 🎉
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {todayTasks.slice(0, 5).map((task) => (
                    <li
                      key={task.id.toString()}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{task.title}</span>
                      {task.deadline && (
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                          {new Date(
                            Number(task.deadline) / 1_000_000,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </li>
                  ))}
                  {todayTasks.length > 5 && (
                    <li className="text-xs text-muted-foreground">
                      +{todayTasks.length - 5} more
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Finance Summary */}
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-secondary" />
                <h3 className="font-semibold text-secondary">
                  Finance This Month
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-green-500/10 p-2">
                  <TrendingUp className="mx-auto h-4 w-4 text-green-400" />
                  <p className="mt-1 text-xs text-muted-foreground">Income</p>
                  <p className="text-sm font-bold text-green-400">
                    {formatAmount(totalIncome)}
                  </p>
                </div>
                <div className="rounded-md bg-red-500/10 p-2">
                  <TrendingDown className="mx-auto h-4 w-4 text-red-400" />
                  <p className="mt-1 text-xs text-muted-foreground">Expenses</p>
                  <p className="text-sm font-bold text-red-400">
                    {formatAmount(totalExpenses)}
                  </p>
                </div>
                <div
                  className={`rounded-md p-2 ${balance >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}
                >
                  <DollarSign
                    className={`mx-auto h-4 w-4 ${balance >= 0 ? "text-green-400" : "text-red-400"}`}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Balance</p>
                  <p
                    className={`text-sm font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {balance >= 0 ? "+" : ""}
                    {formatAmount(Math.abs(balance))}
                  </p>
                </div>
              </div>
            </div>

            {/* Weather */}
            <div className="rounded-lg border border-muted/40 bg-muted/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-muted-foreground">Weather</h3>
              </div>
              {weatherCity ? (
                <p className="mb-3 text-sm text-muted-foreground">
                  City saved:{" "}
                  <span className="text-foreground font-medium">
                    {weatherCity}
                  </span>{" "}
                  &mdash; live weather requires an external API.
                </p>
              ) : (
                <p className="mb-3 text-sm text-muted-foreground">
                  Weather data not available &mdash; enter your city below.
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  data-ocid="dashboard.weather.input"
                  placeholder="Enter city name"
                  value={weatherInput}
                  onChange={(e) => setWeatherInput(e.target.value)}
                  className="flex-1 border-muted/40 bg-card/50 text-sm"
                />
                <Button
                  data-ocid="dashboard.weather.button"
                  size="sm"
                  variant="outline"
                  className="border-muted/40"
                  onClick={() => {
                    if (weatherInput.trim()) {
                      localStorage.setItem(
                        "dj_weather_city",
                        weatherInput.trim(),
                      );
                      setWeatherCity(weatherInput.trim());
                    }
                    toast.info(
                      "Weather lookup not supported — no external APIs available. City saved for reference.",
                    );
                  }}
                >
                  Check
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBriefingOpen(false)}
              className="text-muted-foreground"
            >
              Close
            </Button>
            <Button
              data-ocid="dashboard.briefing.dismiss_button"
              size="sm"
              onClick={dismissBriefing}
              className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
            >
              Dismiss for today
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
