import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
  useUserProfile,
  useActiveModules,
  useActivateModule,
  useDeactivateModule,
  useMemories,
  useCustomCommands,
  useImprovementLogs,
} from "../hooks/useQueries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mic, FileSpreadsheet, Code, Globe, Brain, Activity } from "lucide-react";
import { toast } from "sonner";

export function DashboardPage() {
  const { data: profile } = useUserProfile();
  const { data: activeModules = [] } = useActiveModules();
  const { data: memories = [] } = useMemories();
  const { data: commands = [] } = useCustomCommands();
  const { data: logs = [] } = useImprovementLogs();
  const activateModule = useActivateModule();
  const deactivateModule = useDeactivateModule();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    {
      id: "excel",
      name: "Excel Analysis",
      icon: FileSpreadsheet,
      description: "Upload and analyze spreadsheets",
    },
    {
      id: "coding",
      name: "Coding Assistant",
      icon: Code,
      description: "Write and debug code",
    },
    {
      id: "website",
      name: "Website Builder",
      icon: Globe,
      description: "Generate websites instantly",
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
    } catch (error) {
      toast.error("Failed to toggle module");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Hero Section with Time and Greeting */}
        <div className="glow-border rounded-lg border-2 border-primary bg-gradient-to-br from-card to-muted p-8 text-center">
          <div className="mb-6">
            <p className="glow-text font-display text-5xl font-bold md:text-7xl">
              {formatTime(currentTime)}
            </p>
            <p className="mt-2 text-lg text-muted-foreground">{formatDate(currentTime)}</p>
          </div>
          <h1 className="glow-text-cyan mb-2 font-display text-3xl font-bold md:text-4xl">
            Welcome back, {profile?.name || "User"}
          </h1>
          <p className="text-lg text-muted-foreground">
            I'm DJ, your personal AI assistant. How can I help you today?
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Central Listening Interface */}
          <Card className="glow-border border-primary/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Voice Interface</CardTitle>
              <CardDescription>Say "Hey DJ" to activate voice commands</CardDescription>
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
                <Brain className="h-6 w-6 text-primary" />
                DJ Brain
              </CardTitle>
              <CardDescription>Self-improvement metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Memories</span>
                <Badge variant="outline" className="border-primary text-primary">
                  {memories.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Custom Commands</span>
                <Badge variant="outline" className="border-secondary text-secondary">
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
                <span className="text-muted-foreground">Improvements</span>
                <Badge variant="outline" className="border-chart-3 text-chart-3">
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
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            isActive ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                        </div>
                      </div>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => handleToggleModule(module.id, isActive)}
                        disabled={activateModule.isPending || deactivateModule.isPending}
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
              <Activity className="h-6 w-6 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest improvements and changes</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-center text-muted-foreground">No activity yet</p>
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
    </Layout>
  );
}
