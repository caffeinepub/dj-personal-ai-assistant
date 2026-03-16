import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Shared type declarations
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionResultEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: { transcript: string };
}

export interface SpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

export interface UseSpeechRecognitionOptions {
  /** Called with the final transcript when a result is received */
  onResult: (transcript: string) => void;
  /** Called when an error occurs. Defaults to showing a toast. */
  onError?: (error: string) => void;
  /** Called when recognition ends (either naturally or via stop()) */
  onEnd?: () => void;
  lang?: string;
}

/**
 * Shared hook for one-shot (non-continuous) speech recognition.
 * Handles cleanup on unmount so the mic is never left open.
 */
export function useSpeechRecognition({
  onResult,
  onError,
  onEnd,
  lang = "en-US",
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const onEndRef = useRef(onEnd);
  onResultRef.current = onResult;
  onErrorRef.current = onError;
  onEndRef.current = onEnd;

  const isSupported = isSpeechRecognitionSupported();

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      toast.error("Speech recognition not supported. Try Chrome or Edge.");
      return;
    }

    // Abort any previous instance
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      onResultRef.current(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      const errCode = event.error;
      if (onErrorRef.current) {
        onErrorRef.current(errCode);
      } else {
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
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      onEndRef.current?.();
    };

    recognition.start();
  }, [lang]);

  // Cleanup on unmount — mic must never stay open
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, start, stop, isSupported };
}
