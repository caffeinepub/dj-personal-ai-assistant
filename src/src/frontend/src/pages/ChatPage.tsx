import { useEffect, useState, useRef } from "react";
import { Layout } from "../components/Layout";
import {
  useChatMessages,
  useSaveChatMessage,
  useAddMemory,
  useDeleteMemory,
  useMemories,
  useCreateCustomCommand,
  useSetBehaviorRule,
  useSetPersonalitySettings,
  useActivateModule,
  useDeactivateModule,
  usePersonalitySettings,
} from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function ChatPage() {
  const { data: messages = [] } = useChatMessages();
  const { data: memories = [] } = useMemories();
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
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    // Wake word detection
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();
        if (transcript.includes("hey dj") || transcript.includes("hey dj")) {
          setIsWakeWordActive(true);
          toast.success("DJ activated! Listening...");
          startVoiceInput();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

    recognition.onresult = (event: any) => {
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
  };

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

    // Remember command
    if (lowerMessage.startsWith("dj, remember ") || lowerMessage.startsWith("remember ")) {
      const content = userMessage.replace(/^(dj,?\s*)?remember\s*/i, "").trim();
      if (content) {
        await addMemory.mutateAsync(content);
        return "Understood. I've updated myself accordingly. This memory has been stored.";
      }
    }

    // Forget command
    if (lowerMessage.startsWith("dj, forget ") || lowerMessage.startsWith("forget ")) {
      const content = userMessage.replace(/^(dj,?\s*)?forget\s*/i, "").trim();
      const matchingMemory = memories.find((m) =>
        m.content.toLowerCase().includes(content.toLowerCase())
      );
      if (matchingMemory) {
        await deleteMemory.mutateAsync(matchingMemory.id);
        return "Understood. I've deleted that memory from my records.";
      }
      return "I couldn't find a matching memory to forget.";
    }

    // What do you remember
    if (
      lowerMessage.includes("what do you remember") ||
      lowerMessage.includes("show memories")
    ) {
      if (memories.length === 0) {
        return "I don't have any stored memories yet. You can teach me by saying 'DJ, remember [something]'.";
      }
      const memoryList = memories.map((m, i) => `${i + 1}. ${m.content}`).join("\n");
      return `Here's everything I remember:\n\n${memoryList}`;
    }

    // Create custom command
    const commandMatch = userMessage.match(
      /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i
    );
    if (commandMatch) {
      const [, name, action] = commandMatch;
      await createCommand.mutateAsync({ name, action });
      return `Understood. I've created the custom command "${name}". You can activate it by saying "${name}".`;
    }

    // Set behavior rule
    if (lowerMessage.includes("your new rule is") || lowerMessage.includes("set rule:")) {
      const rule = userMessage.replace(/^(dj,?\s*)?(?:your\s+new\s+rule\s+is|set\s+rule:)\s*/i, "").trim();
      if (rule) {
        await setBehaviorRule.mutateAsync(rule);
        return "Understood. I've set that as a new behavior rule and will follow it going forward.";
      }
    }

    // Personality adjustments
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

    // Module activation
    const activateMatch = userMessage.match(/(?:dj,?\s*)?activate\s+(?:the\s+)?(\w+)\s+module/i);
    if (activateMatch) {
      const moduleName = activateMatch[1].toLowerCase();
      await activateModule.mutateAsync(moduleName);
      return `The ${moduleName} module has been activated and is now ready for use.`;
    }

    // Module deactivation
    const deactivateMatch = userMessage.match(
      /(?:dj,?\s*)?deactivate\s+(?:the\s+)?(\w+)\s+module/i
    );
    if (deactivateMatch) {
      const moduleName = deactivateMatch[1].toLowerCase();
      await deactivateModule.mutateAsync(moduleName);
      return `The ${moduleName} module has been deactivated.`;
    }

    // Default response
    return generateResponse(userMessage);
  };

  const generateResponse = (userMessage: string): string => {
    const style = personalitySettings?.communicationStyle || "professional";
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return style === "casual"
        ? "Hey! What's up? How can I help?"
        : "Greetings. I'm DJ, your personal AI assistant. How may I assist you today?";
    }

    // How are you
    if (lowerMessage.includes("how are you")) {
      return style === "casual"
        ? "I'm doing great! Always ready to help. What do you need?"
        : "All systems operational. I'm functioning optimally and ready to assist you.";
    }

    // Help request
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      return `I can help you with:

- **Memory**: Remember important information ("DJ, remember [something]")
- **Commands**: Create custom commands ("DJ, create command called [name] that does [action]")
- **Rules**: Set behavior rules ("DJ, your new rule is [rule]")
- **Modules**: Activate/deactivate Excel, Coding, and Website modules
- **Analysis**: Upload and analyze spreadsheets
- **Coding**: Write and debug code
- **Websites**: Generate website templates

What would you like to do?`;
    }

    // Default intelligent response
    return style === "concise"
      ? "I'm here to help. Please specify what you need."
      : "I understand your message. For specific tasks, please use commands like 'DJ, remember [something]' or ask me to activate a module. How can I assist you further?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    try {
      // Save user message
      await saveMessage.mutateAsync({ role: "user", content: userMessage });

      // Parse and generate response
      const response = await parseCommand(userMessage);

      // Save assistant response
      await saveMessage.mutateAsync({ role: "assistant", content: response });

      // Speak response
      speak(response);
    } catch (error) {
      toast.error("Failed to process message");
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <div className="container mx-auto flex flex-1 flex-col px-4 py-4">
          {/* Chat messages */}
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Card className="glow-border border-primary/50 p-8 text-center">
                  <p className="glow-text font-display text-xl">
                    Start a conversation with DJ
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Try saying: "DJ, remember my favorite color is blue"
                  </p>
                </Card>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id.toString()}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-[80%] ${
                        message.role === "user"
                          ? "border-primary/50 bg-primary/10"
                          : "glow-border border-secondary/50 bg-card"
                      }`}
                    >
                      <div className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant={message.role === "user" ? "default" : "secondary"}>
                            {message.role === "user" ? "You" : "DJ"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              )}
              {(saveMessage.isPending || isSpeaking) && (
                <div className="flex justify-start">
                  <Card className="glow-border border-secondary/50">
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                        <span className="text-sm text-muted-foreground">
                          {isSpeaking ? "DJ is speaking..." : "DJ is thinking..."}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="mt-4 space-y-2">
            {isWakeWordActive && (
              <div className="glow-border rounded-lg border-secondary bg-secondary/10 p-2 text-center">
                <p className="text-sm text-secondary">Voice command activated</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={startVoiceInput}
                disabled={isListening}
                className={isListening ? "animate-pulse bg-primary" : ""}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Input
                placeholder="Type a message or use voice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1 border-primary/50 bg-card"
                disabled={saveMessage.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || saveMessage.isPending}
                className="bg-primary hover:bg-primary/90"
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
