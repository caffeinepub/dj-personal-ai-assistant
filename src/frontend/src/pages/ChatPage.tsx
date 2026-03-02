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
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useActivateModule,
  useAddMemory,
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
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
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

function MessageContent({ content }: { content: string }) {
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
      {content}
    </div>
  );
}

export function ChatPage() {
  const { data: rawMessages = [] } = useChatMessages();
  // Sort messages oldest-first so the latest message always appears at the bottom
  const messages = [...rawMessages].sort((a, b) =>
    a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
  );
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

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const isFirstLoad = useRef(true);

  // Auto-scroll to bottom: instant on initial load, smooth on new messages
  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
        isFirstLoad.current = false;
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  // Show smart suggestions after 3+ messages
  useEffect(() => {
    if (messages.length >= 3 && rules.length === 0) {
      setShowSuggestions(true);
    }
  }, [messages.length, rules.length]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startVoiceInput = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const parseCommand = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Knowledge search commands
    const knowledgeSources = memories
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

    if (
      lowerMessage.startsWith("dj, remember ") ||
      lowerMessage.startsWith("remember ")
    ) {
      const content = userMessage.replace(/^(dj,?\s*)?remember\s*/i, "").trim();
      if (content) {
        await addMemory.mutateAsync(content);
        return "Understood. I've updated myself accordingly. This memory has been stored.";
      }
    }

    if (
      lowerMessage.startsWith("dj, forget ") ||
      lowerMessage.startsWith("forget ")
    ) {
      const content = userMessage.replace(/^(dj,?\s*)?forget\s*/i, "").trim();
      const matchingMemory = memories.find(
        (m) =>
          !m.content.startsWith("[KNOWLEDGE_SOURCE]") &&
          m.content.toLowerCase().includes(content.toLowerCase()),
      );
      if (matchingMemory) {
        await deleteMemory.mutateAsync(matchingMemory.id);
        return "Understood. I've deleted that memory from my records.";
      }
      return "I couldn't find a matching memory to forget.";
    }

    if (
      lowerMessage.includes("what do you remember") ||
      lowerMessage.includes("show memories")
    ) {
      const regularMemories = memories.filter(
        (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]"),
      );
      if (regularMemories.length === 0) {
        return "I don't have any stored memories yet. You can teach me by saying 'DJ, remember [something]'.";
      }
      const memoryList = regularMemories
        .map((m, i) => `${i + 1}. ${m.content}`)
        .join("\n");
      return `Here's everything I remember:\n\n${memoryList}`;
    }

    const commandMatch = userMessage.match(
      /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i,
    );
    if (commandMatch) {
      const [, name, action] = commandMatch;
      await createCommand.mutateAsync({ name, action });
      return `Understood. I've created the custom command "${name}". You can activate it by saying "${name}".`;
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
          priority: BigInt(rules.length + 1),
        });
        return "Understood. I've set that as a new behavior rule and will follow it going forward.";
      }
    }

    if (
      lowerMessage.includes("be more formal") ||
      lowerMessage.includes("be more casual") ||
      lowerMessage.includes("be more concise") ||
      lowerMessage.includes("be more detailed")
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
      const moduleName = activateMatch[1].toLowerCase();
      await activateModule.mutateAsync(moduleName);
      return `The ${moduleName} module has been activated and is now ready for use.`;
    }

    const deactivateMatch = userMessage.match(
      /(?:dj,?\s*)?deactivate\s+(?:the\s+)?(\w+)\s+module/i,
    );
    if (deactivateMatch) {
      const moduleName = deactivateMatch[1].toLowerCase();
      await deactivateModule.mutateAsync(moduleName);
      return `The ${moduleName} module has been deactivated.`;
    }

    return generateResponse(userMessage, knowledgeSources);
  };

  const generateResponse = (
    userMessage: string,
    knowledgeSources: ReturnType<typeof parseKnowledgeSource>[] = [],
  ): string => {
    const style = personalitySettings?.communicationStyle || "professional";
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return style === "casual"
        ? "Hey! What's up? How can I help?"
        : "Greetings. I'm DJ, your personal AI assistant. How may I assist you today?";
    }

    if (lowerMessage.includes("how are you")) {
      return style === "casual"
        ? "I'm doing great! Always ready to help. What do you need?"
        : "All systems operational. I'm functioning optimally and ready to assist you.";
    }

    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do")
    ) {
      return `I can help you with:\n\n- Memory: "DJ, remember [something]"\n- Knowledge: "DJ, search my knowledge for [topic]" or "DJ, what do you know about [topic]"\n- Commands: "DJ, create command called [name] that does [action]"\n- Rules: "DJ, your new rule is [rule]"\n- Modules: Activate/deactivate Excel, Coding, and Website modules\n\nWhat would you like to do?`;
    }

    // Check knowledge sources for relevant context
    const validSources = knowledgeSources.filter((s) => s !== null);
    if (validSources.length > 0) {
      const { context, titles } = getRelevantContext(validSources, userMessage);
      if (context) {
        const baseResponse =
          style === "concise"
            ? "Based on your knowledge sources:"
            : "I found relevant information in your knowledge base that may help:";
        return `${baseResponse}\n\n${context.slice(0, 800)}\n\n---\n*Based on your knowledge sources: ${titles.join(", ")}*`;
      }
    }

    return style === "concise"
      ? "I'm here to help. Please specify what you need."
      : "I understand your message. For specific tasks, please use commands like 'DJ, remember [something]' or ask me to activate a module. How can I assist you further?";
  };

  const handleSend = async () => {
    if (!input.trim() || saveMessage.isPending) return;

    const userMessage = input.trim();
    setInput("");

    try {
      await saveMessage.mutateAsync({ role: "user", content: userMessage });
      const response = await parseCommand(userMessage);
      await saveMessage.mutateAsync({ role: "assistant", content: response });
      speak(response);
    } catch (_error) {
      toast.error("Failed to process message");
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
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
                Smart suggestion:
              </span>
              {quickRuleSuggestions.map((rule) => (
                <button
                  key={rule}
                  type="button"
                  onClick={async () => {
                    await setBehaviorRule.mutateAsync({
                      ruleText: rule,
                      priority: BigInt(rules.length + 1),
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
            <button type="button" onClick={() => setShowSuggestions(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      <div
        className="flex h-[calc(100vh-4rem)] flex-col md:h-[calc(100vh-4rem)]"
        style={{ height: "calc(100dvh - 4rem)" }}
      >
        {/* Messages area - scrollable, fills remaining space */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="glow-border rounded-lg border border-primary/50 p-8 text-center">
                  <p className="glow-text font-display text-xl">
                    Start a conversation with DJ
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Try: "DJ, what do you know about [topic]"
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Go to{" "}
                    <Link
                      to="/knowledge"
                      className="text-primary hover:underline"
                    >
                      <BookOpen className="inline h-3.5 w-3.5" /> Knowledge
                    </Link>{" "}
                    to add websites & documents, or{" "}
                    <Link to="/teach" className="text-primary hover:underline">
                      Teach DJ
                    </Link>{" "}
                    to set preferences.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id.toString()}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "border border-primary/40 bg-primary/15 text-foreground"
                        : "border border-secondary/40 bg-card/80 text-foreground"
                    }`}
                    style={
                      message.role === "user"
                        ? { boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.3)" }
                        : { boxShadow: "0 0 8px oklch(0.75 0.18 195 / 0.2)" }
                    }
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Badge
                        variant={
                          message.role === "user" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {message.role === "user" ? "You" : "DJ"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <MessageContent content={message.content} />
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {(saveMessage.isPending || isSpeaking) && (
              <div className="flex justify-start">
                <div
                  className="rounded-lg border border-secondary/40 bg-card/80 px-4 py-3"
                  style={{ boxShadow: "0 0 8px oklch(0.75 0.18 195 / 0.2)" }}
                >
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                    <span className="text-sm text-muted-foreground">
                      {isSpeaking ? "DJ is speaking..." : "DJ is thinking..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar - fixed at bottom */}
        <div className="border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur">
          <div className="container mx-auto max-w-3xl">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={startVoiceInput}
                disabled={isListening}
                className={`shrink-0 ${isListening ? "animate-pulse bg-primary" : "border-primary/50"}`}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              <Input
                placeholder="Type a message or use voice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                className="flex-1 border-primary/40 bg-card/50"
                disabled={saveMessage.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || saveMessage.isPending}
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                {saveMessage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
