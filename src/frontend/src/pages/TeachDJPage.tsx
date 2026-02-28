import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { motion, AnimatePresence } from "motion/react";
import {
  useUserProfile,
  useUpdateUserProfile,
  useAddMemory,
  useSetBehaviorRule,
  useBehaviorRules,
} from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Check, ArrowLeft, Brain } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "dj" | "user";
  content: string;
}

const QUESTIONS = [
  { key: "name", question: "What's your name? I want to greet you properly." },
  { key: "work", question: "What do you do for work? This helps me give you more relevant answers." },
  { key: "interests", question: "What are your main interests or hobbies?" },
  { key: "responseStyle", question: "How do you prefer I respond — brief and direct, or detailed with examples?" },
  { key: "goal", question: "What's your most important goal right now?" },
  { key: "rule", question: "Any rules you'd like me to always follow? For example: 'always be direct', 'always give examples', 'keep it short'." },
];

export function TeachDJPage() {
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: rules = [] } = useBehaviorRules();
  const updateProfile = useUpdateUserProfile();
  const addMemory = useAddMemory();
  const setBehaviorRule = useSetBehaviorRule();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Start with DJ's first question (run once on mount)
  const profileName = profile?.name;
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = profileName
        ? `Hello ${profileName}! I'm here to learn more about you so I can serve you better. Let's have a quick conversation. ${QUESTIONS[0].question}`
        : `Hello! I'm ready to learn more about you. Let's have a quick conversation. ${QUESTIONS[0].question}`;
      setMessages([{ id: "intro", role: "dj", content: greeting }]);
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, [profileName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addDJMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `dj-${Date.now()}`, role: "dj", content },
      ]);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 800 + Math.random() * 500);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userAnswer = input.trim();
    setInput("");

    // Add user message
    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: userAnswer };
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
        "Excellent, thank you for sharing.",
      ];
      const confirmation = confirmations[Math.floor(Math.random() * confirmations.length)];
      addDJMessage(`${confirmation} ${QUESTIONS[nextIndex].question}`);
    } else {
      // All questions answered
      setCurrentQuestionIndex(QUESTIONS.length);
      addDJMessage(
        "That's everything I need! I now have a much better picture of who you are and how to help you. Tap the button below to save all of this to my memory."
      );
      setTimeout(() => setIsComplete(true), 2000);
    }
  };

  const handleSaveToMemory = async () => {
    setIsSaving(true);
    try {
      const memoryItems: string[] = [];

      if (answers.name) memoryItems.push(`My name is ${answers.name}`);
      if (answers.work) memoryItems.push(`I work as: ${answers.work}`);
      if (answers.interests) memoryItems.push(`My interests include: ${answers.interests}`);
      if (answers.goal) memoryItems.push(`My current main goal is: ${answers.goal}`);
      if (answers.responseStyle) memoryItems.push(`My preferred response style: ${answers.responseStyle}`);

      for (const item of memoryItems) {
        await addMemory.mutateAsync(item);
      }

      if (answers.rule) {
        await setBehaviorRule.mutateAsync({
          ruleText: answers.rule,
          priority: BigInt(rules.length + 1),
        });
      }

      // Update profile name if provided
      if (answers.name && profile) {
        await updateProfile.mutateAsync({
          name: answers.name,
          preferences: profile.preferences || "",
          personalitySettings: profile.personalitySettings || { communicationStyle: "professional" },
          onboardingComplete: profile.onboardingComplete,
        });
      }

      toast.success("Saved to DJ's memory!");
      navigate("/");
    } catch (_e) {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const answerSummary = [
    answers.name && { label: "Name", value: answers.name },
    answers.work && { label: "Work", value: answers.work },
    answers.interests && { label: "Interests", value: answers.interests },
    answers.responseStyle && { label: "Response style", value: answers.responseStyle },
    answers.goal && { label: "Goal", value: answers.goal },
    answers.rule && { label: "Custom rule", value: answers.rule },
  ].filter(Boolean) as { label: string; value: string }[];

  const progressPct = Math.min((currentQuestionIndex / QUESTIONS.length) * 100, 100);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        {/* Header */}
        <div className="border-b border-primary/20 bg-card/80 px-4 py-3">
          <div className="container mx-auto max-w-2xl flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-display font-bold">Teach DJ — Story Mode</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ boxShadow: "0 0 6px oklch(0.65 0.25 220 / 0.8)" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {currentQuestionIndex}/{QUESTIONS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="container mx-auto max-w-2xl space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "border border-primary/40 bg-primary/15"
                        : "border border-secondary/40 bg-card/80"
                    }`}
                    style={
                      msg.role === "dj"
                        ? { boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.2)" }
                        : { boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.25)" }
                    }
                  >
                    <div className="mb-1.5">
                      <Badge
                        variant={msg.role === "user" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {msg.role === "user" ? "You" : "DJ"}
                      </Badge>
                    </div>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div
                  className="rounded-xl border border-secondary/40 bg-card/80 px-4 py-3"
                  style={{ boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.2)" }}
                >
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-secondary"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Summary card when complete */}
            {isComplete && answerSummary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-primary/30 bg-gradient-to-br from-card to-muted/30 p-5"
                style={{ boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.15)" }}
              >
                <p className="mb-3 font-display text-sm font-bold text-primary">
                  Here's what I learned about you:
                </p>
                <div className="space-y-2">
                  {answerSummary.map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{label}:</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full bg-primary"
                  onClick={handleSaveToMemory}
                  disabled={isSaving}
                  style={{ boxShadow: "0 0 12px oklch(0.65 0.25 220 / 0.4)" }}
                >
                  {isSaving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving to DJ's Memory...</>
                  ) : (
                    <><Brain className="mr-2 h-4 w-4" /> Save to DJ's Memory</>
                  )}
                </Button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        {!isComplete && (
          <div className="border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur">
            <div className="container mx-auto max-w-2xl flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your answer..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1 border-primary/40 bg-card/50"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="shrink-0 bg-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
