import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, GraduationCap, Loader2, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { SelfImprovementPanel } from "../components/SelfImprovementPanel";
import {
  useBehaviorRules,
  useCustomCommands,
  useDeleteBehaviorRule,
  useDeleteCommand,
  useDeleteMemory,
  useMemories,
  usePersonalitySettings,
  useSetPersonalitySettings,
  useUpdateUserProfile,
  useUserProfile,
} from "../hooks/useQueries";
import { Link } from "../lib/router-shim";

// Valid style values — used to guard unknown backend values
const VALID_STYLES = [
  "professional",
  "casual",
  "formal",
  "concise",
  "detailed",
] as const;
type StyleValue = (typeof VALID_STYLES)[number];

function normalizeStyle(value: string | undefined): StyleValue {
  if (value && VALID_STYLES.includes(value as StyleValue)) {
    return value as StyleValue;
  }
  return "professional";
}

export function ProfilePage() {
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

  // Exclude knowledge sources from the memory count shown in the profile header
  const memories = allMemories.filter(
    (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
  );

  const [name, setName] = useState("");
  const [style, setStyle] = useState<StyleValue>("professional");
  const [isResetting, setIsResetting] = useState(false);

  // Sync form fields once data loads — avoids stale empty state on mount
  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  useEffect(() => {
    setStyle(normalizeStyle(personalitySettings?.communicationStyle));
  }, [personalitySettings?.communicationStyle]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        preferences: profile?.preferences || "",
        personalitySettings: profile?.personalitySettings || {
          communicationStyle: "professional",
        },
        onboardingComplete: profile?.onboardingComplete ?? true,
      });
      toast.success("Profile updated successfully!");
    } catch (_error) {
      toast.error("Failed to update profile");
    }
  };

  const handleUpdatePersonality = async () => {
    try {
      await updatePersonality.mutateAsync(style);
      toast.success("Communication style updated!");
    } catch (_error) {
      toast.error("Failed to update communication style");
    }
  };

  const handleResetAll = async () => {
    setIsResetting(true);
    try {
      // Delete all memories
      for (const m of allMemories) {
        await deleteMemory.mutateAsync(m.id);
      }
      // Delete all commands
      for (const c of commands) {
        await deleteCommand.mutateAsync(c.id);
      }
      // Delete all rules
      for (const r of rules) {
        await deleteRule.mutateAsync(r.id);
      }
      toast.success("All data has been reset. DJ starts fresh.");
    } catch (_error) {
      toast.error("Failed to reset some data. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const displayName = profile?.name || name || "User";

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        {/* Page header row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="glow-text font-display text-3xl font-bold">
              Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account and DJ's behavior
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/settings" data-ocid="profile.link">
              <Button
                variant="outline"
                className="border-primary/40 text-primary"
              >
                <Settings className="mr-2 h-4 w-4" /> Full Settings
              </Button>
            </Link>
            <Link to="/teach" data-ocid="profile.link">
              <Button
                variant="outline"
                className="border-secondary/40 text-secondary"
              >
                <GraduationCap className="mr-2 h-4 w-4" /> Teach DJ
              </Button>
            </Link>
          </div>
        </div>

        {/* ─── Profile Header Card ─── */}
        <Card
          className="glow-border border-primary/40 bg-gradient-to-br from-card to-muted/20"
          style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.1)" }}
          data-ocid="profile.card"
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-primary/60 bg-primary/10"
                style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.3)" }}
              >
                <User className="h-10 w-10 text-primary" />
              </div>

              {/* Name & identity */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {displayName}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  DJ Personal AI Assistant
                </p>
                <Badge className="mt-2 border-primary/30 bg-primary/15 text-primary text-xs">
                  {normalizeStyle(personalitySettings?.communicationStyle)} mode
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-display text-xl font-bold text-primary">
                    {memories.length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Memories
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/30 bg-secondary/10">
                    <Settings className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="font-display text-xl font-bold text-secondary">
                    {commands.length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Commands
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10">
                    <GraduationCap className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="font-display text-xl font-bold text-amber-400">
                    {rules.length}
                  </span>
                  <span className="text-xs text-muted-foreground">Rules</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glow-border border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  data-ocid="profile.input"
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={updateProfile.isPending}
                className="w-full bg-primary"
                data-ocid="profile.save_button"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="glow-border border-secondary/50">
            <CardHeader>
              <CardTitle>DJ Personality</CardTitle>
              <CardDescription>Adjust DJ's communication style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Communication Style</Label>
                <Select
                  value={style}
                  onValueChange={(v) => setStyle(normalizeStyle(v))}
                >
                  <SelectTrigger data-ocid="profile.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpdatePersonality}
                disabled={updatePersonality.isPending}
                className="w-full bg-secondary text-secondary-foreground"
                data-ocid="profile.save_button"
              >
                {updatePersonality.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Style"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="glow-border border-destructive/50">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isResetting}
                    data-ocid="profile.open_modal_button"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset All Data"
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="profile.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your memories, commands,
                      behavior rules, and improvement logs. This action cannot
                      be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="profile.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetAll}
                      className="bg-destructive"
                      disabled={isResetting}
                      data-ocid="profile.confirm_button"
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Everything"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        <SelfImprovementPanel />
      </div>
    </Layout>
  );
}
