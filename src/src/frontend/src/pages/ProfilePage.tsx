import { useState } from "react";
import { Layout } from "../components/Layout";
import { SelfImprovementPanel } from "../components/SelfImprovementPanel";
import {
  useUserProfile,
  useUpdateUserProfile,
  usePersonalitySettings,
  useSetPersonalitySettings,
} from "../hooks/useQueries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  const { data: profile } = useUserProfile();
  const { data: personalitySettings } = usePersonalitySettings();
  const updateProfile = useUpdateUserProfile();
  const updatePersonality = useSetPersonalitySettings();

  const [name, setName] = useState(profile?.name || "");
  const [style, setStyle] = useState(personalitySettings?.communicationStyle || "professional");

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        preferences: profile?.preferences || "",
        personalitySettings: profile?.personalitySettings || { communicationStyle: "professional" },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleUpdatePersonality = async () => {
    try {
      await updatePersonality.mutateAsync(style);
      toast.success("Communication style updated!");
    } catch (error) {
      toast.error("Failed to update communication style");
    }
  };

  const handleResetAll = async () => {
    // This would require backend methods to clear all data
    toast.info("Reset functionality coming soon");
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="glow-text font-display text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and DJ's behavior</p>
        </div>

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
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={updateProfile.isPending}
                className="w-full bg-primary"
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
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
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
                  <Button variant="destructive" className="w-full">
                    Reset All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your memories, commands, behavior rules, and
                      improvement logs. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAll} className="bg-destructive">
                      Reset Everything
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
