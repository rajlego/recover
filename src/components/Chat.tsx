import { useState, useEffect, useRef, useCallback } from "react";
import { useSessionStore } from "../store/sessionStore";
import { useSettingsStore } from "../store/settingsStore";
import { useHistoryStore } from "../store/historyStore";
import { streamAI } from "../ai/aiService";
import { buildSystemPrompt } from "../ai/systemPrompt";
import { getProtocolById } from "../protocols";
import { MarkdownContent } from "./MarkdownContent";
import { ProtocolPicker } from "./ProtocolPicker";
import { Avatar, useAvatarUpdate } from "./Avatar";
import type { LLMMessage } from "../models/types";

export function Chat() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

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
  const { updateAvatar } = useAvatarUpdate();

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

  // Core: stream an AI response
  const streamResponse = useCallback(
    async (extraUserMsg?: string, protocolId?: string) => {
      if (isStreaming || !hasApiKey) return;

      const protocol = protocolId
        ? getProtocolById(protocolId)
        : activeSession?.protocolId
          ? getProtocolById(activeSession.protocolId)
          : null;

      const currentMessages = useSessionStore.getState().getMessages();

      const llmMessages: LLMMessage[] = [
        {
          role: "system",
          content: buildSystemPrompt(protocol ?? null, historySessions),
        },
        ...currentMessages
          .filter((m) => m.content)
          .slice(-20)
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
      ];

      if (extraUserMsg) {
        llmMessages.push({ role: "user", content: extraUserMsg });
      }

      const assistantMsgId = addMessage("assistant", "");
      setStreamingMsgId(assistantMsgId);
      setIsStreaming(true);

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

        const finalContent = fullContent || "I'm here. What's going on?";
        updateMessage(assistantMsgId, finalContent);

        // Update avatar mood/image based on response
        if (settings.falApiKey && finalContent) {
          updateAvatar(finalContent, settings.falApiKey);
        }
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
    [isStreaming, hasApiKey, activeSession, addMessage, updateMessage, historySessions, settings]
  );

  const sendMessage = useCallback(
    async (text: string, protocolId?: string) => {
      if (!text.trim() || isStreaming || !hasApiKey) return;

      if (!activeSession) {
        startSession(protocolId);
      }

      const userText = text.trim();
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";

      addMessage("user", userText);
      await streamResponse(userText, protocolId);
    },
    [isStreaming, hasApiKey, activeSession, startSession, addMessage, streamResponse]
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
  }, [activeSession, completeSession, addSession]);

  const handleProtocolSelect = useCallback(
    (protocolId: string | null) => {
      if (activeSession) {
        const completed = completeSession();
        if (completed) addSession(completed);
      }

      startSession(protocolId || undefined);

      const protocol = protocolId ? getProtocolById(protocolId) : null;
      const greeting = protocol
        ? `The user just selected the "${protocol.name}" protocol. Begin guiding them through it. Start with a warm, brief greeting and the first step.`
        : `The user wants to talk freely. Greet them warmly and ask what's going on. Keep it brief — 1-2 sentences.`;

      setTimeout(() => {
        streamResponse(greeting, protocolId || undefined);
      }, 50);
    },
    [activeSession, completeSession, addSession, startSession, streamResponse]
  );

  // No API key
  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <h2
          className="text-xl mb-2"
          style={{ color: "var(--astral-text)" }}
        >
          Welcome to Recover
        </h2>
        <p
          className="text-sm mb-4 max-w-sm"
          style={{ color: "var(--astral-text-dim)" }}
        >
          To get started, add your Google AI Studio API key in Settings.
        </p>
        <p className="text-xs" style={{ color: "var(--astral-text-dim)" }}>
          Press Cmd+Shift+, for Settings
        </p>
      </div>
    );
  }

  // No active session — protocol picker
  if (!activeSession) {
    return (
      <div className="flex flex-col h-full">
        <ProtocolPicker onSelect={handleProtocolSelect} />
        <div className="chat-input-bar p-4">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <textarea
              ref={inputRef}
              className="astral-input flex-1 resize-none text-sm rounded-xl px-4 py-2.5 min-h-[2.5rem] outline-none"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleProtocolSelect(null);
                    setTimeout(() => sendMessage(input), 100);
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
      {/* Session bar: avatar + protocol indicator */}
      <div
        className="px-5 py-2 shrink-0"
        style={{
          borderBottom: "1px solid var(--astral-border)",
          background: "rgba(8, 11, 22, 0.4)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {settings.falApiKey && (
            <Avatar falApiKey={settings.falApiKey} />
          )}
          {activeSession.protocolId && (
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: "var(--astral-accent)" }}
            >
              {getProtocolById(activeSession.protocolId)?.name}
            </span>
          )}
          {!activeSession.protocolId && (
            <span
              className="text-xs tracking-wide"
              style={{ color: "var(--astral-text-dim)" }}
            >
              free talk
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => {
            if (!msg.content && streamingMsgId !== msg.id) return null;
            return (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "msg-user rounded-br-md"
                      : "msg-assistant rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className={`relative astral-prose ${streamingMsgId === msg.id ? "streaming-active" : ""}`}>
                      {msg.content ? (
                        <MarkdownContent content={msg.content} />
                      ) : null}
                      {streamingMsgId === msg.id && (
                        <span className="streaming-cursor" />
                      )}
                    </div>
                  ) : (
                    <p
                      className="text-sm whitespace-pre-wrap"
                      style={{ color: "var(--astral-text)" }}
                    >
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="chat-input-bar p-4">
        <div className="flex gap-2 max-w-2xl mx-auto items-end">
          <button
            className="p-2 rounded-lg transition-all hover:bg-[var(--astral-glow)]"
            style={{ color: "var(--astral-text-dim)" }}
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
            className="astral-input flex-1 resize-none text-sm rounded-xl px-4 py-2.5 min-h-[2.5rem] outline-none"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Thinking..." : "What's going on?..."}
            rows={1}
            disabled={isStreaming}
          />
          <button
            className="btn-astral p-2.5 rounded-xl"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <span
                className="loading loading-spinner loading-xs"
                style={{ color: "var(--astral-accent)" }}
              />
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
