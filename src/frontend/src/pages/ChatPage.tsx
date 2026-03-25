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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useContextEngine } from "../context/ContextEngineContext";
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
  type AssistantDeps,
  createAssistantController,
} from "../assistant/brain/assistantController";
import type { ConversationMessage } from "../assistant/brain/contextEngine";
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
  onerror: ((event: { error: string }) => void) | null;
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
  saveFailed?: boolean;
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
  const { setIsTyping, setIsVoiceListening } = contextEngine;
  const queryClient = useQueryClient();

  // Threads
  const { data: threads = [], isLoading: threadsLoading } = useChatThreads();
  const [activeThreadId, setActiveThreadId] = useState<bigint | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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
  const ttsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ttsQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);
  const micTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drainQueueRef = useRef<() => void>(() => {});
  const voiceRestartCountRef = useRef(0);
  const startVoiceInputRef = useRef<() => void>(() => {});
  const handleSendRef = useRef<(text?: string) => void>(() => {});
  const isFirstLoad = useRef(true);
  const prevMessageCount = useRef(0);

  // Build display messages from persisted + optimistic
  const persistedMessages: DisplayMessage[] = useMemo(
    () =>
      [...rawMessages]
        .sort((a, b) =>
          a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
        )
        .map((m) => ({
          id: m.id.toString(),
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: m.timestamp,
        })),
    [rawMessages],
  );

  const allVisibleMessages: DisplayMessage[] = useMemo(
    () =>
      [
        ...persistedMessages,
        ...optimisticMessages.filter((opt) => {
          return !persistedMessages.some((p) => {
            if (p.content !== opt.content || p.role !== opt.role) return false;
            const persistedMs = Number(p.timestamp) / 1_000_000;
            return persistedMs >= Number(opt.timestamp) / 1_000_000 - 5000;
          });
        }),
      ].sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
      ),
    [persistedMessages, optimisticMessages],
  );

  // Clear optimistic when persisted catches up
  useEffect(() => {
    if (optimisticMessages.length === 0) return;
    const allCovered = optimisticMessages.every((opt) =>
      persistedMessages.some((p) => {
        if (p.content !== opt.content || p.role !== opt.role) return false;
        const persistedMs = Number(p.timestamp) / 1_000_000;
        return persistedMs >= Number(opt.timestamp) / 1_000_000 - 5000;
      }),
    );
    if (allCovered) setOptimisticMessages([]);
  }, [persistedMessages, optimisticMessages]);

  // Reset scroll flag when thread changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on thread change
  useEffect(() => {
    isFirstLoad.current = true;
    prevMessageCount.current = 0;
    setOptimisticMessages([]);
  }, [activeThreadId]);

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
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
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
        actor
          .saveThreadMessage(activeThreadId, "assistant", content)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["threadMessages", activeThreadId.toString()],
            });
          })
          .catch(() => {
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === optMsg.id ? { ...m, saveFailed: true } : m,
              ),
            );
          });
      }
    };
    window.addEventListener("dj-proactive-message", handler);
    return () => window.removeEventListener("dj-proactive-message", handler);
  }, [activeThreadId, actor, queryClient]);

  // dj-chat-command: process chat commands dispatched from other pages (e.g. System Status)
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const command = ev.detail as string;
      if (command) {
        handleSendRef.current(command);
      }
    };
    window.addEventListener("dj-chat-command", handler);
    return () => window.removeEventListener("dj-chat-command", handler);
  }, []);

  // dj-settings-changed: react to settings changes without page reload
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const { key, value } = ev.detail as { key: string; value: boolean };
      if (key === "dj_continuous_listening") {
        if (value !== continuousModeRef.current) {
          continuousModeRef.current = value;
          setContinuousMode(value);
          if (value) {
            startVoiceInputRef.current();
          } else {
            recognitionRef.current?.abort();
            setIsListening(false);
            if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
          }
        }
      }
    };
    window.addEventListener("dj-settings-changed", handler);
    return () => window.removeEventListener("dj-settings-changed", handler);
  }, []);

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

  const drainQueue = useCallback(() => {
    if (ttsQueueRef.current.length === 0) {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      return;
    }
    const next = ttsQueueRef.current.shift()!;
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(next);
    const bestVoice = selectBestVoice(voicesRef.current);
    if (bestVoice) utterance.voice = bestVoice;
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onend = () => drainQueueRef.current();
    utterance.onerror = () => drainQueueRef.current();
    synthRef.current?.speak(utterance);
  }, []);
  drainQueueRef.current = drainQueue;

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !voiceEnabled) return;
      // Queue the message — drain starts immediately if not speaking
      ttsQueueRef.current.push(text);
      if (!isSpeakingRef.current) drainQueueRef.current();
    },
    [voiceEnabled],
  );

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    ttsQueueRef.current = [];
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    if (ttsTimerRef.current) clearTimeout(ttsTimerRef.current);
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
    recognition.onstart = () => {
      setIsListening(true);
      setIsVoiceListening(true);
      // Start 30-second inactivity timer
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
      if (continuousModeRef.current) {
        micTimeoutRef.current = setTimeout(() => {
          continuousModeRef.current = false;
          setContinuousMode(false);
          recognitionRef.current?.stop();
          setIsListening(false);
          toast(
            "Microphone timed out after inactivity. Tap the mic to restart.",
          );
        }, 30000);
      }
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      voiceRestartCountRef.current = 0;
      // Reset inactivity timer on speech
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
      if (continuousModeRef.current) {
        micTimeoutRef.current = setTimeout(() => {
          continuousModeRef.current = false;
          setContinuousMode(false);
          recognitionRef.current?.stop();
          setIsListening(false);
          toast(
            "Microphone timed out after inactivity. Tap the mic to restart.",
          );
        }, 30000);
      }
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
    recognition.onerror = (event: { error: string }) => {
      setIsListening(false);
      setIsVoiceListening(false);
      if (continuousModeRef.current) return; // continuous mode handles this via onend
      const errCode = event.error;
      if (errCode === "not-allowed") {
        toast.error(
          "Microphone access denied. Please allow access in your browser settings.",
        );
      } else if (errCode === "no-speech") {
        // Silently ignore — user simply didn't speak
      } else if (errCode === "audio-capture") {
        toast.error("No microphone detected. Please check your device.");
      } else if (errCode === "network") {
        toast.error(
          "Network error during speech recognition. Check your connection.",
        );
      } else {
        toast.error("Voice recognition error. Please try again.");
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      if (continuousModeRef.current) {
        voiceRestartCountRef.current += 1;
        if (voiceRestartCountRef.current > 5) {
          setContinuousMode(false);
          continuousModeRef.current = false;
          voiceRestartCountRef.current = 0;
          toast.error(
            "Continuous listening stopped after repeated failures. Tap mic to restart.",
          );
          return;
        }
        const delay = Math.min(500 * voiceRestartCountRef.current, 3000);
        setTimeout(() => startVoiceInputRef.current(), delay);
      }
    };
    recognition.start();
  }, [speak, setIsVoiceListening]);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setIsVoiceListening(false);
  }, [setIsVoiceListening]);

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

  // ── Assistant controller (replaces inline parseCommand) ──────────────────────────
  const assistantController = createAssistantController(() => {
    const deps: AssistantDeps = {
      actor,
      queryClient,
      memories: memoriesRef.current,
      rules: rulesRef.current,
      personalitySettings: personalitySettingsRef.current,
      contextEngine,
      conversationHistory:
        persistedMessagesRef.current as ConversationMessage[],
      activeTopicRef,
      addMemory: (content: string) => addMemory.mutateAsync(content),
      deleteMemory: (id: bigint) => deleteMemory.mutateAsync(id),
      createCommand: (params) => createCommand.mutateAsync(params),
      setBehaviorRule: (params) => setBehaviorRule.mutateAsync(params),
      setPersonality: (style: string) => setPersonality.mutateAsync(style),
      activateModule: (name: string) => activateModule.mutateAsync(name),
      deactivateModule: (name: string) => deactivateModule.mutateAsync(name),
    };
    return deps;
  });

  const handleSend = async (messageOverride?: string) => {
    setIsTyping(false);
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
    setOptimisticMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      if (actor) {
        actor
          .saveThreadMessage(activeThreadId, "user", messageText)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["threadMessages", activeThreadId.toString()],
            });
          })
          .catch(() => {
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === optimisticUserMsg.id ? { ...m, saveFailed: true } : m,
              ),
            );
          });
      }

      contextEngine.logAction("chat_message", messageText.substring(0, 50));
      const response = await assistantController.process(messageText);

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
        actor
          .saveThreadMessage(activeThreadId, "assistant", response)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["threadMessages", activeThreadId.toString()],
            });
          })
          .catch(() => {
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === optimisticDJMsg.id ? { ...m, saveFailed: true } : m,
              ),
            );
          });
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
    if (isCreating) return;
    setIsCreating(true);
    try {
      const rawId = await actor.createChatThread(
        name.trim(),
        moduleTag ?? null,
      );
      const id: bigint = rawId as bigint;
      queryClient.invalidateQueries({ queryKey: ["chatThreads"] });
      setActiveThreadId(id);
      setNewThreadDialogOpen(false);
      setNewThreadName("");
    } catch {
      toast.error("Failed to create thread");
    } finally {
      setIsCreating(false);
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
                        {/* Save failed indicator */}
                        {message.saveFailed && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-red-400 text-xs">
                              ⚠ Save failed
                            </span>
                            <button
                              type="button"
                              data-ocid="chat.message.retry_button"
                              className="text-xs text-primary underline hover:no-underline"
                              onClick={() => {
                                if (!actor || !activeThreadId) return;
                                actor
                                  .saveThreadMessage(
                                    activeThreadId,
                                    message.role,
                                    message.content,
                                  )
                                  .then(() => {
                                    setOptimisticMessages((prev) =>
                                      prev.map((m) =>
                                        m.id === message.id
                                          ? { ...m, saveFailed: false }
                                          : m,
                                      ),
                                    );
                                    queryClient.invalidateQueries({
                                      queryKey: [
                                        "threadMessages",
                                        activeThreadId.toString(),
                                      ],
                                    });
                                  })
                                  .catch(() =>
                                    toast.error(
                                      "Retry failed. Check your connection.",
                                    ),
                                  );
                              }}
                            >
                              Retry
                            </button>
                          </div>
                        )}
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
                                      await setBehaviorRule.mutateAsync({
                                        ruleText: rule.action,
                                        priority: BigInt(
                                          rulesRef.current.length + 1,
                                        ),
                                      });
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
            <div
              className="border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur"
              style={{
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
              }}
            >
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
                    onChange={(e) => {
                      setInput(e.target.value);
                      setIsTyping(e.target.value.length > 0);
                    }}
                    onBlur={() => setIsTyping(false)}
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
                disabled={!newThreadName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Thread"}
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
