"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquareCodeIcon, SendIcon, Loader2Icon, SparklesIcon, ClockIcon, XIcon, ImageIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeVideoSubject } from "@/app/actions/chat-analyst";
import { getChatHistory, saveChatHistory, clearChatHistory, type ChatMessage } from "@/app/actions/chat-history";
import { getIdToken } from "@/lib/firebase/client";
import { formatDuration } from "@/lib/format";

interface ChatAnalystProps {
  videoId: string;
  storageKey: string;
  onSeek: (seconds: number) => void;
}

export function ChatAnalyst({ videoId, storageKey, onSeek }: ChatAnalystProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch history from Firestore on mount
  useEffect(() => {
    let cancelled = false;
    
    async function fetchHistory() {
      try {
        const idToken = await getIdToken();
        if (!idToken) return;
        
        const result = await getChatHistory({ idToken, videoId });
        if (!cancelled && result.ok) {
          setMessages(result.messages);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    
    void fetchHistory();
    return () => { cancelled = true; };
  }, [videoId]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file for the reference screenshot.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputPrompt.trim() && !selectedFile) return;
    if (loading) return;

    let screenshotBase64 = "";
    if (selectedFile) {
      screenshotBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Couldn't read that image."));
        reader.readAsDataURL(selectedFile);
      });
    }

    const currentPrompt = inputPrompt.trim() || "Where does the subject in this screenshot appear?";

    const userMessage: ChatMessage = {
      role: "user",
      content: currentPrompt,
      screenshot: previewUrl ?? undefined,
    };

    // Optimistically update UI
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputPrompt("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setLoading(true);
    
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error("Please sign in again.");

      const result = await analyzeVideoSubject({
        idToken,
        videoId,
        storageKey,
        userPrompt: currentPrompt,
        screenshotBase64: screenshotBase64 || undefined,
      });

      if (!result.ok) {
        throw new Error(result.message || "Analysis failed.");
      }

      const finalMessages: ChatMessage[] = [
        ...updatedMessages,
        {
          role: "assistant",
          content: result.answer || "I've analyzed the video based on your request.",
          timestamps: result.events ?? [],
        },
      ];

      setMessages(finalMessages);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      // 2. Save the full array to Firestore silently in the background
      await saveChatHistory({ idToken, videoId, messages: finalMessages });

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat request failed.");
      // Revert optimistic update on failure
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      
      setMessages([]);
      await clearChatHistory({ idToken, videoId });
      toast.success("Chat history cleared.");
    } catch (err) {
      toast.error("Failed to clear chat history.");
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/50 p-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-red-500" />
          <h3 className="text-sm font-semibold text-neutral-100">AI Investigator</h3>
        </div>
        <div className="flex items-center gap-4">
          {messages.length > 0 && !initializing && (
            <button
              onClick={handleClearHistory}
              title="Clear History"
              className="text-neutral-500 transition-colors hover:text-red-400"
            >
              <TrashIcon className="size-4" />
            </button>
          )}
          <span className="ev-label text-neutral-500 hidden sm:inline-block">Gemini 3.6 Flash</span>
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {initializing ? (
          <div className="flex h-full items-center justify-center">
            <Loader2Icon className="size-6 animate-spin text-neutral-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-neutral-500">
            <MessageSquareCodeIcon className="mb-3 size-8 text-neutral-600" />
            <p className="max-w-xs text-sm">
              Ask questions about the footage above, or attach a screenshot to track a specific subject.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === "user" ? "bg-red-600 text-white" : "bg-neutral-950 border border-neutral-800 text-neutral-200"}`}>
                
                {msg.screenshot && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.screenshot} alt="User reference" className="mb-3 max-h-32 rounded-lg border border-neutral-700/50 object-cover shadow-sm" />
                )}
                
                <p className="leading-relaxed">{msg.content}</p>

                {msg.timestamps && msg.timestamps.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-neutral-800 pt-3">
                    <p className="ev-label text-neutral-500">Relevant Timestamps</p>
                    {msg.timestamps.map((ts, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSeek(ts.seconds)}
                        className="group flex w-full items-start justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-2.5 text-left transition-colors hover:border-red-500/50 hover:bg-neutral-900"
                      >
                        <div className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-red-400">
                          <ClockIcon className="size-3" />
                          {formatDuration(ts.seconds)}
                        </div>
                        <span className="text-xs text-neutral-300 group-hover:text-neutral-100">{ts.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex w-full justify-start">
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-400">
              <Loader2Icon className="size-4 animate-spin text-red-500" />
              Scanning video frames...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSend} className="border-t border-neutral-800 bg-neutral-950 p-4">
        {previewUrl && (
          <div className="mb-3 flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-2 px-3 shadow-inner">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="size-8 rounded object-cover border border-neutral-700" />
              <span className="text-xs text-neutral-300">Reference image attached</span>
            </div>
            <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="rounded-md bg-neutral-800 p-1 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white">
              <XIcon className="size-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
          <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} className="shrink-0 border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white">
            <ImageIcon className="size-4" />
          </Button>
          
          <Input
            placeholder="Ask a question or upload a subject..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading || initializing}
            className="flex-1 border-neutral-800 bg-neutral-900 text-neutral-100"
          />
          
          <Button type="submit" disabled={loading || initializing || (!inputPrompt.trim() && !selectedFile)} className="shrink-0 bg-red-600 text-white hover:bg-red-700">
            <SendIcon className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}