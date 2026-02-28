import { useState, useCallback, useRef } from "react";
import { useTaskStore } from "../store/taskStore";
import { useSettingsStore } from "../store/settingsStore";
import { callAI } from "../ai/aiService";
import { buildTaskCategorizeMessages } from "../ai/taskPrompt";
import type { TaskCategory, TaskDumpResult } from "../models/types";

interface TaskDumpProps {
  onClose: () => void;
}

type DumpPhase = "input" | "processing" | "review" | "history";

export function TaskDump({ onClose }: TaskDumpProps) {
  const [phase, setPhase] = useState<DumpPhase>("input");
  const [rawInput, setRawInput] = useState("");
  const [pendingResult, setPendingResult] = useState<TaskDumpResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const settings = useSettingsStore();
  const { dumps, addDump, removeDump } = useTaskStore();

  const hasApiKey = !!(settings.geminiApiKey || settings.openRouterApiKey);

  const categorize = useCallback(async () => {
    if (!rawInput.trim() || !hasApiKey) return;

    setPhase("processing");
    setError(null);

    try {
      const messages = buildTaskCategorizeMessages(rawInput);
      const response = await callAI(messages, {
        geminiApiKey: settings.geminiApiKey,
        openRouterApiKey: settings.openRouterApiKey,
        primaryProvider: settings.primaryProvider,
        geminiModel: settings.geminiModel,
        openRouterModel: settings.openRouterModel,
      });

      // Parse JSON from response (may be wrapped in ```json blocks)
      let jsonStr = response;
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      const parsed = JSON.parse(jsonStr.trim());

      const categories: TaskCategory[] = (parsed.categories || []).map(
        (cat: { name: string; tasks: { text: string; originalIndex: number }[] }) => ({
          name: cat.name,
          tasks: cat.tasks.map(
            (t: { text: string; originalIndex: number }, i: number) => ({
              id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
              text: t.text,
              category: cat.name,
              originalIndex: t.originalIndex,
            })
          ),
        })
      );

      const result: TaskDumpResult = {
        id: Date.now().toString(),
        rawInput,
        categories,
        createdAt: new Date().toISOString(),
        approved: false,
      };

      setPendingResult(result);
      setPhase("review");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to categorize tasks"
      );
      setPhase("input");
    }
  }, [rawInput, hasApiKey, settings]);

  const handleApprove = useCallback(() => {
    if (!pendingResult) return;
    addDump({ ...pendingResult, approved: true });
    setPendingResult(null);
    setRawInput("");
    setPhase("history");
  }, [pendingResult, addDump]);

  const handleReject = useCallback(() => {
    setPendingResult(null);
    setPhase("input");
  }, []);

  // Count original lines as tasks for verification
  const originalTaskCount = rawInput
    .split("\n")
    .filter((l) => l.trim()).length;

  const categorizedTaskCount = pendingResult
    ? pendingResult.categories.reduce(
        (sum, cat) => sum + cat.tasks.length,
        0
      )
    : 0;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1
            className="text-xl font-light"
            style={{ color: "var(--astral-text)" }}
          >
            Task Dump
          </h1>
          {dumps.length > 0 && phase !== "history" && (
            <button
              className="text-xs px-2 py-1 rounded-lg hover:bg-[var(--astral-glow)] transition-all"
              style={{ color: "var(--astral-accent)" }}
              onClick={() => setPhase("history")}
            >
              History ({dumps.length})
            </button>
          )}
        </div>
        <button
          className="p-2 rounded-lg hover:bg-[var(--astral-glow)] transition-all"
          style={{ color: "var(--astral-text-dim)" }}
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

      {/* Phase: Input */}
      {phase === "input" && (
        <div className="space-y-3">
          <p
            className="text-xs"
            style={{ color: "var(--astral-text-dim)" }}
          >
            Dump everything here — tasks, thoughts, to-dos, whatever is in
            your head. One per line, or just stream of consciousness. I'll
            sort it out.
          </p>
          <textarea
            ref={textareaRef}
            className="astral-input w-full rounded-xl px-4 py-3 text-sm outline-none min-h-[200px] resize-y"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={`buy groceries
finish the report for Sarah
call dentist
figure out that bug in the API
meditate
respond to Jake's email
clean kitchen
research flights for march...`}
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "var(--astral-text-dim)" }}
            >
              {originalTaskCount} line{originalTaskCount !== 1 ? "s" : ""}{" "}
              detected
            </span>
            <button
              className="btn-astral px-4 py-2 rounded-xl text-sm"
              onClick={categorize}
              disabled={!rawInput.trim() || !hasApiKey}
            >
              Categorize
            </button>
          </div>
        </div>
      )}

      {/* Phase: Processing */}
      {phase === "processing" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <span
            className="loading loading-spinner loading-md"
            style={{ color: "var(--astral-accent)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--astral-text-dim)" }}
          >
            Sorting {originalTaskCount} tasks...
          </p>
        </div>
      )}

      {/* Phase: Review — the critical transparency view */}
      {phase === "review" && pendingResult && (
        <div className="space-y-4">
          {/* Verification bar */}
          <div
            className="astral-stat p-3 flex items-center justify-between"
            style={{
              borderColor:
                categorizedTaskCount === originalTaskCount
                  ? "rgba(100, 255, 180, 0.3)"
                  : "rgba(255, 100, 100, 0.3)",
            }}
          >
            <span className="text-xs" style={{ color: "var(--astral-text)" }}>
              {categorizedTaskCount === originalTaskCount ? (
                <>
                  All {categorizedTaskCount} tasks accounted for
                </>
              ) : (
                <>
                  Warning: {originalTaskCount} lines in, {categorizedTaskCount}{" "}
                  tasks out
                </>
              )}
            </span>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background:
                  categorizedTaskCount === originalTaskCount
                    ? "rgba(100, 255, 180, 0.1)"
                    : "rgba(255, 100, 100, 0.1)",
                color:
                  categorizedTaskCount === originalTaskCount
                    ? "rgb(100, 255, 180)"
                    : "rgb(255, 100, 100)",
              }}
            >
              {categorizedTaskCount}/{originalTaskCount}
            </span>
          </div>

          {/* Side by side: original + categorized */}
          <div className="grid grid-cols-2 gap-3">
            {/* Original */}
            <div className="space-y-2">
              <div className="category-label">Original (your input)</div>
              <div
                className="astral-stat p-3 text-xs space-y-1 max-h-[300px] overflow-y-auto"
                style={{ color: "var(--astral-text-dim)" }}
              >
                {rawInput
                  .split("\n")
                  .filter((l) => l.trim())
                  .map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <span
                        className="font-mono shrink-0 w-5 text-right"
                        style={{ color: "var(--astral-accent)", opacity: 0.5 }}
                      >
                        {i + 1}
                      </span>
                      <span>{line.trim()}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Categorized */}
            <div className="space-y-2">
              <div className="category-label">Categorized (AI output)</div>
              <div className="astral-stat p-3 text-xs space-y-3 max-h-[300px] overflow-y-auto">
                {pendingResult.categories.map((cat) => (
                  <div key={cat.name}>
                    <div
                      className="font-medium mb-1"
                      style={{ color: "var(--astral-accent)" }}
                    >
                      {cat.name}
                    </div>
                    {cat.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex gap-2 ml-2"
                        style={{ color: "var(--astral-text-dim)" }}
                      >
                        <span
                          className="font-mono shrink-0 w-5 text-right"
                          style={{
                            color: "var(--astral-accent)",
                            opacity: 0.5,
                          }}
                        >
                          {task.originalIndex}
                        </span>
                        <span>{task.text}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p
            className="text-xs"
            style={{ color: "var(--astral-text-dim)" }}
          >
            Each task shows its original line number so you can verify nothing
            was lost or changed. Check the numbers match up.
          </p>

          {/* Approve / Reject */}
          <div className="flex gap-2 justify-end">
            <button
              className="px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(255, 100, 100, 0.1)",
                border: "1px solid rgba(255, 100, 100, 0.2)",
                color: "rgb(255, 140, 140)",
              }}
              onClick={handleReject}
            >
              Try Again
            </button>
            <button
              className="btn-astral px-4 py-2 rounded-xl text-sm"
              onClick={handleApprove}
            >
              Looks Good
            </button>
          </div>
        </div>
      )}

      {/* Phase: History */}
      {phase === "history" && (
        <div className="space-y-4">
          <button
            className="text-xs px-2 py-1 rounded-lg hover:bg-[var(--astral-glow)] transition-all"
            style={{ color: "var(--astral-accent)" }}
            onClick={() => setPhase("input")}
          >
            + New Dump
          </button>

          {dumps.length === 0 ? (
            <p
              className="text-sm text-center py-8"
              style={{ color: "var(--astral-text-dim)" }}
            >
              No task dumps yet
            </p>
          ) : (
            dumps.map((dump) => (
              <div key={dump.id} className="astral-stat p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "var(--astral-text-dim)" }}
                  >
                    {new Date(dump.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(100, 255, 180, 0.1)",
                        color: "rgb(100, 255, 180)",
                      }}
                    >
                      {dump.categories.reduce(
                        (s, c) => s + c.tasks.length,
                        0
                      )}{" "}
                      tasks
                    </span>
                    <button
                      className="text-xs px-2 py-0.5 rounded hover:bg-[rgba(255,100,100,0.1)] transition-all"
                      style={{ color: "rgba(255, 140, 140, 0.6)" }}
                      onClick={() => removeDump(dump.id)}
                      title="Delete this dump"
                    >
                      delete
                    </button>
                  </div>
                </div>
                {dump.categories.map((cat) => (
                  <div key={cat.name}>
                    <div
                      className="text-xs font-medium mb-1"
                      style={{ color: "var(--astral-accent)" }}
                    >
                      {cat.name}
                    </div>
                    {cat.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="text-xs ml-3"
                        style={{ color: "var(--astral-text-dim)" }}
                      >
                        {task.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
