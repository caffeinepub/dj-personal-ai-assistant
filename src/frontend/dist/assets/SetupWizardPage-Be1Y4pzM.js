import { a2 as useNavigate, u as useUserProfile, e as useBehaviorRules, ae as useCreateUserProfile, $ as useUpdateUserProfile, z as useSetBehaviorRule, r as reactExports, j as jsxRuntimeExports, k as ue } from "./index-D4lUgCCM.js";
import { B as Button } from "./createLucideIcon-a11X8bAo.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { T as Textarea } from "./textarea-a_o-YPgo.js";
import { C as Check } from "./check-CyKGSNZc.js";
import { m as motion, A as AnimatePresence, G as GraduationCap } from "./proxy-CDDWEtkX.js";
import { C as ChevronRight } from "./chevron-right-v95zRAxR.js";
import { B as Briefcase, S as Smile, A as AlignLeft, F as Flame } from "./smile-Bil1VTXA.js";
import { Z as Zap } from "./zap-CRDejI0C.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
const PERSONALITIES = [
  {
    id: "professional",
    label: "Professional",
    icon: Briefcase,
    desc: "Formal, structured, data-driven"
  },
  {
    id: "friendly",
    label: "Friendly",
    icon: Smile,
    desc: "Warm, approachable, supportive"
  },
  { id: "witty", label: "Witty", icon: Zap, desc: "Sharp, clever, with humor" },
  {
    id: "concise",
    label: "Concise",
    icon: AlignLeft,
    desc: "Brief, direct, no fluff"
  },
  {
    id: "mentor",
    label: "Mentor",
    icon: GraduationCap,
    desc: "Guiding, thoughtful, educational"
  },
  {
    id: "motivator",
    label: "Motivator",
    icon: Flame,
    desc: "Energetic, encouraging, action-oriented"
  }
];
const QUICK_RULES = [
  { id: "bullets", text: "Always respond in bullet points" },
  { id: "brief", text: "Keep responses brief and to the point" },
  { id: "formal", text: "Use formal language at all times" },
  { id: "greet", text: "Always greet me by my name" },
  { id: "examples", text: "Give examples in every response" }
];
const STEPS = [
  "Welcome",
  "About You",
  "Personality",
  "Quick Rules",
  "All Set!"
];
function SetupWizardPage() {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: rules = [] } = useBehaviorRules();
  const createProfile = useCreateUserProfile();
  const updateProfile = useUpdateUserProfile();
  const setBehaviorRule = useSetBehaviorRule();
  const [step, setStep] = reactExports.useState(0);
  const [name, setName] = reactExports.useState((profile == null ? void 0 : profile.name) || "");
  const [profession, setProfession] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [goal, setGoal] = reactExports.useState("");
  const [selectedPersonality, setSelectedPersonality] = reactExports.useState("professional");
  const [selectedRules, setSelectedRules] = reactExports.useState([]);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleSkip = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleComplete = async () => {
    var _a;
    setIsSubmitting(true);
    try {
      if (!profile) {
        await createProfile.mutateAsync(name || "User");
      }
      const preferences = [
        profession && `Profession: ${profession}`,
        location && `Location: ${location}`,
        goal && `Main goal: ${goal}`
      ].filter(Boolean).join(". ");
      await updateProfile.mutateAsync({
        name: name || (profile == null ? void 0 : profile.name) || "User",
        preferences,
        personalitySettings: JSON.stringify({
          communicationStyle: selectedPersonality
        }),
        onboardingComplete: true
      });
      for (let i = 0; i < selectedRules.length; i++) {
        const ruleText = (_a = QUICK_RULES.find(
          (r) => r.id === selectedRules[i]
        )) == null ? void 0 : _a.text;
        if (ruleText) {
          await setBehaviorRule.mutateAsync({
            ruleText,
            priority: BigInt(rules.length + i + 1)
          });
        }
      }
      ue.success("DJ is ready! Welcome aboard.");
      navigate("/");
    } catch (err) {
      console.error("[SetupWizard] handleComplete error:", err);
      ue.error("Setup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleRule = (id) => {
    setSelectedRules(
      (prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8",
      style: {
        background: "radial-gradient(ellipse at 50% 0%, oklch(0.12 0.05 220) 0%, oklch(0 0 0) 70%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none fixed inset-0 opacity-[0.04]",
            style: {
              backgroundImage: "linear-gradient(oklch(0.65 0.25 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.25 220) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 w-full max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex justify-between", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all ${i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary text-primary" : "border-muted text-muted-foreground"}`,
                style: i === step ? { boxShadow: "0 0 10px oklch(0.65 0.25 220 / 0.6)" } : {},
                children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) : i + 1
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-[10px] text-muted-foreground sm:block", children: s })
          ] }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "h-full rounded-full bg-primary",
              style: { boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.8)" },
              initial: { width: "0%" },
              animate: { width: `${step / (STEPS.length - 1) * 100}%` },
              transition: { duration: 0.4 }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 },
            transition: { duration: 0.3 },
            className: "w-full max-w-md",
            children: [
              step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10",
                    style: { boxShadow: "0 0 30px oklch(0.65 0.25 220 / 0.5)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "glow-text font-display text-3xl font-bold", children: "DJ" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Hello, I'm DJ" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Your personal AI assistant. Let's get to know each other so I can serve you better." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-muted-foreground", children: "What should I call you?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "Your name...",
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      className: "border-primary/40 bg-card/50 text-center text-lg",
                      autoFocus: true,
                      onKeyDown: (e) => e.key === "Enter" && name.trim() && handleNext()
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      className: "flex-1 text-muted-foreground",
                      onClick: handleSkip,
                      children: "Skip"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "flex-1 bg-primary",
                      onClick: handleNext,
                      disabled: !name.trim(),
                      style: { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.4)" },
                      children: [
                        "Let's Begin ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
                      ]
                    }
                  )
                ] })
              ] }),
              step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "glow-text-cyan font-display text-2xl font-bold", children: [
                    "Tell me about yourself",
                    name ? `, ${name}` : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "This helps me give you more relevant and personalized answers." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "What do you do for work?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: "e.g. Software Engineer, Doctor, Teacher...",
                        value: profession,
                        onChange: (e) => setProfession(e.target.value),
                        className: "border-primary/30 bg-card/50"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                      "Where are you based?",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "(optional)" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: "e.g. New York, London...",
                        value: location,
                        onChange: (e) => setLocation(e.target.value),
                        className: "border-primary/30 bg-card/50"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "What's your most important goal right now?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        placeholder: "e.g. Launch my startup, learn to code, manage my team better...",
                        value: goal,
                        onChange: (e) => setGoal(e.target.value),
                        className: "border-primary/30 bg-card/50",
                        rows: 3
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      className: "flex-1 text-muted-foreground",
                      onClick: handleSkip,
                      children: "Skip"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 bg-primary", onClick: handleNext, children: [
                    "Continue ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
                  ] })
                ] })
              ] }),
              step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "glow-text-cyan font-display text-2xl font-bold", children: "How should I talk to you?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Choose a personality style. You can change this anytime." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: PERSONALITIES.map(({ id, label, icon: Icon, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedPersonality(id),
                    className: `relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all ${selectedPersonality === id ? "border-primary bg-primary/15" : "border-muted bg-card/30 hover:border-primary/40"}`,
                    style: selectedPersonality === id ? { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.35)" } : {},
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `flex h-8 w-8 items-center justify-center rounded-md ${selectedPersonality === id ? "bg-primary/30" : "bg-muted"}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Icon,
                            {
                              className: `h-4 w-4 ${selectedPersonality === id ? "text-primary" : "text-muted-foreground"}`
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: `font-semibold text-sm ${selectedPersonality === id ? "text-primary" : ""}`,
                            children: label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
                      ] }),
                      selectedPersonality === id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "absolute top-2 right-2 h-3 w-3 text-primary" })
                    ]
                  },
                  id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      className: "flex-1 text-muted-foreground",
                      onClick: handleSkip,
                      children: "Skip"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 bg-primary", onClick: handleNext, children: [
                    "Continue ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
                  ] })
                ] })
              ] }),
              step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "glow-text-cyan font-display text-2xl font-bold", children: "Quick rules setup" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Tap to activate rules that DJ should always follow." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: QUICK_RULES.map(({ id, text }) => {
                  const active = selectedRules.includes(id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleRule(id),
                      className: `flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${active ? "border-primary bg-primary/15 text-foreground" : "border-muted bg-card/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                      style: active ? { boxShadow: "0 0 10px oklch(0.65 0.25 220 / 0.3)" } : {},
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: `flex h-5 w-5 shrink-0 items-center justify-center rounded border ${active ? "border-primary bg-primary" : "border-muted"}`,
                            children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary-foreground" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: text })
                      ]
                    },
                    id
                  );
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      className: "flex-1 text-muted-foreground",
                      onClick: handleSkip,
                      children: "Skip"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1 bg-primary", onClick: handleNext, children: [
                    "Continue ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
                  ] })
                ] })
              ] }),
              step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10",
                    style: { boxShadow: "0 0 30px oklch(0.65 0.25 220 / 0.6)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-10 w-10 text-primary" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "glow-text font-display text-2xl font-bold", children: "You're all set!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Here's what DJ has learned about you:" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-card/50 p-4 text-left space-y-2", children: [
                  name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Name: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: name })
                    ] })
                  ] }),
                  profession && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Profession:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: profession })
                    ] })
                  ] }),
                  goal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Goal: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: goal })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Personality:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground capitalize", children: selectedPersonality })
                    ] })
                  ] }),
                  selectedRules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Rules activated:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: selectedRules.length })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "w-full bg-primary text-lg py-6",
                    onClick: handleComplete,
                    disabled: isSubmitting,
                    style: { boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.5)" },
                    children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
                      "Setting up DJ..."
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      "Start Using DJ ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-5 w-5" })
                    ] })
                  }
                )
              ] })
            ]
          },
          step
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
              className: "hover:text-primary",
              target: "_blank",
              rel: "noreferrer",
              children: "Built with love using caffeine.ai"
            }
          )
        ] })
      ]
    }
  );
}
export {
  SetupWizardPage
};
