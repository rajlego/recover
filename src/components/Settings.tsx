import { useSettingsStore } from "../store/settingsStore";
import { useHistoryStore } from "../store/historyStore";
import type { AIProvider } from "../models/types";

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const settings = useSettingsStore();
  const { sessions } = useHistoryStore();

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const followedThrough = completedSessions.filter(
    (s) => s.followUpResult?.didFollowThrough
  );

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1
          className="text-xl font-light"
          style={{ color: "var(--astral-text)" }}
        >
          Settings
        </h1>
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

      {/* AI Configuration */}
      <div className="space-y-3">
        <div className="category-label">AI Configuration</div>

        <div className="space-y-1">
          <label
            className="text-xs block"
            style={{ color: "var(--astral-text-dim)" }}
          >
            Primary Provider
          </label>
          <select
            className="astral-input w-full rounded-lg px-3 py-2 text-sm outline-none"
            value={settings.primaryProvider}
            onChange={(e) =>
              settings.setPrimaryProvider(e.target.value as AIProvider)
            }
          >
            <option value="gemini">Google AI Studio (Gemini Flash)</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </div>

        <div className="space-y-1">
          <label
            className="text-xs block"
            style={{ color: "var(--astral-text-dim)" }}
          >
            Google AI Studio API Key
          </label>
          <input
            type="password"
            className="astral-input w-full rounded-lg px-3 py-2 text-sm outline-none"
            value={settings.geminiApiKey}
            onChange={(e) => settings.setGeminiApiKey(e.target.value)}
            placeholder="AIza..."
          />
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline"
            style={{ color: "var(--astral-accent)" }}
          >
            Get a free API key
          </a>
        </div>

        <div className="space-y-1">
          <label
            className="text-xs block"
            style={{ color: "var(--astral-text-dim)" }}
          >
            OpenRouter API Key (fallback)
          </label>
          <input
            type="password"
            className="astral-input w-full rounded-lg px-3 py-2 text-sm outline-none"
            value={settings.openRouterApiKey}
            onChange={(e) => settings.setOpenRouterApiKey(e.target.value)}
            placeholder="sk-or-..."
          />
        </div>

        <div className="space-y-1">
          <label
            className="text-xs block"
            style={{ color: "var(--astral-text-dim)" }}
          >
            Gemini Model
          </label>
          <input
            type="text"
            className="astral-input w-full rounded-lg px-3 py-2 text-sm outline-none"
            value={settings.geminiModel}
            onChange={(e) => settings.setGeminiModel(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label
            className="text-xs block"
            style={{ color: "var(--astral-text-dim)" }}
          >
            fal.ai API Key (avatar generation)
          </label>
          <input
            type="password"
            className="astral-input w-full rounded-lg px-3 py-2 text-sm outline-none"
            value={settings.falApiKey}
            onChange={(e) => settings.setFalApiKey(e.target.value)}
            placeholder="key:secret"
          />
          <a
            href="https://fal.ai/dashboard/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline"
            style={{ color: "var(--astral-accent)" }}
          >
            Get a fal.ai key
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="category-label">Your Data</div>
        <div className="astral-stat p-4 space-y-3">
          <div className="flex justify-between items-baseline">
            <span
              className="text-xs"
              style={{ color: "var(--astral-text-dim)" }}
            >
              Total Sessions
            </span>
            <span
              className="text-lg font-light"
              style={{ color: "var(--astral-text)" }}
            >
              {sessions.length}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span
              className="text-xs"
              style={{ color: "var(--astral-text-dim)" }}
            >
              Follow-through Rate
            </span>
            <span
              className="text-lg font-light"
              style={{ color: "var(--astral-accent)" }}
            >
              {completedSessions.length > 0
                ? Math.round(
                    (followedThrough.length / completedSessions.length) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="space-y-3">
        <div className="category-label">Keyboard Shortcuts</div>
        <div
          className="text-xs space-y-2"
          style={{ color: "var(--astral-text-dim)" }}
        >
          {[
            ["Send message", "Enter"],
            ["New line", "Shift+Enter"],
            ["Settings", "Cmd+Shift+,"],
            ["Diagnostic Model", "Cmd+Shift+D"],
            ["Close / Back", "Escape"],
          ].map(([action, key]) => (
            <div key={action} className="flex justify-between">
              <span>{action}</span>
              <span
                className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--astral-surface)",
                  border: "1px solid var(--astral-border)",
                }}
              >
                {key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
