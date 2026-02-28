import { useState, useEffect, useRef, useCallback } from "react";
import { useSessionStore } from "../store/sessionStore";
import { useSettingsStore } from "../store/settingsStore";
import { useHistoryStore } from "../store/historyStore";
import { streamAI } from "../ai/aiService";
import { buildSystemPrompt } from "../ai/systemPrompt";
import { getProtocolById } from "../protocols";
import { MarkdownContent } from "./MarkdownContent";
import { ProtocolPicker } from "./ProtocolPicker";
import type { LLMMessage } from "../models/types";

export function Chat() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [showProtocols, setShowProtocols] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const {
    activeSession,
    addMessage,
    updateMessage,
    getMessages,
    startSession,
    completeSession,
  } = useSessionStore();

  const settings = useSettingsStore();
  const { sessions: historySessions, addSession } = useHistoryStore();

  const messages = getMessages();
  const hasApiKey = !!(settings.geminiApiKey || settings.openRouterApiKey);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  // Focus input on mount and after streaming
  useEffect(() => {
    if (!isStreaming) {
      inputRef.current?.focus();
    }
  }, [isStreaming]);

  // Auto-resize textarea
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const ta = e.target;
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string, protocolId?: string) => {
      if (!text.trim() || isStreaming || !hasApiKey) return;

      // Start session if needed
      if (!activeSession) {
        startSession(protocolId);
      }

      const userText = text.trim();
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";

      addMessage("user", userText);
      const assistantMsgId = addMessage("assistant", "");
      setStreamingMsgId(assistantMsgId);
      setIsStreaming(true);

      const protocol = (activeSession?.protocolId || protocolId)
        ? getProtocolById(activeSession?.protocolId || protocolId || "")
        : null;

      const currentMessages = useSessionStore.getState().getMessages();
      const llmMessages: LLMMessage[] = [
        {
          role: "system",
          content: buildSystemPrompt(protocol ?? null, historySessions),
        },
        ...currentMessages.slice(0, -1).slice(-20).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userText },
      ];

      try {
        abortRef.current = new AbortController();
        let fullContent = "";
        let lastUpdate = 0;
        const THROTTLE = 80;

        for await (const chunk of streamAI(llmMessages, {
          geminiApiKey: settings.geminiApiKey,
          openRouterApiKey: settings.openRouterApiKey,
          primaryProvider: settings.primaryProvider,
          geminiModel: settings.geminiModel,
          openRouterModel: settings.openRouterModel,
        })) {
          fullContent += chunk;
          const now = Date.now();
          if (now - lastUpdate >= THROTTLE) {
            updateMessage(assistantMsgId, fullContent);
            lastUpdate = now;
          }
        }

        updateMessage(
          assistantMsgId,
          fullContent || "I'm here. What's going on?"
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Something went wrong";
        updateMessage(
          assistantMsgId,
          `Something went wrong: ${errorMsg}\n\nTry again, or check your API key in Settings.`
        );
      } finally {
        setIsStreaming(false);
        setStreamingMsgId(null);
        abortRef.current = null;
      }
    },
    [
      isStreaming,
      hasApiKey,
      activeSession,
      startSession,
      addMessage,
      updateMessage,
      historySessions,
      settings,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  const handleNewSession = useCallback(() => {
    if (activeSession) {
      const completed = completeSession();
      if (completed) addSession(completed);
    }
    setShowProtocols(false);
  }, [activeSession, completeSession, addSession]);

  const handleProtocolSelect = useCallback(
    (protocolId: string | null) => {
      if (activeSession) {
        const completed = completeSession();
        if (completed) addSession(completed);
      }
      startSession(protocolId || undefined);
      setShowProtocols(false);
      inputRef.current?.focus();
    },
    [activeSession, completeSession, addSession, startSession]
  );

  // No API key — show gentle prompt
  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <h2 className="text-xl text-base-content/60 mb-2">
          Welcome to Recover
        </h2>
        <p className="text-sm text-base-content/40 mb-4 max-w-sm">
          To get started, add your Google AI Studio API key in Settings.
        </p>
        <p className="text-xs text-base-content/30">
          Press{" "}
          <kbd className="kbd kbd-xs">Cmd</kbd>+
          <kbd className="kbd kbd-xs">Shift</kbd>+
          <kbd className="kbd kbd-xs">,</kbd>{" "}
          for Settings
        </p>
      </div>
    );
  }

  // No active session and no messages — show protocol picker or empty state
  if (!activeSession && messages.length === 0 && !showProtocols) {
    return (
      <div className="flex flex-col h-full">
        <ProtocolPicker onSelect={handleProtocolSelect} />
        <div className="p-4 border-t border-base-300">
          <div className="flex gap-2 max-w-xl mx-auto">
            <textarea
              ref={inputRef}
              className="textarea textarea-bordered flex-1 resize-none text-sm min-h-[2.5rem]"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    startSession();
                    sendMessage(input);
                  }
                }
              }}
              placeholder="Or just start typing..."
              rows={1}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-content rounded-br-md"
                    : "bg-base-200 text-base-content rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="relative">
                    <MarkdownContent content={msg.content} />
                    {streamingMsgId === msg.id && (
                      <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-text-bottom" />
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-base-300">
        <div className="flex gap-2 max-w-xl mx-auto items-end">
          <button
            className="btn btn-ghost btn-sm btn-square text-base-content/30 hover:text-base-content/60 self-end"
            onClick={handleNewSession}
            title="New session"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </button>
          <textarea
            ref={inputRef}
            className="textarea textarea-bordered flex-1 resize-none text-sm min-h-[2.5rem]"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Thinking..." : "What's going on?..."}
            rows={1}
            disabled={isStreaming}
          />
          <button
            className="btn btn-primary btn-sm self-end"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
