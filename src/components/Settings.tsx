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
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">Settings</h1>
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

      {/* AI Configuration */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-base-content/50 uppercase tracking-wider">
          AI Configuration
        </h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm">Primary Provider</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={settings.primaryProvider}
            onChange={(e) =>
              settings.setPrimaryProvider(e.target.value as AIProvider)
            }
          >
            <option value="gemini">Google AI Studio (Gemini Flash)</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm">Google AI Studio API Key</span>
          </label>
          <input
            type="password"
            className="input input-bordered input-sm"
            value={settings.geminiApiKey}
            onChange={(e) => settings.setGeminiApiKey(e.target.value)}
            placeholder="AIza..."
          />
          <label className="label">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="label-text-alt link link-primary text-xs"
            >
              Get a free API key
            </a>
          </label>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm">
              OpenRouter API Key (fallback)
            </span>
          </label>
          <input
            type="password"
            className="input input-bordered input-sm"
            value={settings.openRouterApiKey}
            onChange={(e) => settings.setOpenRouterApiKey(e.target.value)}
            placeholder="sk-or-..."
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-sm">Gemini Model</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-sm"
            value={settings.geminiModel}
            onChange={(e) => settings.setGeminiModel(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-base-content/50 uppercase tracking-wider">
          Your Data
        </h2>
        <div className="stats stats-vertical bg-base-200 w-full">
          <div className="stat py-3">
            <div className="stat-title text-xs">Total Sessions</div>
            <div className="stat-value text-lg">{sessions.length}</div>
          </div>
          <div className="stat py-3">
            <div className="stat-title text-xs">Follow-through Rate</div>
            <div className="stat-value text-lg">
              {completedSessions.length > 0
                ? Math.round(
                    (followedThrough.length / completedSessions.length) * 100
                  )
                : 0}
              %
            </div>
            <div className="stat-desc text-xs">
              {followedThrough.length} of {completedSessions.length} completed
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-base-content/50 uppercase tracking-wider">
          Keyboard Shortcuts
        </h2>
        <div className="text-xs space-y-1.5 text-base-content/50">
          <div className="flex justify-between">
            <span>Send message</span>
            <kbd className="kbd kbd-xs">Enter</kbd>
          </div>
          <div className="flex justify-between">
            <span>New line</span>
            <kbd className="kbd kbd-xs">Shift+Enter</kbd>
          </div>
          <div className="flex justify-between">
            <span>Settings</span>
            <span>
              <kbd className="kbd kbd-xs">Cmd</kbd>+
              <kbd className="kbd kbd-xs">Shift</kbd>+
              <kbd className="kbd kbd-xs">,</kbd>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Diagnostic Model</span>
            <span>
              <kbd className="kbd kbd-xs">Cmd</kbd>+
              <kbd className="kbd kbd-xs">Shift</kbd>+
              <kbd className="kbd kbd-xs">D</kbd>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Close / Back</span>
            <kbd className="kbd kbd-xs">Escape</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
