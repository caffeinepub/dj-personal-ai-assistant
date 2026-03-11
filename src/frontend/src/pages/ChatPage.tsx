import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useActivateModule,
  useAddFinanceEntry,
  useAddMemory,
  useAddNote,
  useAddTask,
  useBehaviorRules,
  useChatMessages,
  useCreateCustomCommand,
  useDeactivateModule,
  useDeleteMemory,
  useMemories,
  usePersonalitySettings,
  useSaveChatMessage,
  useSetBehaviorRule,
  useSetPersonalitySettings,
} from "../hooks/useQueries";
import { Link } from "../lib/router-shim";
import {
  getRelevantContext,
  parseKnowledgeSource,
  searchKnowledgeSources,
} from "../utils/knowledgeSources";

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
}

// Pick the best available TTS voice — prefer a natural English voice
function selectBestVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  // Prefer Google/Microsoft natural voices
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") ||
        v.name.includes("Microsoft") ||
        v.name.includes("Natural") ||
        v.name.includes("Enhanced")),
  );
  if (preferred) return preferred;
  // Fallback: any English voice
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0];
}

function MessageContent({ content }: { content: string }) {
  // Minimal markdown-like rendering: bold, code, newlines
  const parts = content.split("\n");
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {parts.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable within a single message
        <span key={i}>
          {line}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

export function ChatPage() {
  const { data: rawMessages = [], isLoading: messagesLoading } =
    useChatMessages();
  // Sort oldest-first so latest message always appears at the bottom
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

  const { data: memories = [] } = useMemories();
  const { data: rules = [] } = useBehaviorRules();
  const { data: personalitySettings } = usePersonalitySettings();
  const saveMessage = useSaveChatMessage();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();
  const createCommand = useCreateCustomCommand();
  const setBehaviorRule = useSetBehaviorRule();
  const setPersonality = useSetPersonalitySettings();
  const activateModule = useActivateModule();
  const deactivateModule = useDeactivateModule();
  const addTask = useAddTask();
  const addNote = useAddNote();
  const addFinanceEntry = useAddFinanceEntry();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Optimistic messages shown immediately while waiting for backend
  const [optimisticMessages, setOptimisticMessages] = useState<
    DisplayMessage[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const _wakeWordRef = useRef<SpeechRecognitionInstance | null>(null);

  const isFirstLoad = useRef(true);
  const prevMessageCount = useRef(0);

  // Combined visible messages: persisted + optimistic
  const allVisibleMessages: DisplayMessage[] = [
    ...persistedMessages,
    ...optimisticMessages,
  ];

  // Auto-scroll: instant on first load, smooth on new messages
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
    const totalPrev = prevMessageCount.current;
    if (totalNow > totalPrev || isProcessing) {
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

  // Show smart suggestions after 3+ messages with no rules
  useEffect(() => {
    if (persistedMessages.length >= 3 && rules.length === 0) {
      setShowSuggestions(true);
    }
  }, [persistedMessages.length, rules.length]);

  // Initialize speech synthesis + load voices
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

  // Use refs for latest values to avoid stale closures
  const memoriesRef = useRef(memories);
  const rulesRef = useRef(rules);
  const personalitySettingsRef = useRef(personalitySettings);
  memoriesRef.current = memories;
  rulesRef.current = rules;
  personalitySettingsRef.current = personalitySettings;

  // Keep ref to persisted messages for context building
  const persistedMessagesRef = useRef(persistedMessages);
  persistedMessagesRef.current = persistedMessages;

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !voiceEnabled) return;
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const bestVoice = selectBestVoice(voicesRef.current);
      if (bestVoice) utterance.voice = bestVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      // Safety fallback in case onend never fires
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
      toast.error(
        "Speech recognition is not supported in this browser. Try Chrome or Edge.",
      );
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition error. Please try again.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, []);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Build conversation context from recent messages for smarter responses
  const buildConversationContext = (): string => {
    const recent = persistedMessagesRef.current.slice(-6); // last 3 pairs
    if (recent.length === 0) return "";
    return recent
      .map(
        (m) =>
          `${m.role === "user" ? "User" : "DJ"}: ${m.content.slice(0, 200)}`,
      )
      .join("\n");
  };

  // Build DJ's active personality context from rules and settings
  const buildPersonalityContext = (): string => {
    const currentRules = rulesRef.current;
    const style =
      personalitySettingsRef.current?.communicationStyle || "professional";
    const regularRules = currentRules.filter(
      (r) => !r.ruleText.startsWith("[KNOWLEDGE_SOURCE]"),
    );
    let context = `DJ's style: ${style}`;
    if (regularRules.length > 0) {
      const topRules = regularRules
        .slice(0, 5)
        .map((r) => r.ruleText)
        .join("; ");
      context += `\nActive rules: ${topRules}`;
    }
    return context;
  };

  const parseCommand = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase().trim();
    const currentMemories = memoriesRef.current;
    const currentRules = rulesRef.current;

    // Knowledge search
    const knowledgeSources = currentMemories
      .map(parseKnowledgeSource)
      .filter((s) => s !== null);

    const searchKnowledgeMatch = userMessage.match(
      /(?:dj,?\s*)?(?:search\s+(?:my\s+)?knowledge\s+(?:base\s+)?for|what\s+do\s+you\s+know\s+about)\s+(.+)/i,
    );
    if (searchKnowledgeMatch) {
      const query = searchKnowledgeMatch[1].trim();
      const results = searchKnowledgeSources(knowledgeSources, query);
      if (results.length === 0) {
        return `I don't have any knowledge sources matching "${query}". You can add some at the Knowledge page.`;
      }
      const summary = results
        .slice(0, 3)
        .map(
          (s) =>
            `**${s.title}** (${s.sourceType})\n${s.content.slice(0, 300)}...`,
        )
        .join("\n\n");
      return `Here's what I found in your knowledge base for "${query}":\n\n${summary}`;
    }

    // Memory commands
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
      const memoryList = regularMemories
        .map((m, i) => `${i + 1}. ${m.content}`)
        .join("\n");
      return `Here's everything I remember:\n\n${memoryList}`;
    }

    // Reset memories
    if (lowerMessage.includes("reset all") && lowerMessage.includes("memor")) {
      const regularMemories = currentMemories.filter(
        (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
      );
      for (const m of regularMemories) {
        await deleteMemory.mutateAsync(m.id);
      }
      return "Done. All memories have been cleared. I'm starting fresh.";
    }

    // Custom command creation
    const commandMatch = userMessage.match(
      /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i,
    );
    if (commandMatch) {
      const [, name, action] = commandMatch;
      await createCommand.mutateAsync({ name, action });
      return `Understood. I've created the custom command "${name}". Activate it by saying "${name}".`;
    }

    // Rule setting
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

    // Personality adjustment
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
      return `Understood. I've adjusted my communication style to be more ${style}. This applies to all future responses.`;
    }

    // Module activation
    const activateMatch = userMessage.match(
      /(?:dj,?\s*)?activate\s+(?:the\s+)?(\w+)\s+module/i,
    );
    if (activateMatch) {
      const moduleName = activateMatch[1].toLowerCase();
      await activateModule.mutateAsync(moduleName);
      return `The ${moduleName} module has been activated.`;
    }

    const deactivateMatch = userMessage.match(
      /(?:dj,?\s*)?deactivate\s+(?:the\s+)?(\w+)\s+module/i,
    );
    if (deactivateMatch) {
      const moduleName = deactivateMatch[1].toLowerCase();
      await deactivateModule.mutateAsync(moduleName);
      return `The ${moduleName} module has been deactivated.`;
    }

    // ── TASKS MODULE ──────────────────────────────────────────────────────────
    // "remind me", "add task", "set reminder", "schedule"
    const taskMatch = userMessage.match(
      /(?:remind(?:er)?\s+me\s+(?:to\s+)?|add\s+(?:a\s+)?task[:\s]+|set\s+(?:a\s+)?reminder[:\s]+|schedule[:\s]+)(.+?)(?:\s+(?:at|by|on|before|today|tomorrow)\s+(.+))?$/i,
    );
    if (
      taskMatch ||
      lowerMessage.includes("add task") ||
      lowerMessage.includes("remind me") ||
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

      // Try to parse deadline from message
      let deadlineMs: bigint | null = null;
      const timePattern = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
      const timeInMsg = userMessage.match(timePattern);
      if (timeInMsg) {
        let hours = Number.parseInt(timeInMsg[1]);
        const minutes = Number.parseInt(timeInMsg[2]);
        const ampm = timeInMsg[3]?.toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
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

      if (titleRaw) {
        await addTask.mutateAsync({
          title: titleRaw,
          description: timeRaw ? `Scheduled: ${timeRaw}` : "",
          deadline: deadlineMs,
          priority: "medium",
        });
        const deadlineStr = deadlineMs
          ? ` at ${new Date(Number(deadlineMs) / 1_000_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
          : "";
        return `Task added: **${titleRaw}**${deadlineStr}. You can view and manage it in the Tasks section.`;
      }
    }

    // ── NOTES MODULE ──────────────────────────────────────────────────────────
    const noteMatch = userMessage.match(
      /(?:add\s+(?:a\s+)?note[:\s]+|note[:\s]+|save\s+(?:a\s+)?note[:\s]+|remember\s+this\s+note[:\s]+)(.+)/i,
    );
    if (noteMatch) {
      const noteContent = noteMatch[1].trim();
      const words = noteContent.split(" ").slice(0, 5).join(" ");
      await addNote.mutateAsync({
        title: words,
        content: noteContent,
        summary: noteContent.slice(0, 100),
        tags: [],
      });
      return `Note saved: **"${noteContent.slice(0, 60)}${noteContent.length > 60 ? "..." : ""}"**. Find it in your Notes section.`;
    }

    // ── FINANCE MODULE ─────────────────────────────────────────────────────────
    // "add expense Rs.100", "spent 500 on food", "income of 1000", "add today's expense"
    const financeMatch = userMessage.match(
      /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?|inr|₹|\$|usd)?\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:rs\.?|inr|₹|\$)?)?\s*(?:(?:on|for|as|from)\s+(.+))?/i,
    );
    const financeMatch2 = userMessage.match(
      /(?:rs\.?|inr|₹|\$|usd)\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:on|for|as|from)\s+(.+))?\s*(?:expense|income|earned?)?/i,
    );
    const fm = financeMatch || financeMatch2;
    if (fm) {
      const amountStr = fm[1];
      const descRaw = fm[2]?.trim() || "";
      const amount = Math.round(Number.parseFloat(amountStr) * 100);
      const isIncome = /income|earning|received?|got/i.test(userMessage);
      const category = isIncome ? "income" : descRaw || "general";
      const description = descRaw || (isIncome ? "Income" : "Expense");
      await addFinanceEntry.mutateAsync({
        amount: isIncome ? BigInt(amount) : BigInt(-amount),
        category,
        description,
        entryDate: BigInt(Date.now()) * BigInt(1_000_000),
      });
      const sign = isIncome ? "+" : "-";
      return `Finance entry recorded: **${sign}₹${Number.parseFloat(amountStr).toFixed(2)}** for **${description}**. View details in the Finance Tracker.`;
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
    const personalityContext = buildPersonalityContext();

    // Build personalized context from memories
    const regularMemories = currentMemories.filter(
      (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
    );

    // Greeting detection
    if (
      lowerMessage.match(
        /^(hello|hi|hey|good morning|good evening|good afternoon)[\s!.]*$/,
      )
    ) {
      const userName = regularMemories
        .find((m) => m.content.toLowerCase().includes("my name is"))
        ?.content.replace(/.*my name is\s+/i, "")
        .split(/[,. ]/)[0];
      const greeting = userName ? `Hello, ${userName}!` : "Hello!";
      if (style === "casual") {
        return `${greeting} What's up? How can I help you today?`;
      }
      return `${greeting} I'm DJ, your personal AI assistant. All systems are operational. How may I assist you?`;
    }

    // How are you
    if (
      lowerMessage.includes("how are you") ||
      lowerMessage.includes("how do you feel")
    ) {
      return style === "casual"
        ? "All good! Always ready to help. What do you need?"
        : "All systems operational and functioning optimally. How can I assist you today?";
    }

    // Help / capabilities
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do") ||
      lowerMessage.includes("capabilities")
    ) {
      return `Here's what I can do:\n\n- **Memory**: "DJ, remember [something]" / "DJ, forget [something]"\n- **Knowledge**: "DJ, what do you know about [topic]"\n- **Rules**: "DJ, your new rule is [rule]"\n- **Commands**: Create custom commands for tasks\n- **Modules**: Activate Excel, Coding, and Website modules\n- **Style**: "DJ, be more casual/formal/concise/detailed"\n\nI currently have ${regularMemories.length} memories stored. What would you like to do?`;
    }

    // Context-aware "tell me more about that" type messages
    if (
      (lowerMessage.includes("tell me more") ||
        lowerMessage.includes("explain that") ||
        lowerMessage.includes("more about") ||
        lowerMessage.includes("go on") ||
        lowerMessage.includes("continue")) &&
      conversationContext
    ) {
      // Find the last assistant message to expand on
      const lastAssistant = persistedMessagesRef.current
        .filter((m) => m.role === "assistant")
        .slice(-1)[0];
      if (lastAssistant) {
        return `Expanding on what I mentioned: ${lastAssistant.content}\n\nIs there a specific aspect you'd like me to elaborate on further?`;
      }
    }

    // What did I say / recap
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

    // Check knowledge sources for relevant context
    const validSources = knowledgeSources.filter((s) => s !== null);
    if (validSources.length > 0) {
      const { context, titles } = getRelevantContext(validSources, userMessage);
      if (context) {
        const intro =
          style === "concise"
            ? "From your knowledge base:"
            : "I found relevant information in your knowledge base:";
        return `${intro}\n\n${context.slice(0, 800)}\n\n---\n*Sources: ${titles.join(", ")}*`;
      }
    }

    // Use memories to personalize
    if (regularMemories.length > 0) {
      const relevantMemory = regularMemories.find((m) =>
        m.content
          .toLowerCase()
          .split(" ")
          .some((word) => word.length > 4 && lowerMessage.includes(word)),
      );
      if (relevantMemory) {
        const intro =
          style === "concise"
            ? "Based on what I know about you:"
            : "Based on what I know about you, I can provide better context:";
        return `${intro} ${relevantMemory.content}\n\nFor more specific help, please ask a more detailed question. Current rules: ${personalityContext}`;
      }
    }

    // Rules acknowledgment
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

    // Default contextual response
    const suggestions = [
      'Try: "DJ, remember [something important about you]"',
      'Try: "DJ, your new rule is [always use bullet points]"',
      'Try: "DJ, what do you know about [topic]"',
      'Try: "DJ, be more concise"',
    ];
    const suggestionIndex =
      persistedMessagesRef.current.length % suggestions.length;

    if (style === "concise") {
      return "Got it. Please use a specific command like 'DJ, remember...' or 'DJ, your new rule is...' for best results.";
    }

    return `I understand your message. I'm here to help with specific tasks and commands. ${suggestions[suggestionIndex]}\n\nI currently have ${regularMemories.length} memories and ${currentRules.length} behavior rules active.`;
  };

  const handleSend = async (messageOverride?: string) => {
    const messageText = messageOverride ?? input.trim();
    if (!messageText || isProcessing) return;

    setInput("");
    setIsProcessing(true);

    // Immediately show the user's message as optimistic
    const optimisticUserMsg: DisplayMessage = {
      id: `optimistic-user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: BigInt(Date.now()) * 1_000_000n,
      isOptimistic: true,
    };
    setOptimisticMessages([optimisticUserMsg]);

    try {
      await saveMessage.mutateAsync({ role: "user", content: messageText });
      const response = await parseCommand(messageText);

      // Add optimistic DJ response too so user sees it instantly
      const optimisticDJMsg: DisplayMessage = {
        id: `optimistic-dj-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: BigInt(Date.now() + 1) * 1_000_000n,
        isOptimistic: true,
      };
      setOptimisticMessages([optimisticUserMsg, optimisticDJMsg]);

      await saveMessage.mutateAsync({ role: "assistant", content: response });

      if (voiceEnabled) {
        speak(response);
      }
    } catch (_error) {
      toast.error("Failed to process message. Please try again.");
      setInput(messageText);
    } finally {
      setIsProcessing(false);
      setOptimisticMessages([]);
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

  const quickRuleSuggestions = [
    "Always respond in bullet points",
    "Keep responses under 3 sentences",
    "Always greet me by name",
  ];

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

      <div className="flex flex-col" style={{ height: "calc(100dvh - 4rem)" }}>
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messagesLoading ? (
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
                    Try: "DJ, remember my name is [your name]"
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Go to{" "}
                    <Link
                      to="/knowledge"
                      className="text-primary hover:underline"
                    >
                      <BookOpen className="inline h-3.5 w-3.5" /> Knowledge
                    </Link>{" "}
                    to add sources, or{" "}
                    <Link to="/teach" className="text-primary hover:underline">
                      Teach DJ
                    </Link>{" "}
                    to set preferences.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {allVisibleMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${message.isOptimistic ? "opacity-80" : ""}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "rounded-br-sm border border-primary/40 bg-primary/15 text-foreground"
                          : "rounded-bl-sm border border-secondary/40 bg-card/80 text-foreground"
                      }`}
                      style={
                        message.role === "user"
                          ? {
                              boxShadow: "0 0 10px oklch(0.65 0.25 220 / 0.25)",
                            }
                          : {
                              boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.15)",
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
                      </div>
                      <MessageContent content={message.content} />
                    </div>
                  </div>
                ))}

                {/* DJ thinking indicator */}
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

                {/* Speaking indicator */}
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

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar - fixed at bottom */}
        <div className="border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur">
          <div className="container mx-auto max-w-3xl">
            <div className="flex gap-2">
              {/* Voice input button */}
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                disabled={isProcessing}
                data-ocid="chat.toggle"
                title={isListening ? "Stop listening" : "Start voice input"}
                className={`shrink-0 ${
                  isListening
                    ? "animate-pulse bg-primary text-primary-foreground"
                    : "border-primary/50 hover:border-primary"
                }`}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>

              {/* TTS toggle */}
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled((v) => !v);
                }}
                data-ocid="chat.secondary_button"
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
                data-ocid="chat.submit_button"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Listening hint */}
            {isListening && (
              <p className="mt-1.5 text-center text-xs text-primary animate-pulse">
                Listening... speak now, then wait for the result
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
