import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  useUserProfile,
  useCreateUserProfile,
  useUpdateUserProfile,
  useSetBehaviorRule,
  useSaveOnboardingComplete,
  useSetPersonalitySettings,
  useBehaviorRules,
} from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronRight, Check, Briefcase, Smile, Zap, AlignLeft, GraduationCap, Flame } from "lucide-react";
import { toast } from "sonner";

const PERSONALITIES = [
  { id: "professional", label: "Professional", icon: Briefcase, desc: "Formal, structured, data-driven" },
  { id: "friendly", label: "Friendly", icon: Smile, desc: "Warm, approachable, supportive" },
  { id: "witty", label: "Witty", icon: Zap, desc: "Sharp, clever, with humor" },
  { id: "concise", label: "Concise", icon: AlignLeft, desc: "Brief, direct, no fluff" },
  { id: "mentor", label: "Mentor", icon: GraduationCap, desc: "Guiding, thoughtful, educational" },
  { id: "motivator", label: "Motivator", icon: Flame, desc: "Energetic, encouraging, action-oriented" },
];

const QUICK_RULES = [
  { id: "bullets", text: "Always respond in bullet points" },
  { id: "brief", text: "Keep responses brief and to the point" },
  { id: "formal", text: "Use formal language at all times" },
  { id: "greet", text: "Always greet me by my name" },
  { id: "examples", text: "Give examples in every response" },
];

const STEPS = ["Welcome", "About You", "Personality", "Quick Rules", "All Set!"];

export function SetupWizardPage() {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: rules = [] } = useBehaviorRules();
  const createProfile = useCreateUserProfile();
  const updateProfile = useUpdateUserProfile();
  const setBehaviorRule = useSetBehaviorRule();
  const saveOnboarding = useSaveOnboardingComplete();
  const setPersonality = useSetPersonalitySettings();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name || "");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState("professional");
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleSkip = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Create or update profile
      if (!profile) {
        await createProfile.mutateAsync(name || "User");
      }

      const preferences = [
        profession && `Profession: ${profession}`,
        location && `Location: ${location}`,
        goal && `Main goal: ${goal}`,
      ].filter(Boolean).join(". ");

      await updateProfile.mutateAsync({
        name: name || profile?.name || "User",
        preferences,
        personalitySettings: { communicationStyle: selectedPersonality },
        onboardingComplete: true,
      });

      // Set personality
      await setPersonality.mutateAsync(selectedPersonality);

      // Save selected rules
      for (let i = 0; i < selectedRules.length; i++) {
        const ruleText = QUICK_RULES.find((r) => r.id === selectedRules[i])?.text;
        if (ruleText) {
          await setBehaviorRule.mutateAsync({
            ruleText,
            priority: BigInt(rules.length + i + 1),
          });
        }
      }

      // Mark onboarding complete
      await saveOnboarding.mutateAsync(true);

      toast.success("DJ is ready! Welcome aboard.");
      navigate("/");
    } catch (_error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRule = (id: string) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, oklch(0.12 0.05 220) 0%, oklch(0 0 0) 70%)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(oklch(0.65 0.25 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.25 220) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Progress bar */}
      <div className="mb-8 w-full max-w-md">
        <div className="mb-3 flex justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                }`}
                style={i === step ? { boxShadow: "0 0 10px oklch(0.65 0.25 220 / 0.6)" } : {}}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className="hidden text-[10px] text-muted-foreground sm:block">{s}</span>
            </div>
          ))}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            style={{ boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.8)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10"
                style={{ boxShadow: "0 0 30px oklch(0.65 0.25 220 / 0.5)" }}
              >
                <span className="glow-text font-display text-3xl font-bold">DJ</span>
              </div>
              <div>
                <h1 className="glow-text font-display text-3xl font-bold">Hello, I'm DJ</h1>
                <p className="mt-3 text-muted-foreground">
                  Your personal AI assistant. Let's get to know each other so I can serve you better.
                </p>
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-sm text-muted-foreground">What should I call you?</Label>
                <Input
                  placeholder="Your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-primary/40 bg-card/50 text-center text-lg"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && handleNext()}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={handleSkip}>
                  Skip
                </Button>
                <Button
                  className="flex-1 bg-primary"
                  onClick={handleNext}
                  disabled={!name.trim()}
                  style={{ boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.4)" }}
                >
                  Let's Begin <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: About You */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="glow-text-cyan font-display text-2xl font-bold">
                  Tell me about yourself{name ? `, ${name}` : ""}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This helps me give you more relevant and personalized answers.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>What do you do for work?</Label>
                  <Input
                    placeholder="e.g. Software Engineer, Doctor, Teacher..."
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="border-primary/30 bg-card/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Where are you based? <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Input
                    placeholder="e.g. New York, London..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-primary/30 bg-card/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label>What's your most important goal right now?</Label>
                  <Textarea
                    placeholder="e.g. Launch my startup, learn to code, manage my team better..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="border-primary/30 bg-card/50"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={handleSkip}>
                  Skip
                </Button>
                <Button className="flex-1 bg-primary" onClick={handleNext}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Personality */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="glow-text-cyan font-display text-2xl font-bold">
                  How should I talk to you?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a personality style. You can change this anytime.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PERSONALITIES.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedPersonality(id)}
                    className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all ${
                      selectedPersonality === id
                        ? "border-primary bg-primary/15"
                        : "border-muted bg-card/30 hover:border-primary/40"
                    }`}
                    style={
                      selectedPersonality === id
                        ? { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.35)" }
                        : {}
                    }
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                      selectedPersonality === id ? "bg-primary/30" : "bg-muted"
                    }`}>
                      <Icon className={`h-4 w-4 ${selectedPersonality === id ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${selectedPersonality === id ? "text-primary" : ""}`}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    {selectedPersonality === id && (
                      <Check className="absolute top-2 right-2 h-3 w-3 text-primary" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={handleSkip}>
                  Skip
                </Button>
                <Button className="flex-1 bg-primary" onClick={handleNext}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Quick Rules */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="glow-text-cyan font-display text-2xl font-bold">
                  Quick rules setup
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap to activate rules that DJ should always follow.
                </p>
              </div>
              <div className="space-y-3">
                {QUICK_RULES.map(({ id, text }) => {
                  const active = selectedRules.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleRule(id)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-muted bg-card/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                      style={active ? { boxShadow: "0 0 10px oklch(0.65 0.25 220 / 0.3)" } : {}}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        active ? "border-primary bg-primary" : "border-muted"
                      }`}>
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm">{text}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={handleSkip}>
                  Skip
                </Button>
                <Button className="flex-1 bg-primary" onClick={handleNext}>
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: All Set */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10"
                style={{ boxShadow: "0 0 30px oklch(0.65 0.25 220 / 0.6)" }}
              >
                <Check className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="glow-text font-display text-2xl font-bold">You're all set!</h2>
                <p className="mt-2 text-muted-foreground">
                  Here's what DJ has learned about you:
                </p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-card/50 p-4 text-left space-y-2">
                {name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span>Name: <span className="text-foreground">{name}</span></span>
                  </div>
                )}
                {profession && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span>Profession: <span className="text-foreground">{profession}</span></span>
                  </div>
                )}
                {goal && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span>Goal: <span className="text-foreground">{goal}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-3 w-3 text-primary shrink-0" />
                  <span>
                    Personality:{" "}
                    <span className="text-foreground capitalize">{selectedPersonality}</span>
                  </span>
                </div>
                {selectedRules.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    <span>
                      Rules activated:{" "}
                      <span className="text-foreground">{selectedRules.length}</span>
                    </span>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-primary text-lg py-6"
                onClick={handleComplete}
                disabled={isSubmitting}
                style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.5)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up DJ...
                  </>
                ) : (
                  <>
                    Start Using DJ <ChevronRight className="ml-1 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="hover:text-primary"
          target="_blank"
          rel="noreferrer"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </div>
  );
}
