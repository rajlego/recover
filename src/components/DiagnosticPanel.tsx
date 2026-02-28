import { useState, useCallback, useRef, useEffect } from "react";
import { useHistoryStore } from "../store/historyStore";
import { useSettingsStore } from "../store/settingsStore";
import { streamAI } from "../ai/aiService";
import { buildDiagnosticPrompt, buildDiagnosticQuery } from "../ai/diagnosticPrompt";
import { MarkdownContent } from "./MarkdownContent";
import type { LLMMessage } from "../models/types";

interface DiagnosticPanelProps {
  onClose: () => void;
}

export function DiagnosticPanel({ onClose }: DiagnosticPanelProps) {
  const [analysis, setAnalysis] = useState("");
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState<"overview" | "query">("overview");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { sessions } = useHistoryStore();
  const settings = useSettingsStore();

  const hasApiKey = !!(settings.geminiApiKey || settings.openRouterApiKey);
  const hasData = sessions.length > 0;

  // Auto-scroll analysis
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [analysis]);

  const runAnalysis = useCallback(async () => {
    if (!hasApiKey || !hasData || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysis("");

    const prompt =
      mode === "query" && query.trim()
        ? buildDiagnosticQuery(sessions, query.trim())
        : buildDiagnosticPrompt(sessions);

    const messages: LLMMessage[] = [
      { role: "system", content: prompt },
      {
        role: "user",
        content:
          mode === "query" && query.trim()
            ? query.trim()
            : "Analyze all my recovery sessions. Identify recurring patterns, root causes, and give me systemic recommendations. Use the Dalio Principles methodology.",
      },
    ];

    try {
      let fullContent = "";
      let lastUpdate = 0;
      const THROTTLE = 80;

      for await (const chunk of streamAI(messages, {
        geminiApiKey: settings.geminiApiKey,
        openRouterApiKey: settings.openRouterApiKey,
        primaryProvider: settings.primaryProvider,
        geminiModel: settings.geminiModel,
        openRouterModel: settings.openRouterModel,
      })) {
        fullContent += chunk;
        const now = Date.now();
        if (now - lastUpdate >= THROTTLE) {
          setAnalysis(fullContent);
          lastUpdate = now;
        }
      }

      setAnalysis(fullContent || "No analysis generated.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setAnalysis(`Error: ${msg}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [hasApiKey, hasData, isAnalyzing, mode, query, sessions, settings]);

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
        <div>
          <h2 className="text-lg font-light">Diagnostic Model</h2>
          <p className="text-xs text-base-content/40">
            Dalio-style pattern analysis of your sessions
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 px-4 pt-3">
        <button
          className={`btn btn-xs ${mode === "overview" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setMode("overview")}
        >
          Full Analysis
        </button>
        <button
          className={`btn btn-xs ${mode === "query" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => {
            setMode("query");
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          Ask a Question
        </button>
      </div>

      {/* Query input */}
      {mode === "query" && (
        <div className="px-4 pt-3">
          <textarea
            ref={inputRef}
            className="textarea textarea-bordered w-full resize-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                runAnalysis();
              }
            }}
            placeholder="e.g., 'What time of day do I tend to get stuck?' or 'What are my avoidance patterns?'"
            rows={2}
          />
        </div>
      )}

      {/* Run button */}
      <div className="px-4 py-3">
        {!hasData ? (
          <div className="text-sm text-base-content/40 text-center py-4">
            No session data yet. Complete some recovery sessions first, and the
            diagnostic model will analyze your patterns.
          </div>
        ) : !hasApiKey ? (
          <div className="text-sm text-base-content/40 text-center py-4">
            Add an API key in Settings to run analysis.
          </div>
        ) : (
          <button
            className="btn btn-primary btn-sm btn-block"
            onClick={runAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Analyzing {sessions.length} sessions...
              </>
            ) : (
              <>
                Analyze {sessions.length} session
                {sessions.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </div>

      {/* Analysis output */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 pb-6">
        {analysis && (
          <div className="bg-base-200 rounded-xl p-4">
            <MarkdownContent content={analysis} />
            {isAnalyzing && (
              <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
