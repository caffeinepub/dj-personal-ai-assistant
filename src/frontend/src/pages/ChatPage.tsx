import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CheckSquare,
  DollarSign,
  Lightbulb,
  Loader2,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  Plus,
  Radio,
  Send,
  StickyNote,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  buildContextPrompt,
  useContextEngine,
} from "../context/ContextEngineContext";
import { useActor } from "../hooks/useActor";
import {
  type ChatThread,
  useActivateModule,
  useAddMemory,
  useBehaviorRules,
  useChatThreads,
  useCreateCustomCommand,
  useDeactivateModule,
  useDeleteMemory,
  useMemories,
  usePersonalitySettings,
  useSetBehaviorRule,
  useSetPersonalitySettings,
  useThreadMessages,
} from "../hooks/useQueries";
import { Link } from "../lib/router-shim";
import {
  extractFocusedAnswer,
  searchBuiltinKnowledge,
} from "../utils/builtinKnowledge";
import {
  randomGreeting,
  randomTaskConfirm,
  smartFallback,
  wrapResponse,
} from "../utils/djPersonality";
import {
  getRelevantContext,
  parseKnowledgeSource,
  searchKnowledgeSources,
} from "../utils/knowledgeSources";
import {
  type CommandPatternType,
  getPatternRuleText,
  getSuggestedRules,
  markRuleSuggested,
  trackCommandPattern,
} from "../utils/patternLearning";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: { transcript: string };
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: bigint;
  isOptimistic?: boolean;
  isFollowup?: boolean;
  followupTaskId?: string;
}

function selectBestVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") ||
        v.name.includes("Microsoft") ||
        v.name.includes("Natural") ||
        v.name.includes("Enhanced")),
  );
  if (preferred) return preferred;
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0];
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split("\n");
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {parts.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable
        <span key={i}>
          {line}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

const MODULE_TAGS = [
  { label: "Tasks", value: "tasks", icon: CheckSquare },
  { label: "Finance", value: "finance", icon: DollarSign },
  { label: "Notes", value: "notes", icon: StickyNote },
  { label: "Knowledge", value: "knowledge", icon: BookOpen },
  { label: "General", value: "general", icon: MessageSquare },
];

export function ChatPage() {
  const { actor } = useActor();
  const contextEngine = useContextEngine();
  const queryClient = useQueryClient();

  // Threads
  const { data: threads = [], isLoading: threadsLoading } = useChatThreads();
  const [activeThreadId, setActiveThreadId] = useState<bigint | null>(null);
  const { data: rawMessages = [], isLoading: messagesLoading } =
    useThreadMessages(activeThreadId);

  // Sidebar/drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newThreadDialogOpen, setNewThreadDialogOpen] = useState(false);
  const [newThreadName, setNewThreadName] = useState("");
  const [deleteConfirmThreadId, setDeleteConfirmThreadId] = useState<
    bigint | null
  >(null);

  // DJ logic hooks
  const { data: memories = [] } = useMemories();
  const { data: rules = [] } = useBehaviorRules();
  const { data: personalitySettings } = usePersonalitySettings();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();
  const createCommand = useCreateCustomCommand();
  const setBehaviorRule = useSetBehaviorRule();
  const setPersonality = useSetPersonalitySettings();
  const activateModule = useActivateModule();
  const deactivateModule = useDeactivateModule();

  // Chat state
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patternSuggestion, setPatternSuggestion] =
    useState<CommandPatternType | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<
    DisplayMessage[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const continuousModeRef = useRef(false);
  const startVoiceInputRef = useRef<() => void>(() => {});
  const handleSendRef = useRef<(text?: string) => void>(() => {});
  const isFirstLoad = useRef(true);
  const prevMessageCount = useRef(0);

  // Build display messages from persisted + optimistic
  const persistedMessages: DisplayMessage[] = [...rawMessages]
    .sort((a, b) =>
      a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
    )
    .map((m) => ({
      id: m.id.toString(),
      role: m.role as "user" | "assistant",
      content: m.content,
      timestamp: m.timestamp,
    }));

  const allVisibleMessages: DisplayMessage[] = [
    ...persistedMessages,
    ...optimisticMessages.filter(
      (opt) =>
        !persistedMessages.some(
          (p) => p.content === opt.content && p.role === opt.role,
        ),
    ),
  ].sort((a, b) =>
    a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
  );

  // Clear optimistic when persisted catches up
  useEffect(() => {
    if (optimisticMessages.length === 0) return;
    const allCovered = optimisticMessages.every((opt) =>
      persistedMessages.some(
        (p) => p.content === opt.content && p.role === opt.role,
      ),
    );
    if (allCovered) setOptimisticMessages([]);
  }, [persistedMessages, optimisticMessages]);

  // Reset scroll flag when thread changes
  useEffect(() => {
    isFirstLoad.current = true;
    prevMessageCount.current = 0;
    setOptimisticMessages([]);
  }, []); // activeThreadId change is detected via rawMessages

  // Auto-scroll
  useEffect(() => {
    if (messagesLoading) return;
    if (allVisibleMessages.length === 0 && !isProcessing) return;
    if (isFirstLoad.current && !messagesLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
      prevMessageCount.current = persistedMessages.length;
      return;
    }
    const totalNow = persistedMessages.length + optimisticMessages.length;
    if (totalNow > prevMessageCount.current || isProcessing) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessageCount.current = persistedMessages.length;
    }
  }, [
    persistedMessages.length,
    optimisticMessages.length,
    isProcessing,
    messagesLoading,
    allVisibleMessages.length,
  ]);

  useEffect(() => {
    if (persistedMessages.length >= 3 && rules.length === 0) {
      setShowSuggestions(true);
    }
  }, [persistedMessages.length, rules.length]);

  // TTS init
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // Proactive message listener
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const { content, type, taskId } = ev.detail as {
        content: string;
        type: string;
        taskId: string;
      };
      if (activeThreadId === null) {
        toast(content.replace(/\*\*/g, ""), { duration: 8000 });
        return;
      }
      const optMsg: DisplayMessage = {
        id: `proactive-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: BigInt(Date.now()) * 1_000_000n,
        isOptimistic: true,
        isFollowup: type === "followup",
        followupTaskId: type === "followup" ? taskId : undefined,
      };
      setOptimisticMessages((prev) => [...prev, optMsg]);
      // Save to thread
      if (actor) {
        (actor as any)
          .saveThreadMessage(activeThreadId, "assistant", content)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["threadMessages", activeThreadId.toString()],
            });
          })
          .catch(() => {});
      }
    };
    window.addEventListener("dj-proactive-message", handler);
    return () => window.removeEventListener("dj-proactive-message", handler);
  }, [activeThreadId, actor, queryClient]);

  // Refs for stale closure avoidance
  const memoriesRef = useRef(memories);
  const rulesRef = useRef(rules);
  const personalitySettingsRef = useRef(personalitySettings);
  memoriesRef.current = memories;
  rulesRef.current = rules;
  personalitySettingsRef.current = personalitySettings;
  const persistedMessagesRef = useRef(persistedMessages);
  const activeTopicRef = useRef<string>("");
  persistedMessagesRef.current = persistedMessages;

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !voiceEnabled) return;
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const bestVoice = selectBestVoice(voicesRef.current);
      if (bestVoice) utterance.voice = bestVoice;
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      setTimeout(() => setIsSpeaking(false), 60000);
    },
    [voiceEnabled],
  );

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  const startVoiceInput = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported. Try Chrome or Edge.");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.abort();
    const recognition = new SpeechRecognition();
    recognition.continuous = continuousModeRef.current;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes("hey dj")) {
        speak("Yes?");
        setIsListening(true);
        return;
      }
      setInput(transcript);
      setIsListening(false);
      if (continuousModeRef.current) {
        setTimeout(() => handleSendRef.current(transcript), 100);
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      if (!continuousModeRef.current)
        toast.error("Voice recognition error. Please try again.");
    };
    recognition.onend = () => {
      setIsListening(false);
      if (continuousModeRef.current) {
        setTimeout(() => startVoiceInputRef.current(), 500);
      }
    };
    recognition.start();
  }, [speak]);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleContinuousMode = useCallback(() => {
    const next = !continuousModeRef.current;
    setContinuousMode(next);
    continuousModeRef.current = next;
    if (next) {
      startVoiceInputRef.current();
    } else {
      recognitionRef.current?.abort();
      setIsListening(false);
    }
  }, []);

  // Keep refs in sync to avoid stale closures
  startVoiceInputRef.current = startVoiceInput;
  handleSendRef.current = (text?: string) => handleSend(text);

  const buildConversationContext = (): string => {
    const recent = persistedMessagesRef.current.slice(-20);
    if (recent.length === 0) return "";
    return recent
      .map(
        (m) =>
          `${m.role === "user" ? "User" : "DJ"}: ${m.content.slice(0, 600)}`,
      )
      .join("\n");
  };

  const buildPersonalityContext = (): string => {
    const currentRules = rulesRef.current;
    const style =
      personalitySettingsRef.current?.communicationStyle || "professional";
    const regularRules = currentRules.filter(
      (r) => !r.ruleText.startsWith("[KNOWLEDGE_SOURCE]"),
    );
    let context = `DJ's style: ${style}`;
    if (regularRules.length > 0) {
      context += `\nActive rules: ${regularRules
        .slice(0, 5)
        .map((r) => r.ruleText)
        .join("; ")}`;
    }
    return context;
  };

  const parseCommand = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase().trim();
    const currentMemories = memoriesRef.current;
    const currentRules = rulesRef.current;
    const knowledgeSources = currentMemories
      .map(parseKnowledgeSource)
      .filter((s) => s !== null);

    const searchKnowledgeMatch = userMessage.match(
      /(?:dj,?\s*)?(?:search\s+(?:my\s+)?knowledge\s+(?:base\s+)?for|what\s+do\s+you\s+know\s+about)\s+(.+)/i,
    );
    if (searchKnowledgeMatch) {
      const query = searchKnowledgeMatch[1].trim();
      const userResults = searchKnowledgeSources(knowledgeSources, query);
      const builtinHits = searchBuiltinKnowledge(query);
      if (userResults.length === 0 && builtinHits.length === 0) {
        return `I don't have any knowledge sources matching "${query}". You can add some at the Knowledge page, or ask me directly about IT, Finance, or Productivity topics.`;
      }
      let response = `Here's what I found for **"${query}"**:\n\n`;
      if (userResults.length > 0) {
        response += "**From your saved knowledge:**\n";
        response += userResults
          .slice(0, 3)
          .map(
            (s) =>
              `- **${s.title}** (${s.sourceType}): ${s.content.slice(0, 200)}...`,
          )
          .join("\n");
        response += "\n\n";
      }
      if (builtinHits.length > 0) {
        response += `**From DJ's built-in knowledge:**\n`;
        response += builtinHits
          .map(
            (b) => `**${b.topic}** (${b.category})\n${b.content.slice(0, 400)}`,
          )
          .join("\n\n");
      }
      return response;
    }

    const synthesisMatch = userMessage.match(
      /(?:what\s+do\s+(?:all\s+)?(?:my\s+)?(?:sources?|knowledge|files?)\s+say\s+about|summarize\s+(?:my\s+)?(?:knowledge|sources?)\s+(?:on|about)|tell\s+me\s+everything\s+(?:you\s+know\s+)?about)\s+(.+)/i,
    );
    if (synthesisMatch) {
      const query = synthesisMatch[1].trim();
      const userResults = searchKnowledgeSources(knowledgeSources, query);
      const builtinHits = searchBuiltinKnowledge(query);
      if (userResults.length === 0 && builtinHits.length === 0) {
        return `I searched all sources but found nothing specifically about "${query}". Try saving relevant knowledge at the Knowledge page.`;
      }
      let synthesis = `**Comprehensive answer on "${query}"** (synthesized from ${userResults.length + builtinHits.length} source${userResults.length + builtinHits.length !== 1 ? "s" : ""}):\n\n`;
      if (builtinHits.length > 0) {
        synthesis += `**Built-in Knowledge:**\n${builtinHits.map((b) => `*${b.topic}*: ${b.content.slice(0, 350)}`).join("\n\n")}\n\n`;
      }
      if (userResults.length > 0) {
        synthesis += `**Your Saved Sources:**\n${userResults
          .slice(0, 3)
          .map((s) => `*${s.title}*: ${s.content.slice(0, 300)}`)
          .join("\n\n")}`;
      }
      return synthesis;
    }

    if (lowerMessage.match(/^(dj,?\s*)?remember\s+/i)) {
      const content = userMessage.replace(/^(dj,?\s*)?remember\s+/i, "").trim();
      if (content) {
        await addMemory.mutateAsync(content);
        return "Understood. I've updated myself accordingly. This memory has been stored permanently.";
      }
    }

    if (lowerMessage.match(/^(dj,?\s*)?forget\s+/i)) {
      const content = userMessage.replace(/^(dj,?\s*)?forget\s+/i, "").trim();
      const matchingMemory = currentMemories.find(
        (m) =>
          !m.content.startsWith("[KNOWLEDGE_SOURCE]") &&
          m.content.toLowerCase().includes(content.toLowerCase()),
      );
      if (matchingMemory) {
        await deleteMemory.mutateAsync(matchingMemory.id);
        return "Understood. I've removed that from my memory.";
      }
      return "I couldn't find a matching memory to forget.";
    }

    if (
      lowerMessage.includes("what do you remember") ||
      lowerMessage.includes("show memories") ||
      lowerMessage.includes("list memories")
    ) {
      const regularMemories = currentMemories.filter(
        (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
      );
      if (regularMemories.length === 0) {
        return "I don't have any stored memories yet. Teach me by saying 'DJ, remember [something]'.";
      }
      return `Here's everything I remember:\n\n${regularMemories.map((m, i) => `${i + 1}. ${m.content}`).join("\n")}`;
    }

    if (lowerMessage.includes("reset all") && lowerMessage.includes("memor")) {
      const regularMemories = currentMemories.filter(
        (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
      );
      for (const m of regularMemories) {
        await deleteMemory.mutateAsync(m.id);
      }
      return "Done. All memories have been cleared. I'm starting fresh.";
    }

    const commandMatch = userMessage.match(
      /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i,
    );
    if (commandMatch) {
      const [, name, action] = commandMatch;
      await createCommand.mutateAsync({ name, action });
      return `Understood. I've created the custom command "${name}". Activate it by saying "${name}".`;
    }

    if (
      lowerMessage.includes("your new rule is") ||
      lowerMessage.includes("set rule:")
    ) {
      const rule = userMessage
        .replace(/^(dj,?\s*)?(?:your\s+new\s+rule\s+is|set\s+rule:)\s*/i, "")
        .trim();
      if (rule) {
        await setBehaviorRule.mutateAsync({
          ruleText: rule,
          priority: BigInt(currentRules.length + 1),
        });
        return "Understood. I've set that as a new behavior rule and will follow it in every future response.";
      }
    }

    if (
      lowerMessage.includes("be more formal") ||
      lowerMessage.includes("be more casual") ||
      lowerMessage.includes("be more concise") ||
      lowerMessage.includes("be more detailed") ||
      lowerMessage.includes("be more professional")
    ) {
      let style = "professional";
      if (lowerMessage.includes("casual")) style = "casual";
      else if (lowerMessage.includes("concise")) style = "concise";
      else if (lowerMessage.includes("detailed")) style = "detailed";
      else if (lowerMessage.includes("formal")) style = "formal";
      await setPersonality.mutateAsync(style);
      return `Understood. I've adjusted my communication style to be more ${style}.`;
    }

    const activateMatch = userMessage.match(
      /(?:dj,?\s*)?activate\s+(?:the\s+)?(\w+)\s+module/i,
    );
    if (activateMatch) {
      await activateModule.mutateAsync(activateMatch[1].toLowerCase());
      return `The ${activateMatch[1]} module has been activated.`;
    }

    const deactivateMatch = userMessage.match(
      /(?:dj,?\s*)?deactivate\s+(?:the\s+)?(\w+)\s+module/i,
    );
    if (deactivateMatch) {
      await deactivateModule.mutateAsync(deactivateMatch[1].toLowerCase());
      return `The ${deactivateMatch[1]} module has been deactivated.`;
    }

    // Tasks
    const taskMatch = userMessage.match(
      /(?:remind(?:er)?\s+me\s+(?:to\s+)?|add\s+(?:a\s+)?task[:\s]+|set\s+(?:a\s+)?reminder[:\s]+|schedule[:\s]+)(.+?)(?:\s+(?:at|by|on|before|today|tomorrow)\s+(.+))?$/i,
    );
    if (
      taskMatch ||
      lowerMessage.includes("add task") ||
      lowerMessage.includes("remind me") ||
      lowerMessage.includes("reminder me") ||
      lowerMessage.includes("set reminder") ||
      lowerMessage.includes("new task")
    ) {
      const titleRaw = taskMatch
        ? taskMatch[1].trim()
        : userMessage
            .replace(
              /^(dj,?\s*)?(add\s+task|remind\s+me|set\s+reminder|new\s+task)[:\s]*/i,
              "",
            )
            .trim();
      const timeRaw = taskMatch ? taskMatch[2] : undefined;
      const cleanTitle = titleRaw
        .replace(/\b(today|tomorrow)\b/gi, "")
        .replace(/\b(at|by|on|before)\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b/gi, "")
        .replace(/\b\d{1,2}:\d{2}\s*(am|pm)?\b/gi, "")
        .replace(/\b\d{1,2}\s*(am|pm)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      const taskTitle = cleanTitle || titleRaw;

      let deadlineMs: bigint | null = null;
      let alreadyPassedToday = false;
      const timePat1 = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
      const timePat2 = /(\d{1,2})\s*(am|pm)/i;
      const timeMatch1 = userMessage.match(timePat1);
      const timeMatch2 = !timeMatch1 ? userMessage.match(timePat2) : null;

      if (timeMatch1) {
        let hours = Number.parseInt(timeMatch1[1]);
        const minutes = Number.parseInt(timeMatch1[2]);
        const ampm = timeMatch1[3]?.toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        if (d.getTime() < Date.now()) {
          if (lowerMessage.includes("today")) alreadyPassedToday = true;
          else d.setDate(d.getDate() + 1);
        }
        deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
      } else if (timeMatch2) {
        let hours = Number.parseInt(timeMatch2[1]);
        const ampm = timeMatch2[2]?.toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
        const d = new Date();
        d.setHours(hours, 0, 0, 0);
        if (d.getTime() < Date.now()) {
          if (lowerMessage.includes("today")) alreadyPassedToday = true;
          else d.setDate(d.getDate() + 1);
        }
        deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
      } else if (lowerMessage.includes("today")) {
        const d = new Date();
        d.setHours(23, 59, 0, 0);
        deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
      } else if (lowerMessage.includes("tomorrow")) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 0, 0, 0);
        deadlineMs = BigInt(d.getTime()) * BigInt(1_000_000);
      }

      if (taskTitle) {
        try {
          if (!actor) throw new Error("Actor not available");
          await (actor as any).addTask(
            taskTitle,
            timeRaw ? `Scheduled: ${timeRaw}` : "",
            deadlineMs,
            "medium",
          );
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          trackCommandPattern("task");
          const deadlineStr = deadlineMs
            ? ` at ${new Date(Number(deadlineMs) / 1_000_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "";
          const passedNote = alreadyPassedToday
            ? "\n\n*(Note: this time has already passed today — reminder saved for reference.)*"
            : "";
          return `${randomTaskConfirm("task", `${taskTitle}${deadlineStr}`)} View or edit it in the Tasks section.${passedNote}`;
        } catch {
          return `I understood you want to add a task: **${taskTitle}**. However I couldn't save it right now — please try again or add it directly in the Tasks section.`;
        }
      }
    }

    // Notes
    const noteMatch = userMessage.match(
      /(?:add\s+(?:a\s+)?note[:\s]+|note[:\s]+|save\s+(?:a\s+)?note[:\s]+|remember\s+this\s+note[:\s]+)(.+)/i,
    );
    if (noteMatch) {
      const noteContent = noteMatch[1].trim();
      const words = noteContent.split(" ").slice(0, 5).join(" ");
      try {
        if (!actor) throw new Error("Actor not available");
        await (actor as any).addNote(
          words,
          noteContent,
          noteContent.slice(0, 100),
          [],
        );
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        trackCommandPattern("note");
        const shortNote =
          noteContent.slice(0, 60) + (noteContent.length > 60 ? "..." : "");
        return `${randomTaskConfirm("note", shortNote)} Find it in your Notes section.`;
      } catch {
        return "I understood you want to save this note. However I couldn't save it right now — please try again or add it directly in the Notes section.";
      }
    }

    // Finance
    const financeMatch = userMessage.match(
      /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?|inr|₹|\$|usd)?\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:rs\.?|inr|₹|\$)?)?\.?\s*(?:(?:on|for|as|from)\s+(.+?))?(?:\/[-]?)?$/i,
    );
    const financeMatch2 = userMessage.match(
      /(?:rs\.?|inr|₹|\$|usd)\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:on|for|as|from)\s+(.+?))?(?:\/[-]?)?\s*(?:expense|income|earned?)?$/i,
    );
    const financeMatch3 = userMessage.match(
      /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?\s+)(\d+(?:\.\d{1,2})?)/i,
    );
    const fm = financeMatch || financeMatch2 || financeMatch3;
    if (fm) {
      const amountStr = fm[1];
      const descRaw = fm[2]?.trim().replace(/[\/\-]+$/, "") || "";
      const amount = Math.round(Number.parseFloat(amountStr) * 100);
      const isIncome = /income|earning|received?|got/i.test(userMessage);
      const category = isIncome ? "income" : descRaw || "general";
      const description = descRaw || (isIncome ? "Income" : "Expense");
      try {
        if (!actor) throw new Error("Actor not available");
        await (actor as any).addFinanceEntry(
          isIncome ? BigInt(amount) : BigInt(-amount),
          category,
          description,
          BigInt(Date.now()) * BigInt(1_000_000),
        );
        queryClient.invalidateQueries({ queryKey: ["financeEntries"] });
        trackCommandPattern("expense");
        const sign = isIncome ? "+" : "-";
        return `${randomTaskConfirm("finance", `${sign}₹${Number.parseFloat(amountStr).toFixed(2)} for ${description}`)} View details in the Finance Tracker.`;
      } catch {
        return `I understood you want to record: **${isIncome ? "+" : "-"}₹${Number.parseFloat(amountStr).toFixed(2)}** for **${description}**. However I couldn't save it right now.`;
      }
    }

    return generateContextualResponse(userMessage, knowledgeSources);
  };

  const generateContextualResponse = (
    userMessage: string,
    knowledgeSources: ReturnType<typeof parseKnowledgeSource>[] = [],
  ): string => {
    const style =
      personalitySettingsRef.current?.communicationStyle || "professional";
    const lowerMessage = userMessage.toLowerCase();
    const currentMemories = memoriesRef.current;
    const currentRules = rulesRef.current;
    const conversationContext = buildConversationContext();
    const _pc = buildPersonalityContext();
    const _contextPrompt = buildContextPrompt(contextEngine);
    const regularMemories = currentMemories.filter(
      (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
    );

    const mathMatch = userMessage.trim().match(/^[\d\s\+\-\*\/\(\)\.%^]+$/);
    if (mathMatch) {
      try {
        const expr = userMessage.trim().replace(/\^/g, "**");
        if (/^[\d\s\+\-\*\/\(\)\.%\*]+$/.test(expr)) {
          const result = Function(`"use strict"; return (${expr})`)();
          if (typeof result === "number" && Number.isFinite(result)) {
            return `${userMessage.trim()} = **${result}**`;
          }
        }
      } catch {
        // not a valid expression
      }
    }

    if (
      lowerMessage.match(
        /^(hello|hi|hey|good morning|good evening|good afternoon)[\s!.]*$/,
      )
    ) {
      const ctxName = contextEngine.userPreferences?.name;
      const userName =
        ctxName ||
        regularMemories
          .find((m) => m.content.toLowerCase().includes("my name is"))
          ?.content.replace(/.*my name is\s+/i, "")
          .split(/[,. ]/)[0];
      const timeGreet =
        contextEngine.timeOfDay === "morning"
          ? "Good morning"
          : contextEngine.timeOfDay === "evening"
            ? "Good evening"
            : contextEngine.timeOfDay === "night"
              ? "Working late?"
              : null;
      const baseGreeting = randomGreeting(userName);
      return timeGreet
        ? `${timeGreet}${userName ? `, ${userName}! ` : "! "}All systems active and ready for you.`
        : baseGreeting;
    }

    if (
      lowerMessage.includes("how are you") ||
      lowerMessage.includes("how do you feel")
    ) {
      return "All good on my end! Always running, always ready. What do you need?";
    }

    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do") ||
      lowerMessage.includes("capabilities")
    ) {
      return `Here's what I can do:\n\n- **Memory**: "DJ, remember [something]" / "DJ, forget [something]"\n- **Knowledge**: "DJ, what do you know about [topic]"\n- **Rules**: "DJ, your new rule is [rule]"\n- **Tasks/Reminders**: "Remind me at 3pm to [task]"\n- **Notes**: "Note: [content]"\n- **Finance**: "Add expense Rs.100 on food"\n- **Style**: "DJ, be more casual/formal/concise/detailed"\n\nI currently have ${regularMemories.length} memories stored. What would you like to do?`;
    }

    if (
      (lowerMessage.includes("tell me more") ||
        lowerMessage.includes("explain that") ||
        lowerMessage.includes("more about") ||
        lowerMessage.includes("go on") ||
        lowerMessage.includes("continue")) &&
      conversationContext
    ) {
      const lastAssistant = persistedMessagesRef.current
        .filter((m) => m.role === "assistant")
        .slice(-1)[0];
      if (lastAssistant) {
        return `Expanding on what I mentioned: ${lastAssistant.content}\n\nIs there a specific aspect you'd like me to elaborate on further?`;
      }
    }

    if (
      lowerMessage.includes("what did i say") ||
      lowerMessage.includes("recap") ||
      lowerMessage.includes("summarize our conversation") ||
      lowerMessage.includes("what have we discussed")
    ) {
      if (persistedMessagesRef.current.length === 0) {
        return "This is the beginning of our conversation. Nothing has been said yet.";
      }
      const recentUserMessages = persistedMessagesRef.current
        .filter((m) => m.role === "user")
        .slice(-5);
      const summary = recentUserMessages
        .map((m, i) => `${i + 1}. "${m.content.slice(0, 100)}"`)
        .join("\n");
      return `Here's a summary of your recent messages:\n\n${summary}`;
    }

    const validSources = knowledgeSources.filter((s) => s !== null);
    const userKnowledgeResults: { title: string; content: string }[] = [];
    if (validSources.length > 0) {
      const { context, titles } = getRelevantContext(validSources, userMessage);
      if (context) {
        userKnowledgeResults.push(
          ...titles.map((t) => ({ title: t, content: context })),
        );
      }
    }

    const builtinResults = searchBuiltinKnowledge(userMessage);

    if (userKnowledgeResults.length > 0 && builtinResults.length > 0) {
      const builtinSummary = builtinResults[0].content.slice(0, 400);
      const userSummary = userKnowledgeResults[0].content.slice(0, 400);
      const intro =
        style === "concise"
          ? "Here's what I found:"
          : "I found relevant information from multiple sources:";
      return `${intro}\n\n**From your knowledge base (${userKnowledgeResults[0].title}):**\n${userSummary}\n\n**From DJ's built-in knowledge (${builtinResults[0].topic}):**\n${builtinSummary}`;
    }

    if (userKnowledgeResults.length > 0) {
      const intro =
        style === "concise"
          ? "From your knowledge base:"
          : "I found relevant information in your knowledge base:";
      return `${intro}\n\n${userKnowledgeResults[0].content.slice(0, 800)}\n\n---\n*Source: ${userKnowledgeResults[0].title}*`;
    }

    if (builtinResults.length > 0) {
      activeTopicRef.current = builtinResults[0].topic;
      const focusedAnswer = extractFocusedAnswer(
        userMessage,
        builtinResults[0],
      );
      if (focusedAnswer) return wrapResponse(focusedAnswer, "knowledge");
      const intro =
        style === "concise"
          ? `**${builtinResults[0].topic}:**`
          : `Here's what I know about **${builtinResults[0].topic}**:`;
      const footer =
        builtinResults.length > 1
          ? `\n\n---\n*I also have built-in knowledge on: ${builtinResults
              .slice(1)
              .map((r) => r.topic)
              .join(", ")}*`
          : "";
      return `${intro}\n\n${builtinResults[0].content}${footer}`;
    }

    if (regularMemories.length > 0) {
      const relevantMemory = regularMemories.find((m) =>
        m.content
          .toLowerCase()
          .split(" ")
          .some((word) => word.length > 4 && lowerMessage.includes(word)),
      );
      if (relevantMemory) {
        return `Based on what I know about you: ${relevantMemory.content}\n\nFor more specific help, please ask a more detailed question.`;
      }
    }

    if (
      currentRules.length > 0 &&
      lowerMessage.includes("what are your rules")
    ) {
      const ruleList = currentRules
        .slice(0, 5)
        .map((r, i) => `${i + 1}. ${r.ruleText}`)
        .join("\n");
      return `My current behavior rules:\n\n${ruleList}`;
    }

    const activeTopic = activeTopicRef.current;
    if (
      activeTopic &&
      (lowerMessage.includes("why") ||
        lowerMessage.includes("how") ||
        lowerMessage.includes("what") ||
        lowerMessage.includes("when"))
    ) {
      const topicResults = searchBuiltinKnowledge(activeTopic);
      if (topicResults.length > 0) {
        return `Following up on **${activeTopic}**:\n\n${topicResults[0].content}`;
      }
    }

    // Context-aware situational reply
    const pageName = contextEngine.currentPage;
    if (pageName === "/finance" && !lowerMessage.includes("?")) {
      return (
        smartFallback(userMessage) +
        (contextEngine.activeTasks.length > 0
          ? `\n\nHeads up — you have ${contextEngine.activeTasks.length} task${contextEngine.activeTasks.length > 1 ? "s" : ""} due today that need attention.`
          : "")
      );
    }
    return smartFallback(userMessage);
  };

  const handleSend = async (messageOverride?: string) => {
    const messageText = messageOverride ?? input.trim();
    if (!messageText || isProcessing || activeThreadId === null) return;

    setInput("");
    setIsProcessing(true);

    const optimisticUserMsg: DisplayMessage = {
      id: `optimistic-user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: BigInt(Date.now()) * 1_000_000n,
      isOptimistic: true,
    };
    setOptimisticMessages([optimisticUserMsg]);

    try {
      if (actor) {
        (actor as any)
          .saveThreadMessage(activeThreadId, "user", messageText)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["threadMessages", activeThreadId.toString()],
            });
          })
          .catch(() => {});
      }

      contextEngine.logAction("chat_message", messageText.substring(0, 50));
      const response = await parseCommand(messageText);

      const suggestions = getSuggestedRules();
      if (suggestions.length > 0) setPatternSuggestion(suggestions[0]);

      const optimisticDJMsg: DisplayMessage = {
        id: `optimistic-dj-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: BigInt(Date.now() + 1) * 1_000_000n,
        isOptimistic: true,
      };
      setOptimisticMessages([optimisticUserMsg, optimisticDJMsg]);

      if (actor) {
        (actor as any)
          .saveThreadMessage(activeThreadId, "assistant", response)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["threadMessages", activeThreadId.toString()],
            });
          })
          .catch(() => {});
      }

      if (voiceEnabled) speak(response);
    } catch (_error) {
      toast.error("Failed to process message. Please try again.");
      setInput(messageText);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatThreadTime = (createdAt: bigint) => {
    const d = new Date(Number(createdAt) / 1_000_000);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const createThread = async (name: string, moduleTag: string | null) => {
    if (!actor || !name.trim()) return;
    try {
      const id = await (actor as any).createChatThread(name.trim(), moduleTag);
      queryClient.invalidateQueries({ queryKey: ["chatThreads"] });
      setActiveThreadId(id as bigint);
      setNewThreadDialogOpen(false);
      setNewThreadName("");
    } catch {
      toast.error("Failed to create thread");
    }
  };

  const deleteThread = async (id: bigint) => {
    if (!actor) return;
    try {
      await (actor as any).deleteChatThread(id);
      queryClient.invalidateQueries({ queryKey: ["chatThreads"] });
      if (activeThreadId === id) setActiveThreadId(null);
      setDeleteConfirmThreadId(null);
    } catch {
      toast.error("Failed to delete thread");
    }
  };

  const deleteMessage = async (messageId: bigint) => {
    if (!actor || activeThreadId === null) return;
    try {
      await (actor as any).deleteThreadMessage(activeThreadId, messageId);
      queryClient.invalidateQueries({
        queryKey: ["threadMessages", activeThreadId.toString()],
      });
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const quickRuleSuggestions = [
    "Always respond in bullet points",
    "Keep responses under 3 sentences",
    "Always greet me by name",
  ];

  // Thread sidebar content (shared between drawer and desktop sidebar)
  const threadSidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-primary/20 p-4">
        <h2 className="font-display font-bold text-primary">Chat Threads</h2>
        <Button
          size="sm"
          data-ocid="chat.new_thread_button"
          onClick={() => setNewThreadDialogOpen(true)}
          className="h-7 bg-primary/20 px-2 text-primary hover:bg-primary/30 border border-primary/30"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {threadsLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : threads.length === 0 ? (
          <div className="p-4 text-center" data-ocid="chat.threads.empty_state">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 text-xs text-muted-foreground">
              No threads yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Create one to start.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {threads
              .slice()
              .sort((a, b) =>
                a.createdAt < b.createdAt
                  ? 1
                  : a.createdAt > b.createdAt
                    ? -1
                    : 0,
              )
              .map((thread, idx) => (
                <button
                  type="button"
                  key={thread.id.toString()}
                  data-ocid={`chat.thread.item.${idx + 1}`}
                  className={`group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    activeThreadId === thread.id
                      ? "bg-primary/15 border border-primary/30"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setDrawerOpen(false);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        activeThreadId === thread.id ? "text-primary" : ""
                      }`}
                    >
                      {thread.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {thread.moduleTag && (
                        <Badge className="h-4 bg-secondary/20 px-1 text-[9px] text-secondary">
                          {thread.moduleTag}
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {formatThreadTime(thread.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`chat.thread.delete_button.${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmThreadId(thread.id);
                    }}
                    className="shrink-0 rounded p-0.5 text-muted-foreground/40 opacity-0 hover:text-destructive group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <Layout>
      {/* Smart suggestions banner */}
      {showSuggestions && (
        <div className="border-b border-primary/30 bg-primary/10 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">
                Suggested rule:
              </span>
              {quickRuleSuggestions.map((rule) => (
                <button
                  key={rule}
                  type="button"
                  data-ocid="chat.suggestion.button"
                  onClick={async () => {
                    await setBehaviorRule.mutateAsync({
                      ruleText: rule,
                      priority: BigInt(rulesRef.current.length + 1),
                    });
                    toast.success(`Rule applied: ${rule}`);
                    setShowSuggestions(false);
                  }}
                  className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20"
                >
                  {rule}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex" style={{ height: "calc(100dvh - 4rem)" }}>
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-primary/20 bg-card/50 md:flex md:flex-col">
          {threadSidebarContent}
        </aside>

        {/* Main chat area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-primary/20 bg-card/80 px-4 py-2.5">
            {/* Mobile threads button */}
            <Button
              size="icon"
              variant="ghost"
              data-ocid="chat.threads_button"
              onClick={() => setDrawerOpen(true)}
              className="h-8 w-8 shrink-0 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              {activeThreadId ? (
                <p className="truncate text-sm font-semibold">
                  {threads.find((t) => t.id === activeThreadId)?.name ||
                    "Thread"}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Select a thread</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto max-w-3xl space-y-4">
              {activeThreadId === null ? (
                <div
                  className="flex h-64 items-center justify-center"
                  data-ocid="chat.empty_state"
                >
                  <div className="glow-border rounded-lg border border-primary/50 p-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                    <p className="glow-text font-display text-xl">
                      Select a thread or create one
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      to start chatting with DJ
                    </p>
                    <Button
                      className="mt-4 bg-primary/20 text-primary border border-primary/30"
                      size="sm"
                      onClick={() => setNewThreadDialogOpen(true)}
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> New Thread
                    </Button>
                  </div>
                </div>
              ) : messagesLoading ? (
                <div
                  className="flex h-64 items-center justify-center"
                  data-ocid="chat.loading_state"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : allVisibleMessages.length === 0 && !isProcessing ? (
                <div
                  className="flex h-64 items-center justify-center"
                  data-ocid="chat.empty_state"
                >
                  <div className="glow-border rounded-lg border border-primary/50 p-8 text-center">
                    <p className="glow-text font-display text-xl">
                      Start a conversation with DJ
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try: &ldquo;DJ, remember my name is [your name]&rdquo;
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Go to{" "}
                      <Link
                        to="/knowledge"
                        className="text-primary hover:underline"
                      >
                        <BookOpen className="inline h-3.5 w-3.5" /> Knowledge
                      </Link>{" "}
                      to add sources.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {allVisibleMessages.map((message, msgIdx) => (
                    <div
                      key={message.id}
                      className={`group flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      } ${message.isOptimistic ? "opacity-80" : ""}`}
                    >
                      <div
                        className={`relative max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "rounded-br-sm border border-primary/40 bg-primary/15 text-foreground"
                            : "rounded-bl-sm border border-secondary/40 bg-card/80 text-foreground"
                        }`}
                        style={
                          message.role === "user"
                            ? {
                                boxShadow:
                                  "0 0 10px oklch(0.65 0.25 220 / 0.25)",
                              }
                            : {
                                boxShadow:
                                  "0 0 10px oklch(0.75 0.18 195 / 0.15)",
                              }
                        }
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <Badge
                            variant={
                              message.role === "user" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {message.role === "user" ? "You" : "DJ"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.isOptimistic
                              ? message.role === "user"
                                ? "sending..."
                                : "just now"
                              : formatTimestamp(message.timestamp)}
                          </span>
                          {/* Delete button */}
                          {!message.isOptimistic && (
                            <button
                              type="button"
                              data-ocid={`chat.message.delete_button.${msgIdx + 1}`}
                              onClick={() => {
                                const numId = BigInt(message.id);
                                deleteMessage(numId);
                              }}
                              className="ml-auto rounded p-0.5 text-muted-foreground/30 opacity-0 hover:text-destructive group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <MessageContent content={message.content} />
                        {/* Follow-up Yes/No */}
                        {message.isFollowup && message.followupTaskId && (
                          <div className="mt-2 flex gap-2">
                            <Button
                              size="sm"
                              className="h-7 bg-green-500/20 text-green-400 border border-green-500/30 text-xs hover:bg-green-500/30"
                              onClick={() => {
                                localStorage.setItem(
                                  `dj_reminder_ack_${message.followupTaskId}`,
                                  "yes",
                                );
                                toast.success("Great! Marked as done.");
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 bg-red-500/20 text-red-400 border border-red-500/30 text-xs hover:bg-red-500/30"
                              onClick={() => {
                                localStorage.setItem(
                                  `dj_reminder_ack_${message.followupTaskId}`,
                                  "no",
                                );
                                toast("Noted — maybe next time!");
                              }}
                            >
                              No
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isProcessing && optimisticMessages.length < 2 && (
                    <div
                      className="flex justify-start"
                      data-ocid="chat.loading_state"
                    >
                      <div
                        className="rounded-2xl rounded-bl-sm border border-secondary/40 bg-card/80 px-4 py-3"
                        style={{
                          boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.15)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span
                              className="h-2 w-2 rounded-full bg-secondary animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="h-2 w-2 rounded-full bg-secondary animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="h-2 w-2 rounded-full bg-secondary animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            DJ is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isProcessing && isSpeaking && (
                    <div className="flex justify-start">
                      <div
                        className="rounded-2xl rounded-bl-sm border border-secondary/40 bg-card/80 px-4 py-3"
                        style={{
                          boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.15)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 animate-pulse text-secondary" />
                          <span className="text-sm text-muted-foreground">
                            DJ is speaking...
                          </span>
                          <button
                            type="button"
                            onClick={stopSpeaking}
                            className="ml-1 text-xs text-muted-foreground hover:text-destructive"
                          >
                            Stop
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Pattern Suggestion */}
              {patternSuggestion &&
                (() => {
                  const rule = getPatternRuleText(patternSuggestion);
                  return (
                    <div
                      data-ocid="chat.pattern.card"
                      className="flex justify-start"
                    >
                      <div
                        className="max-w-[85%] rounded-2xl rounded-bl-sm border border-secondary/40 bg-gradient-to-br from-secondary/10 to-secondary/5 px-4 py-3"
                        style={{
                          boxShadow: "0 0 12px oklch(0.75 0.18 195 / 0.15)",
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-secondary">
                              Pattern Detected
                            </p>
                            <p className="text-sm text-muted-foreground">
                              You&apos;ve used &ldquo;{rule.trigger}&rdquo;
                              several times. Want DJ to{" "}
                              <span className="text-foreground font-medium">
                                {rule.action}
                              </span>
                              ?
                            </p>
                            <div className="flex gap-2 pt-1">
                              <Button
                                data-ocid="chat.pattern.confirm_button"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    if (actor) {
                                      await (actor as any).setBehaviorRule(
                                        rule.trigger,
                                        BigInt(0),
                                      );
                                    }
                                    markRuleSuggested(patternSuggestion);
                                    setPatternSuggestion(null);
                                    toast.success(
                                      "Rule created! DJ will now handle this automatically.",
                                    );
                                  } catch {
                                    toast.error("Failed to create rule");
                                  }
                                }}
                                className="h-7 border border-secondary/40 bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs"
                              >
                                Create Rule
                              </Button>
                              <Button
                                data-ocid="chat.pattern.cancel_button"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  markRuleSuggested(patternSuggestion);
                                  setPatternSuggestion(null);
                                }}
                                className="h-7 text-xs text-muted-foreground"
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar */}
          {activeThreadId !== null && (
            <div className="border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur">
              <div className="mx-auto max-w-3xl">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant={isListening ? "default" : "outline"}
                    onClick={
                      isListening && !continuousMode
                        ? stopVoiceInput
                        : !continuousMode
                          ? startVoiceInput
                          : undefined
                    }
                    disabled={isProcessing || continuousMode}
                    data-ocid="chat.voice_toggle"
                    title={
                      continuousMode
                        ? "Use continuous mode button to control"
                        : isListening
                          ? "Stop listening"
                          : "Start voice input"
                    }
                    className={`shrink-0 relative ${
                      isListening
                        ? "bg-primary text-primary-foreground ring-2 ring-cyan-400 ring-offset-1 ring-offset-background shadow-[0_0_16px_rgba(34,211,238,0.7)]"
                        : "border-primary/50 hover:border-primary"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    {isListening && (
                      <span className="absolute inset-0 rounded-md animate-ping bg-cyan-400/30 pointer-events-none" />
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={toggleContinuousMode}
                    data-ocid="chat.continuous_toggle"
                    title={
                      continuousMode
                        ? "Turn off continuous listening"
                        : "Turn on continuous listening (wake word: Hey DJ)"
                    }
                    className={`shrink-0 transition-all ${
                      continuousMode
                        ? "border-green-400/70 text-green-400 bg-green-400/10 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                        : "border-muted text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Radio className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (isSpeaking) stopSpeaking();
                      setVoiceEnabled((v) => !v);
                    }}
                    title={voiceEnabled ? "Mute DJ voice" : "Enable DJ voice"}
                    className={`shrink-0 ${
                      voiceEnabled
                        ? "border-secondary/50 text-secondary hover:border-secondary"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    {voiceEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>

                  <Input
                    placeholder={
                      isListening
                        ? "Listening..."
                        : "Message DJ... (or tap mic to speak)"
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border-primary/40 bg-card/50 focus-visible:ring-primary/50"
                    disabled={isProcessing || isListening}
                    data-ocid="chat.input"
                    autoComplete="off"
                  />

                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isProcessing}
                    className="shrink-0 bg-primary hover:bg-primary/90"
                    data-ocid="chat.send_button"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {isListening && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div className="flex gap-1 items-center">
                      <span
                        className="rounded-full bg-cyan-400 animate-bounce"
                        style={{ width: 5, height: 5, animationDelay: "0ms" }}
                      />
                      <span
                        className="rounded-full bg-cyan-400 animate-bounce"
                        style={{ width: 7, height: 7, animationDelay: "150ms" }}
                      />
                      <span
                        className="rounded-full bg-cyan-400 animate-bounce"
                        style={{
                          width: 10,
                          height: 10,
                          animationDelay: "300ms",
                        }}
                      />
                      <span
                        className="rounded-full bg-cyan-400 animate-bounce"
                        style={{ width: 7, height: 7, animationDelay: "150ms" }}
                      />
                      <span
                        className="rounded-full bg-cyan-400 animate-bounce"
                        style={{ width: 5, height: 5, animationDelay: "0ms" }}
                      />
                    </div>
                    <span className="text-xs text-cyan-400 font-medium animate-pulse">
                      {continuousMode
                        ? 'Continuous — say "Hey DJ" to activate'
                        : "Listening... speak now"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile threads drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="w-72 border-primary/30 bg-card/95 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Chat Threads</SheetTitle>
          </SheetHeader>
          {threadSidebarContent}
        </SheetContent>
      </Sheet>

      {/* New Thread Dialog */}
      <Dialog open={newThreadDialogOpen} onOpenChange={setNewThreadDialogOpen}>
        <DialogContent className="max-w-sm border-primary/40 bg-card/95">
          <DialogHeader>
            <DialogTitle className="font-display">New Thread</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="topic">
            <TabsList className="w-full">
              <TabsTrigger value="topic" className="flex-1">
                By Topic
              </TabsTrigger>
              <TabsTrigger value="module" className="flex-1">
                By Module
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topic" className="space-y-3 pt-3">
              <Input
                placeholder="Thread name..."
                value={newThreadName}
                onChange={(e) => setNewThreadName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createThread(newThreadName, null);
                }}
                autoFocus
                className="border-primary/40"
              />
              <Button
                className="w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                onClick={() => createThread(newThreadName, null)}
                disabled={!newThreadName.trim()}
              >
                Create Thread
              </Button>
            </TabsContent>
            <TabsContent value="module" className="pt-3">
              <div className="grid grid-cols-2 gap-2">
                {MODULE_TAGS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Button
                      key={m.value}
                      variant="outline"
                      className="flex h-auto flex-col gap-1.5 border-primary/30 py-3 hover:bg-primary/10"
                      onClick={() => createThread(m.label, m.value)}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-xs">{m.label}</span>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Thread Confirmation */}
      <AlertDialog
        open={deleteConfirmThreadId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmThreadId(null);
        }}
      >
        <AlertDialogContent className="border-destructive/30 bg-card/95">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Thread?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this thread and all its messages.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="chat.thread.cancel_button"
              onClick={() => setDeleteConfirmThreadId(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="chat.thread.confirm_button"
              onClick={() => {
                if (deleteConfirmThreadId !== null)
                  deleteThread(deleteConfirmThreadId);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
