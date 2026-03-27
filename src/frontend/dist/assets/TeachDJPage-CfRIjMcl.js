import { a2 as useNavigate, u as useUserProfile, e as useBehaviorRules, $ as useUpdateUserProfile, w as useAddMemory, z as useSetBehaviorRule, r as reactExports, j as jsxRuntimeExports, k as ue } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Layout, B as Brain } from "./Layout-y-fTRwTO.js";
import { m as motion, A as AnimatePresence } from "./proxy-CDDWEtkX.js";
import { C as Check } from "./check-CyKGSNZc.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { S as Send } from "./send-YzF6jtlA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
const QUESTIONS = [
  { key: "name", question: "What's your name? I want to greet you properly." },
  {
    key: "work",
    question: "What do you do for work? This helps me give you more relevant answers."
  },
  { key: "interests", question: "What are your main interests or hobbies?" },
  {
    key: "responseStyle",
    question: "How do you prefer I respond — brief and direct, or detailed with examples?"
  },
  { key: "goal", question: "What's your most important goal right now?" },
  {
    key: "rule",
    question: "Any rules you'd like me to always follow? For example: 'always be direct', 'always give examples', 'keep it short'."
  }
];
function TeachDJPage() {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: rules = [] } = useBehaviorRules();
  const updateProfile = useUpdateUserProfile();
  const addMemory = useAddMemory();
  const setBehaviorRule = useSetBehaviorRule();
  const [messages, setMessages] = reactExports.useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = reactExports.useState(0);
  const [input, setInput] = reactExports.useState("");
  const [isTyping, setIsTyping] = reactExports.useState(false);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isComplete, setIsComplete] = reactExports.useState(false);
  const [answers, setAnswers] = reactExports.useState({});
  const messagesEndRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const hasStarted = reactExports.useRef(false);
  const profileNameRef = reactExports.useRef(void 0);
  profileNameRef.current = profile == null ? void 0 : profile.name;
  reactExports.useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const timer = setTimeout(() => {
      var _a;
      const name = profileNameRef.current;
      const greeting = name ? `Hello ${name}! I'm here to learn more about you so I can serve you better. Let's have a quick conversation. ${QUESTIONS[0].question}` : `Hello! I'm ready to learn more about you. Let's have a quick conversation. ${QUESTIONS[0].question}`;
      setMessages([{ id: "intro", role: "dj", content: greeting }]);
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  reactExports.useEffect(() => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  const addDJMessage = (content) => {
    setIsTyping(true);
    setTimeout(
      () => {
        setMessages((prev) => [
          ...prev,
          { id: `dj-${Date.now()}`, role: "dj", content }
        ]);
        setIsTyping(false);
        setTimeout(() => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.focus();
        }, 100);
      },
      800 + Math.random() * 500
    );
  };
  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userAnswer = input.trim();
    setInput("");
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userAnswer
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentQ = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [currentQ.key]: userAnswer }));
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      const confirmations = [
        "Got it! I'll remember that.",
        "Perfect, noted.",
        "Understood, I've filed that away.",
        "Great, I'll keep that in mind.",
        "Excellent, thank you for sharing."
      ];
      const confirmation = confirmations[Math.floor(Math.random() * confirmations.length)];
      addDJMessage(`${confirmation} ${QUESTIONS[nextIndex].question}`);
    } else {
      setCurrentQuestionIndex(QUESTIONS.length);
      addDJMessage(
        "That's everything I need! I now have a much better picture of who you are and how to help you. Tap the button below to save all of this to my memory."
      );
      setTimeout(() => setIsComplete(true), 500);
    }
  };
  const handleSaveToMemory = async () => {
    setIsSaving(true);
    try {
      const memoryItems = [];
      if (answers.name) memoryItems.push(`My name is ${answers.name}`);
      if (answers.work) memoryItems.push(`I work as: ${answers.work}`);
      if (answers.interests)
        memoryItems.push(`My interests include: ${answers.interests}`);
      if (answers.goal)
        memoryItems.push(`My current main goal is: ${answers.goal}`);
      if (answers.responseStyle)
        memoryItems.push(
          `My preferred response style: ${answers.responseStyle}`
        );
      for (const item of memoryItems) {
        await addMemory.mutateAsync(item);
      }
      if (answers.rule) {
        await setBehaviorRule.mutateAsync({
          ruleText: answers.rule,
          priority: BigInt(rules.length + 1)
        });
      }
      if (answers.name && profile) {
        await updateProfile.mutateAsync({
          name: answers.name,
          preferences: profile.preferences || "",
          personalitySettings: profile.personalitySettings || JSON.stringify({ communicationStyle: "professional" }),
          onboardingComplete: profile.onboardingComplete
        });
      }
      ue.success("Saved to DJ's memory!");
      navigate("/");
    } catch (_e) {
      ue.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const answerSummary = [
    answers.name && { label: "Name", value: answers.name },
    answers.work && { label: "Work", value: answers.work },
    answers.interests && { label: "Interests", value: answers.interests },
    answers.responseStyle && {
      label: "Response style",
      value: answers.responseStyle
    },
    answers.goal && { label: "Goal", value: answers.goal },
    answers.rule && { label: "Custom rule", value: answers.rule }
  ].filter(Boolean);
  const progressDisplay = isComplete ? QUESTIONS.length : Math.min(currentQuestionIndex + 1, QUESTIONS.length);
  const progressPct = Math.min(
    currentQuestionIndex / QUESTIONS.length * 100,
    100
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[calc(100vh-4rem)] flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-primary/20 bg-card/80 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate(-1),
          className: "h-8 w-8 shrink-0",
          "data-ocid": "teach.button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold", children: "Teach DJ — Story Mode" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-20 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "h-full bg-primary",
            animate: { width: `${progressPct}%` },
            transition: { duration: 0.4 },
            style: { boxShadow: "0 0 6px oklch(0.65 0.25 220 / 0.8)" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          progressDisplay,
          "/",
          QUESTIONS.length
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "border border-primary/40 bg-primary/15" : "border border-secondary/40 bg-card/80"}`,
              style: msg.role === "dj" ? { boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.2)" } : { boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.25)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: msg.role === "user" ? "default" : "secondary",
                    className: "text-xs",
                    children: msg.role === "user" ? "You" : "DJ"
                  }
                ) }),
                msg.content
              ]
            }
          )
        },
        msg.id
      )) }),
      isTyping && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "flex justify-start",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl border border-secondary/40 bg-card/80 px-4 py-3",
              style: { boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.2)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "h-1.5 w-1.5 rounded-full bg-secondary",
                  animate: { opacity: [0.4, 1, 0.4] },
                  transition: {
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2
                  }
                },
                i
              )) })
            }
          )
        }
      ),
      isComplete && answerSummary.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 },
          className: "rounded-xl border border-primary/30 bg-gradient-to-br from-card to-muted/30 p-5",
          style: { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.15)" },
          "data-ocid": "teach.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 font-display text-sm font-bold text-primary", children: "Here's what I learned about you:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: answerSummary.map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 shrink-0 text-primary mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                label,
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: value })
            ] }, label)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "mt-4 w-full bg-primary",
                onClick: handleSaveToMemory,
                disabled: isSaving,
                style: { boxShadow: "0 0 12px oklch(0.65 0.25 220 / 0.4)" },
                "data-ocid": "teach.submit_button",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  " Saving to DJ's Memory..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "mr-2 h-4 w-4" }),
                  " Save to DJ's Memory"
                ] })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }) }),
    !isComplete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          ref: inputRef,
          placeholder: "Type your answer...",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && handleSend(),
          className: "flex-1 border-primary/40 bg-card/50",
          disabled: isTyping,
          "data-ocid": "teach.input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSend,
          disabled: !input.trim() || isTyping,
          className: "shrink-0 bg-primary",
          "data-ocid": "teach.submit_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
        }
      )
    ] }) })
  ] }) });
}
export {
  TeachDJPage
};
