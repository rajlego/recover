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
import { useRewardStore, REWARDS } from "../store/rewardStore";
import { useTrustStore } from "../store/trustStore";
import type { LLMMessage } from "../models/types";

function timeRemaining(dueBy: string): string {
  const ms = new Date(dueBy).getTime() - Date.now();
  if (ms <= 0) return "overdue";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m left`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

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
  const { addReward, updateStreak } = useRewardStore();
  const trustStore = useTrustStore();

  const [showLoanPrompt, setShowLoanPrompt] = useState(false);
  const [loanCommitment, setLoanCommitment] = useState("");
  const [loanFlash, setLoanFlash] = useState<string | null>(null);

  // Expire overdue loans on mount
  useEffect(() => {
    trustStore.expireOverdueLoans();
    trustStore.applyDailyDecay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      const trustState = useTrustStore.getState();
      const trustCredit = {
        score: trustState.creditScore,
        maxSize: trustState.getMaxLoanSize(),
        activeLoans: trustState.getActiveLoans().length,
      };

      const llmMessages: LLMMessage[] = [
        {
          role: "system",
          content: buildSystemPrompt(protocol ?? null, historySessions, trustCredit),
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
      if (completed) {
        addSession(completed);
        addReward(
          "session_complete",
          REWARDS.session_complete,
          "Completed a recovery session"
        );
        updateStreak();
      }
    }
  }, [activeSession, completeSession, addSession, addReward, updateStreak]);

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

  const handleMakeLoan = useCallback(() => {
    if (!loanCommitment.trim()) return;
    const maxSize = trustStore.getMaxLoanSize();

    // Calculate due time based on loan size
    const now = new Date();
    let dueBy: Date;
    switch (maxSize) {
      case "micro":
        dueBy = new Date(now.getTime() + 15 * 60 * 1000); // 15 min
        break;
      case "small":
        dueBy = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
        break;
      case "medium":
        dueBy = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
        break;
      case "large":
        dueBy = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month
        break;
    }

    trustStore.createLoan(
      loanCommitment.trim(),
      maxSize,
      dueBy.toISOString(),
      activeSession?.id
    );
    setLoanCommitment("");
    setShowLoanPrompt(false);
  }, [loanCommitment, trustStore, activeSession]);

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

      {/* Loan kept flash */}
      {loanFlash && (
        <div className="px-4 pb-1">
          <div
            className="max-w-2xl mx-auto text-center text-xs py-1.5 rounded-lg animate-pulse"
            style={{
              background: "rgba(100, 255, 180, 0.1)",
              color: "rgb(100, 255, 180)",
              border: "1px solid rgba(100, 255, 180, 0.2)",
            }}
          >
            {loanFlash}
          </div>
        </div>
      )}

      {/* Active loans banner */}
      {trustStore.getActiveLoans().length > 0 && !showLoanPrompt && (
        <div className="px-4 pb-1">
          <div className="max-w-2xl mx-auto">
            {trustStore.getActiveLoans().slice(0, 3).map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between px-3 py-1.5 mb-1 rounded-lg text-xs"
                style={{
                  background: "rgba(100, 140, 255, 0.06)",
                  border: "1px solid rgba(100, 140, 255, 0.12)",
                }}
              >
                <span style={{ color: "var(--astral-text-dim)" }}>
                  <span
                    className="font-mono mr-1.5 px-1 rounded"
                    style={{
                      background: "rgba(100, 140, 255, 0.1)",
                      color: "var(--astral-accent)",
                      fontSize: "9px",
                    }}
                  >
                    {loan.size.toUpperCase()}
                  </span>
                  {loan.commitment}
                  <span
                    className="font-mono ml-1.5"
                    style={{
                      fontSize: "9px",
                      color: timeRemaining(loan.dueBy) === "overdue"
                        ? "rgb(255, 140, 140)"
                        : "var(--astral-text-dim)",
                      opacity: 0.7,
                    }}
                  >
                    {timeRemaining(loan.dueBy)}
                  </span>
                </span>
                <div className="flex gap-1 ml-2 shrink-0">
                  <button
                    className="px-2 py-0.5 rounded text-[10px] transition-all"
                    style={{
                      background: "rgba(100, 255, 180, 0.1)",
                      color: "rgb(100, 255, 180)",
                    }}
                    onClick={() => {
                      trustStore.resolveLoan(loan.id, "kept");
                      addReward("loan_kept", 5, `Kept loan: ${loan.commitment}`);
                      setLoanFlash(`+${loan.size === "micro" ? 3 : loan.size === "small" ? 5 : loan.size === "medium" ? 8 : 12} credit — nice!`);
                      setTimeout(() => setLoanFlash(null), 2000);
                    }}
                  >
                    kept
                  </button>
                  <button
                    className="px-2 py-0.5 rounded text-[10px] transition-all"
                    style={{
                      background: "rgba(255, 100, 100, 0.1)",
                      color: "rgb(255, 140, 140)",
                    }}
                    onClick={() => trustStore.resolveLoan(loan.id, "broken")}
                  >
                    broke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make a loan prompt */}
      {showLoanPrompt && (
        <div className="px-4 pb-2">
          <div
            className="max-w-2xl mx-auto p-3 rounded-xl space-y-2"
            style={{
              background: "var(--astral-surface)",
              border: "1px solid var(--astral-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: "var(--astral-accent)" }}>
                Make a loan to yourself
              </span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(100, 140, 255, 0.1)",
                  color: "var(--astral-accent)",
                }}
              >
                credit: {trustStore.creditScore} / max: {trustStore.getMaxLoanSize()}
              </span>
            </div>
            <input
              type="text"
              className="astral-input w-full rounded-lg px-3 py-2 text-sm outline-none"
              value={loanCommitment}
              onChange={(e) => setLoanCommitment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleMakeLoan();
                if (e.key === "Escape") setShowLoanPrompt(false);
              }}
              placeholder={
                trustStore.getMaxLoanSize() === "micro"
                  ? "Something tiny — doable in 15 min..."
                  : trustStore.getMaxLoanSize() === "small"
                    ? "Something small — doable in the next hour..."
                    : trustStore.getMaxLoanSize() === "medium"
                      ? "Something for this week..."
                      : "Something ambitious for this month..."
              }
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                className="text-xs px-2 py-1 rounded-lg transition-all"
                style={{ color: "var(--astral-text-dim)" }}
                onClick={() => setShowLoanPrompt(false)}
              >
                Cancel
              </button>
              <button
                className="btn-astral text-xs px-3 py-1 rounded-lg"
                onClick={handleMakeLoan}
                disabled={!loanCommitment.trim()}
              >
                Commit ({trustStore.getMaxLoanSize()} loan)
              </button>
            </div>
          </div>
        </div>
      )}

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
          <button
            className="p-2 rounded-lg transition-all hover:bg-[var(--astral-glow)]"
            style={{
              color: showLoanPrompt ? "var(--astral-accent)" : "var(--astral-text-dim)",
            }}
            onClick={() => setShowLoanPrompt((v) => !v)}
            title={`Make a loan (credit: ${trustStore.creditScore})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 2a.75.75 0 01.75.75v.258a33.186 33.186 0 016.668.83.75.75 0 01-.336 1.461 31.28 31.28 0 00-1.103-.232l1.702 7.545a.75.75 0 01-.387.832A4.981 4.981 0 0115 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.77-7.849a31.743 31.743 0 00-3.339-.364v11.851H13a.75.75 0 010 1.5H7a.75.75 0 010-1.5h2.25V4.399a31.712 31.712 0 00-3.339.364l1.77 7.849a.75.75 0 01-.387.832A4.981 4.981 0 015 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.702-7.545c-.372.06-.742.125-1.103.232a.75.75 0 11-.336-1.462 33.186 33.186 0 016.668-.829V2.75A.75.75 0 0110 2zM5 12.662l-1.18-5.232L5 7.46l1.18-.03L5 12.662zM15 12.662l-1.18-5.232L15 7.46l1.18-.03L15 12.662z"
                clipRule="evenodd"
              />
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
