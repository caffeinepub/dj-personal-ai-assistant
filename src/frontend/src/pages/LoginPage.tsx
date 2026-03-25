import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateUserProfile, useUserProfile } from "../hooks/useQueries";
import { useNavigate } from "../lib/router-shim";

export function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const createProfile = useCreateUserProfile();
  const [name, setName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  const isAuthenticated =
    loginStatus === "success" ||
    (loginStatus === "idle" &&
      identity !== undefined &&
      !identity.getPrincipal().isAnonymous());

  useEffect(() => {
    if (isAuthenticated) {
      if (!isProfileLoading && profile === null) {
        setShowNamePrompt(true);
      } else if (profile) {
        navigate("/");
      }
    }
  }, [isAuthenticated, profile, isProfileLoading, navigate]);

  // Show login error toast
  useEffect(() => {
    if (loginStatus === "loginError") {
      toast.error("Login failed. Please try again.");
    }
  }, [loginStatus]);

  const handleLogin = () => {
    if (loginStatus === "initializing") {
      toast.error("Still initializing, please wait a moment and try again.");
      return;
    }
    try {
      login();
    } catch (_error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await createProfile.mutateAsync(name.trim());
      toast.success("Profile created successfully!");
      navigate("/");
    } catch (_error) {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  if (showNamePrompt) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="glow-border w-full max-w-md border-2 border-primary">
          <CardHeader>
            <CardTitle className="glow-text text-center font-display text-2xl">
              Welcome to DJ
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Please tell me your name so I can address you properly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
                className="border-primary/50 bg-card text-lg focus-visible:ring-primary"
                autoFocus
              />
              <Button
                onClick={handleCreateProfile}
                disabled={createProfile.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                data-ocid="login.submit_button"
              >
                {createProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Bug fix: button is only disabled during active II login flow ("logging-in").
  // Previously it was also disabled during "initializing", which blocked mobile
  // users on slow networks. The handleLogin function already shows a toast if
  // the user taps while still initializing, so feedback is preserved.
  const isButtonDisabled = loginStatus === "logging-in";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-12 text-center">
        <h1 className="glow-text mb-4 font-display text-6xl font-bold tracking-wider md:text-8xl">
          DJ
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl">
          Your Personal AI Assistant
        </p>
      </div>

      <Card className="glow-border w-full max-w-md border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center font-display text-2xl text-primary">
            Access System
          </CardTitle>
          <CardDescription className="text-center">
            Secure decentralized authentication via Internet Identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            disabled={isButtonDisabled}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
            data-ocid="login.primary_button"
          >
            {loginStatus === "initializing" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Login with Internet Identity"
            )}
          </Button>
          {loginStatus === "initializing" && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Loading authentication system...
            </p>
          )}
          {loginStatus !== "logging-in" && (
            <p className="mt-3 text-center text-xs text-muted-foreground/70">
              A secure login window will open. Allow popups if prompted.
            </p>
          )}
        </CardContent>
      </Card>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2026. Built with love using caffeine.ai</p>
      </footer>
    </div>
  );
}
