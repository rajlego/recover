import { useState, useEffect, useCallback } from "react";
import { Chat } from "./components/Chat";
import { Settings } from "./components/Settings";
import { DiagnosticPanel } from "./components/DiagnosticPanel";
import { TaskDump } from "./components/TaskDump";
import { Starfield } from "./components/Starfield";
import { useRewardStore } from "./store/rewardStore";

type View = "chat" | "settings" | "diagnostic" | "tasks";

export function App() {
  const [view, setView] = useState<View>("chat");
  const { balance, streak } = useRewardStore();

  const switchView = useCallback(
    (target: View) => setView((v) => (v === target ? "chat" : target)),
    []
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && view !== "chat") {
        setView("chat");
        return;
      }
      if (e.metaKey && e.shiftKey && e.key === ",") {
        e.preventDefault();
        switchView("settings");
        return;
      }
      if (e.metaKey && e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        switchView("diagnostic");
        return;
      }
      if (e.metaKey && e.shiftKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        switchView("tasks");
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, switchView]);

  return (
    <>
      <Starfield />

      <div className="app-shell">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-5 py-2.5 shrink-0">
          <button
            className="text-base font-light tracking-wide hover:opacity-80 transition-opacity"
            style={{ color: "var(--astral-text-dim)" }}
            onClick={() => setView("chat")}
          >
            recover
          </button>

          <div className="flex items-center gap-1">
            {/* Stardust balance */}
            {balance > 0 && (
              <span
                className="text-xs font-mono px-2 py-1 rounded-lg mr-1"
                style={{
                  color: "var(--astral-accent-warm)",
                  background: "rgba(180, 156, 255, 0.08)",
                }}
                title={`${balance} stardust${streak > 1 ? ` — ${streak}-day streak` : ""}`}
              >
                ✦ {balance}
              </span>
            )}

            {/* Diagnostic button */}
            <button
              className={`p-2 rounded-lg transition-all ${
                view === "diagnostic"
                  ? "bg-[var(--astral-glow)]"
                  : "hover:bg-[var(--astral-glow)]"
              }`}
              style={{
                color:
                  view === "diagnostic"
                    ? "var(--astral-accent)"
                    : "var(--astral-text-dim)",
              }}
              onClick={() => switchView("diagnostic")}
              title="Diagnostic Model (Cmd+Shift+D)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
              </svg>
            </button>

            {/* Task dump button */}
            <button
              className={`p-2 rounded-lg transition-all ${
                view === "tasks"
                  ? "bg-[var(--astral-glow)]"
                  : "hover:bg-[var(--astral-glow)]"
              }`}
              style={{
                color:
                  view === "tasks"
                    ? "var(--astral-accent)"
                    : "var(--astral-text-dim)",
              }}
              onClick={() => switchView("tasks")}
              title="Task Dump (Cmd+Shift+T)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Settings button */}
            <button
              className={`p-2 rounded-lg transition-all ${
                view === "settings"
                  ? "bg-[var(--astral-glow)]"
                  : "hover:bg-[var(--astral-glow)]"
              }`}
              style={{
                color:
                  view === "settings"
                    ? "var(--astral-accent)"
                    : "var(--astral-text-dim)",
              }}
              onClick={() => switchView("settings")}
              title="Settings (Cmd+Shift+,)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {view === "chat" && <Chat />}
          {view === "settings" && <Settings onClose={() => setView("chat")} />}
          {view === "diagnostic" && (
            <DiagnosticPanel onClose={() => setView("chat")} />
          )}
          {view === "tasks" && (
            <TaskDump onClose={() => setView("chat")} />
          )}
        </main>
      </div>
    </>
  );
}
