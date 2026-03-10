import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlignLeft,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  GraduationCap,
  Loader2,
  Mic,
  MicOff,
  Settings,
  Smile,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useAddMemory,
  useDeleteBehaviorRule,
  useGetRulesOrdered,
  useMemories,
  usePersonalitySettings,
  useSetBehaviorRule,
  useSetPersonalitySettings,
  useUpdateRulePriority,
  useUpdateUserProfile,
  useUserProfile,
} from "../hooks/useQueries";
import { Link } from "../lib/router-shim";

interface SpeechRecognitionEvent {
  results: { [key: number]: { [key: number]: { transcript: string } } };
}

const PERSONALITIES = [
  {
    id: "professional",
    label: "Professional",
    icon: Briefcase,
    desc: "Formal, structured, task-focused",
    rules: [
      "Use formal language always",
      "Start with the key point",
      "Provide structured responses with clear sections",
    ],
  },
  {
    id: "friendly",
    label: "Friendly",
    icon: Smile,
    desc: "Warm, supportive, approachable",
    rules: [
      "Use warm and encouraging tone",
      "Add supportive acknowledgments",
      "Be conversational and personal",
    ],
  },
  {
    id: "witty",
    label: "Witty",
    icon: Zap,
    desc: "Sharp, clever, with humor",
    rules: [
      "Include clever observations when appropriate",
      "Use wordplay and humor occasionally",
      "Be insightful and entertaining",
    ],
  },
  {
    id: "concise",
    label: "Concise",
    icon: AlignLeft,
    desc: "Brief, direct, no filler",
    rules: [
      "Keep all responses under 3 sentences",
      "Use bullet points only",
      "No preamble or filler phrases",
    ],
  },
  {
    id: "mentor",
    label: "Mentor",
    icon: GraduationCap,
    desc: "Guiding, educational, thoughtful",
    rules: [
      "Explain the reasoning behind every answer",
      "Provide step-by-step guidance",
      "Give examples to illustrate concepts",
    ],
  },
  {
    id: "motivator",
    label: "Motivator",
    icon: Flame,
    desc: "Energetic, encouraging, action-oriented",
    rules: [
      "Use energetic and uplifting language",
      "End every response with a next action step",
      "Celebrate progress and effort",
    ],
  },
];

const RULE_TEMPLATES = [
  {
    id: "business",
    name: "Business Mode",
    emoji: "🏢",
    desc: "Formal, structured, data-driven",
    rules: [
      "Use formal language and professional tone",
      "Structure responses with clear headings",
      "Support statements with data when available",
      "Start every response with the key takeaway",
    ],
  },
  {
    id: "creative",
    name: "Creative Mode",
    emoji: "🎨",
    desc: "Imaginative, exploratory, experimental",
    rules: [
      "Use vivid metaphors and analogies",
      "Explore unconventional ideas and perspectives",
      "Encourage creative experimentation",
      "Embrace ambiguity and open-ended thinking",
    ],
  },
  {
    id: "quick",
    name: "Quick Mode",
    emoji: "⚡",
    desc: "Ultra-brief, bullet points only",
    rules: [
      "Respond only in bullet points",
      "Maximum 3 items per response",
      "No preamble, no filler, no pleasantries",
    ],
  },
  {
    id: "teacher",
    name: "Teacher Mode",
    emoji: "📚",
    desc: "Step-by-step, thorough, with examples",
    rules: [
      "Break down every answer step by step",
      "Define all technical terms simply",
      "Give at least one concrete example per concept",
      "Check understanding by summarizing key points",
    ],
  },
];

const QUICK_RULE_SHORTCUTS = [
  "Always respond in bullet points",
  "Keep responses under 3 sentences",
  "Use formal language",
  "Always greet me by name",
  "Explain technical terms simply",
  "Give examples in every response",
  "Start with the most important point",
  "End with next action steps",
];

const WORK_STYLES = [
  { value: "solo", label: "Solo" },
  { value: "collaborative", label: "Collaborative" },
  { value: "mixed", label: "Mixed" },
];

export function SettingsPage() {
  const { data: profile } = useUserProfile();
  const { data: personality } = usePersonalitySettings();
  const { data: rulesOrdered = [] } = useGetRulesOrdered();
  const { data: memories = [] } = useMemories();
  const updateProfile = useUpdateUserProfile();
  const setPersonalityFn = useSetPersonalitySettings();
  const setBehaviorRule = useSetBehaviorRule();
  const updateRulePriority = useUpdateRulePriority();
  const deleteRule = useDeleteBehaviorRule();
  const addMemory = useAddMemory();

  // Profile form state
  const [editName, setEditName] = useState(profile?.name || "");
  const [editProfession, setEditProfession] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editInterests, setEditInterests] = useState("");
  const [editWorkStyle, setEditWorkStyle] = useState("solo");
  const [editProjects, setEditProjects] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Response style state
  const [formalitySlider, setFormalitySlider] = useState([50]);
  const [lengthSlider, setLengthSlider] = useState([50]);
  const [useMarkdown, setUseMarkdown] = useState(false);
  const [includeExamples, setIncludeExamples] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  // Voice to rule state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isSavingVoiceRule, setIsSavingVoiceRule] = useState(false);

  // Applied templates tracker
  const [appliedTemplates, setAppliedTemplates] = useState<string[]>([]);
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);

  // Active personality
  const [activePersonality, setActivePersonality] = useState(
    personality?.communicationStyle || "professional",
  );

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || "");
    }
  }, [profile]);

  useEffect(() => {
    if (personality) {
      setActivePersonality(personality.communicationStyle);
    }
  }, [personality]);

  const handlePersonalitySelect = async (id: string) => {
    setActivePersonality(id);
    const p = PERSONALITIES.find((p) => p.id === id);
    if (!p) return;
    try {
      await setPersonalityFn.mutateAsync(id);
      // Apply personality bundle rules
      for (let i = 0; i < p.rules.length; i++) {
        await setBehaviorRule.mutateAsync({
          ruleText: p.rules[i],
          priority: BigInt(rulesOrdered.length + i + 1),
        });
      }
      toast.success(`${p.label} mode activated`);
    } catch (_e) {
      toast.error("Failed to apply personality");
    }
  };

  const handleApplyTemplate = async (template: (typeof RULE_TEMPLATES)[0]) => {
    setApplyingTemplate(template.id);
    try {
      for (let i = 0; i < template.rules.length; i++) {
        await setBehaviorRule.mutateAsync({
          ruleText: template.rules[i],
          priority: BigInt(rulesOrdered.length + i + 1),
        });
      }
      setAppliedTemplates((prev) => [...prev, template.id]);
      toast.success(
        `${template.name} applied — ${template.rules.length} rules added`,
      );
    } catch (_e) {
      toast.error("Failed to apply template");
    } finally {
      setApplyingTemplate(null);
    }
  };

  const handleQuickRuleToggle = async (ruleText: string) => {
    const isActive = rulesOrdered.some((r) => r.ruleText === ruleText);
    if (!isActive) {
      try {
        await setBehaviorRule.mutateAsync({
          ruleText,
          priority: BigInt(rulesOrdered.length + 1),
        });
        toast.success("Rule added");
      } catch (_e) {
        toast.error("Failed to add rule");
      }
    } else {
      toast.info(
        "This rule is already active. Visit the rules list below to remove it.",
      );
    }
  };

  const handleSaveStyleSettings = async () => {
    const rules: string[] = [];
    if (formalitySlider[0] < 30)
      rules.push("Use casual, conversational language");
    else if (formalitySlider[0] > 70)
      rules.push("Use formal, professional language");
    if (lengthSlider[0] < 30)
      rules.push("Keep responses very brief — one sentence max");
    else if (lengthSlider[0] > 70)
      rules.push("Provide detailed, comprehensive responses");
    if (useMarkdown) rules.push("Always use markdown formatting in responses");
    if (includeExamples)
      rules.push("Include relevant examples in every response");
    if (showConfidence)
      rules.push("Indicate your confidence level at the end of each response");

    try {
      for (let i = 0; i < rules.length; i++) {
        await setBehaviorRule.mutateAsync({
          ruleText: rules[i],
          priority: BigInt(rulesOrdered.length + i + 1),
        });
      }
      toast.success("Style settings saved as rules");
    } catch (_e) {
      toast.error("Failed to save settings");
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const preferences = [
        editProfession && `Profession: ${editProfession}`,
        editLocation && `Location: ${editLocation}`,
        editGoal && `Main goal: ${editGoal}`,
        editInterests && `Interests: ${editInterests}`,
        editWorkStyle && `Work style: ${editWorkStyle}`,
        editProjects && `Current projects: ${editProjects}`,
      ]
        .filter(Boolean)
        .join(". ");

      await updateProfile.mutateAsync({
        name: editName || profile?.name || "User",
        preferences,
        personalitySettings: { communicationStyle: activePersonality },
        onboardingComplete: profile?.onboardingComplete ?? true,
      });

      // Also save key details as memories
      const memoryItems = [
        editProfession && `My profession is ${editProfession}`,
        editGoal && `My main goal is ${editGoal}`,
        editInterests && `My interests include ${editInterests}`,
        editProjects && `My current projects: ${editProjects}`,
      ].filter(Boolean) as string[];

      for (const item of memoryItems) {
        await addMemory.mutateAsync(item);
      }

      toast.success("Profile saved and DJ updated!");
    } catch (_e) {
      toast.error("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleMoveRule = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === rulesOrdered.length - 1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const ruleA = rulesOrdered[index];
    const ruleB = rulesOrdered[swapIndex];

    try {
      await Promise.all([
        updateRulePriority.mutateAsync({
          id: ruleA.id,
          newPriority: ruleB.priority,
        }),
        updateRulePriority.mutateAsync({
          id: ruleB.id,
          newPriority: ruleA.priority,
        }),
      ]);
    } catch (_e) {
      toast.error("Failed to reorder rules");
    }
  };

  const handleDeleteRule = async (id: bigint) => {
    try {
      await deleteRule.mutateAsync(id);
      toast.success("Rule removed");
    } catch (_e) {
      toast.error("Failed to delete rule");
    }
  };

  const startVoiceCapture = useCallback(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition error");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, []);

  const handleSaveVoiceRule = async () => {
    if (!voiceTranscript.trim()) return;
    setIsSavingVoiceRule(true);
    try {
      await setBehaviorRule.mutateAsync({
        ruleText: voiceTranscript.trim(),
        priority: BigInt(rulesOrdered.length + 1),
      });
      toast.success("Voice rule saved!");
      setVoiceTranscript("");
    } catch (_e) {
      toast.error("Failed to save rule");
    } finally {
      setIsSavingVoiceRule(false);
    }
  };

  const initials = (profile?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const Section = ({
    title,
    children,
  }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground border-b border-primary/20 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl space-y-10 px-4 py-8">
        <div>
          <h1 className="glow-text font-display text-3xl font-bold">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure DJ's personality, rules, and your profile
          </p>
        </div>

        {/* ─── Section A: DJ Profile Card ─── */}
        <Section title="DJ Profile Card">
          <div
            className="rounded-xl border border-primary/30 bg-gradient-to-br from-card to-muted/30 p-6"
            style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.15)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-display text-xl font-bold text-primary"
                style={{ boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.5)" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-xl font-bold truncate">
                    {profile?.name || "User"}
                  </p>
                  <Badge className="bg-primary/20 text-primary border-primary/40 capitalize">
                    {activePersonality}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{rulesOrdered.length} rules active</span>
                  <span>{memories.length} memories stored</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── Section B: DJ Mood Board ─── */}
        <Section title="DJ Mood Board">
          <p className="text-sm text-muted-foreground">
            Choose DJ's personality style. Selecting one applies a matching rule
            bundle.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PERSONALITIES.map(({ id, label, icon: Icon, desc }) => {
              const isActive = activePersonality === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handlePersonalitySelect(id)}
                  className={`relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all ${
                    isActive
                      ? "border-primary bg-primary/15"
                      : "border-muted bg-card/30 hover:border-primary/40"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.35)" }
                      : {}
                  }
                >
                  {isActive && (
                    <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${isActive ? "bg-primary/25" : "bg-muted"}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${isActive ? "text-primary" : ""}`}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ─── Section C: Rule Template Library ─── */}
        <Section title="Rule Template Library">
          <p className="text-sm text-muted-foreground">
            Apply a pre-built rule pack in one tap.
          </p>
          <div className="space-y-3">
            {RULE_TEMPLATES.map((template) => {
              const applied = appliedTemplates.includes(template.id);
              return (
                <div
                  key={template.id}
                  className="rounded-lg border border-muted bg-card/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{template.emoji}</span>
                        <p className="font-semibold">{template.name}</p>
                        {applied && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            Applied
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {template.desc}
                      </p>
                      <ul className="mt-2 space-y-0.5">
                        {template.rules.map((rule) => (
                          <li
                            key={rule}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                          >
                            <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      size="sm"
                      variant={applied ? "outline" : "default"}
                      className={
                        applied
                          ? "border-primary/40 text-primary"
                          : "bg-primary"
                      }
                      onClick={() => handleApplyTemplate(template)}
                      disabled={applyingTemplate === template.id}
                    >
                      {applyingTemplate === template.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : applied ? (
                        "Re-apply"
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─── Section D: Quick Rule Shortcuts ─── */}
        <Section title="Quick Rule Shortcuts">
          <p className="text-sm text-muted-foreground">
            Tap to add a common rule instantly.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {QUICK_RULE_SHORTCUTS.map((rule) => {
              const isActive = rulesOrdered.some((r) => r.ruleText === rule);
              return (
                <button
                  key={rule}
                  type="button"
                  onClick={() => handleQuickRuleToggle(rule)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                    isActive
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-muted bg-card/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.25)" }
                      : {}
                  }
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isActive ? "border-primary bg-primary" : "border-muted"}`}
                  >
                    {isActive && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  {rule}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ─── Section E: Response Style Sliders ─── */}
        <Section title="Response Style">
          <div className="space-y-6 rounded-lg border border-muted bg-card/30 p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Casual</span>
                <Label className="text-foreground">Formality</Label>
                <span className="text-muted-foreground">Formal</span>
              </div>
              <Slider
                value={formalitySlider}
                onValueChange={setFormalitySlider}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Brief</span>
                <Label className="text-foreground">Response Length</Label>
                <span className="text-muted-foreground">Detailed</span>
              </div>
              <Slider
                value={lengthSlider}
                onValueChange={setLengthSlider}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Always use markdown formatting",
                  value: useMarkdown,
                  onChange: setUseMarkdown,
                },
                {
                  label: "Include relevant examples",
                  value: includeExamples,
                  onChange: setIncludeExamples,
                },
                {
                  label: "Show confidence level",
                  value: showConfidence,
                  onChange: setShowConfidence,
                },
              ].map(({ label, value, onChange }) => (
                <div key={label} className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    {label}
                  </Label>
                  <Switch checked={value} onCheckedChange={onChange} />
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-primary/80 hover:bg-primary"
              onClick={handleSaveStyleSettings}
            >
              Save Style as Rules
            </Button>
          </div>
        </Section>

        {/* ─── Section F: About You Form ─── */}
        <Section title="Tell DJ About Yourself">
          <div className="space-y-4 rounded-lg border border-muted bg-card/30 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Your Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border-primary/30 bg-card/50"
                  placeholder="e.g. Alex"
                />
              </div>
              <div className="space-y-1">
                <Label>Profession / Role</Label>
                <Input
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  className="border-primary/30 bg-card/50"
                  placeholder="e.g. Designer"
                />
              </div>
              <div className="space-y-1">
                <Label>
                  Location{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="border-primary/30 bg-card/50"
                  placeholder="e.g. London"
                />
              </div>
              <div className="space-y-1">
                <Label>Main Goal</Label>
                <Input
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="border-primary/30 bg-card/50"
                  placeholder="e.g. Launch my startup"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Key Interests</Label>
              <Textarea
                value={editInterests}
                onChange={(e) => setEditInterests(e.target.value)}
                className="border-primary/30 bg-card/50"
                placeholder="e.g. AI, fitness, jazz music..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Work Style</Label>
              <div className="flex gap-2">
                {WORK_STYLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditWorkStyle(value)}
                    className={`rounded-md border px-4 py-2 text-sm transition-all ${
                      editWorkStyle === value
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-muted text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Current Projects</Label>
              <Textarea
                value={editProjects}
                onChange={(e) => setEditProjects(e.target.value)}
                className="border-primary/30 bg-card/50"
                placeholder="e.g. Building a SaaS app, writing a book..."
                rows={2}
              />
            </div>
            <Button
              className="w-full bg-primary"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              style={{ boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.3)" }}
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save & Teach DJ"
              )}
            </Button>
          </div>
        </Section>

        {/* ─── Section G: Voice-to-Rule Capture ─── */}
        <Section title="Voice-to-Rule Capture">
          <div className="rounded-lg border border-muted bg-card/30 p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Speak a rule naturally and DJ will save it. Say things like "I
              like short answers" or "always be direct."
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={startVoiceCapture}
                disabled={isListening}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all ${
                  isListening
                    ? "border-primary bg-primary/20 animate-pulse"
                    : "border-primary/50 bg-card hover:border-primary hover:bg-primary/10"
                }`}
                style={{
                  boxShadow: isListening
                    ? "0 0 20px oklch(0.65 0.25 220 / 0.6)"
                    : "",
                }}
              >
                {isListening ? (
                  <MicOff className="h-7 w-7 text-primary" />
                ) : (
                  <Mic className="h-7 w-7 text-primary" />
                )}
              </button>
              <p className="text-sm text-muted-foreground">
                {isListening
                  ? "Listening... speak your rule"
                  : "Tap to speak a rule"}
              </p>
            </div>
            {voiceTranscript && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Transcribed rule:
                </p>
                <p className="text-sm font-medium">"{voiceTranscript}"</p>
                <Button
                  className="mt-3 w-full bg-primary"
                  size="sm"
                  onClick={handleSaveVoiceRule}
                  disabled={isSavingVoiceRule}
                >
                  {isSavingVoiceRule ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save as Rule"
                  )}
                </Button>
              </div>
            )}
          </div>
        </Section>

        {/* ─── Section H: Drag-to-Prioritize Rules ─── */}
        <Section title="Prioritize Rules">
          <p className="text-sm text-muted-foreground">
            Use the arrows to reorder rules by importance. DJ follows
            higher-priority rules first when there's a conflict.
          </p>
          {rulesOrdered.length === 0 ? (
            <div className="rounded-lg border border-muted bg-card/30 p-6 text-center text-muted-foreground text-sm">
              No rules yet. Add some using the shortcuts above or via Chat.
            </div>
          ) : (
            <div className="space-y-2">
              {rulesOrdered.map((rule, index) => (
                <div
                  key={rule.id.toString()}
                  className="flex items-center gap-3 rounded-lg border border-muted bg-card/40 px-4 py-3"
                >
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMoveRule(index, "up")}
                      disabled={index === 0}
                      className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveRule(index, "down")}
                      disabled={index === rulesOrdered.length - 1}
                      className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-sm min-w-0 truncate">
                    {rule.ruleText}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Footer links */}
        <div className="flex justify-center gap-6 pb-8 text-sm text-muted-foreground">
          <Link
            to="/teach"
            className="flex items-center gap-1 hover:text-primary"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Teach DJ (Story Mode)
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-1 hover:text-primary"
          >
            <Users className="h-3.5 w-3.5" />
            View Profile
          </Link>
          <Link to="/" className="flex items-center gap-1 hover:text-primary">
            <Settings className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>

        {/* Caffeine footer */}
        <div className="pb-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </Layout>
  );
}
