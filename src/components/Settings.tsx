import { useSettingsStore } from "../store/settingsStore";
import { useHistoryStore } from "../store/historyStore";
import { useTrustStore, LOAN_THRESHOLDS } from "../store/trustStore";
import type { AIProvider } from "../models/types";

// Maps credit score (20-100) to a color: warm orange → blue → green
function scoreColor(score: number): string {
  if (score >= 80) return "rgb(100, 255, 180)";  // green — large loans unlocked
  if (score >= 70) return "rgb(124, 200, 255)";  // light blue — medium
  if (score >= 60) return "rgb(124, 156, 255)";  // blue — small
  if (score >= 40) return "rgb(200, 180, 140)";  // warm neutral
  return "rgb(255, 180, 100)";                    // orange — low credit
}

// Builds SVG path from score history. If `area` is true, closes the path for a fill.
function buildSparklinePath(
  history: { date: string; score: number }[],
  area: boolean
): string {
  if (history.length < 2) return "";
  const w = (history.length - 1) * 6; // matches viewBox width
  const h = 40;
  const points = history.map((entry, i) => ({
    x: i * 6,
    y: h - ((entry.score - 20) / 80) * h,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  if (area) {
    return `${line} L${w},${h} L0,${h} Z`;
  }
  return line;
}

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const settings = useSettingsStore();
  const { sessions } = useHistoryStore();
  const trust = useTrustStore();
  const loanStats = trust.getLoanStats();

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

      {/* Trust Credit */}
      <div className="space-y-3">
        <div className="category-label">Trust Credit</div>
        <div className="astral-stat p-4 space-y-4">
          {/* Score + meter bar */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span
                className="text-xs"
                style={{ color: "var(--astral-text-dim)" }}
              >
                Credit Score
              </span>
              <span
                className="text-2xl font-light font-mono"
                style={{
                  color: scoreColor(trust.creditScore),
                }}
              >
                {trust.creditScore}
              </span>
            </div>

            {/* Visual meter bar with threshold markers */}
            <div className="relative">
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(100, 140, 255, 0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((trust.creditScore - 20) / 80) * 100}%`,
                    background: `linear-gradient(90deg, rgb(255,180,100), ${scoreColor(trust.creditScore)})`,
                    minWidth: "2px",
                  }}
                />
              </div>
              {/* Threshold tick marks */}
              <div className="relative h-3 mt-0.5">
                {[
                  { pos: 60, label: "S" },
                  { pos: 70, label: "M" },
                  { pos: 80, label: "L" },
                ].map(({ pos, label }) => (
                  <div
                    key={pos}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${((pos - 20) / 80) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      className="w-px h-1.5"
                      style={{
                        background:
                          trust.creditScore >= pos
                            ? scoreColor(trust.creditScore)
                            : "rgba(100, 140, 255, 0.2)",
                      }}
                    />
                    <span
                      className="text-[8px] font-mono"
                      style={{
                        color:
                          trust.creditScore >= pos
                            ? "var(--astral-text)"
                            : "var(--astral-text-dim)",
                        opacity: trust.creditScore >= pos ? 1 : 0.4,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sparkline */}
          {trust.scoreHistory.length > 1 && (
            <div>
              <div
                className="text-[10px] mb-1"
                style={{ color: "var(--astral-text-dim)" }}
              >
                Last {trust.scoreHistory.length} days
              </div>
              <svg
                viewBox={`0 0 ${Math.max(trust.scoreHistory.length - 1, 1) * 6} 40`}
                className="w-full"
                style={{ height: "40px" }}
                preserveAspectRatio="none"
              >
                {/* Area fill */}
                <path
                  d={buildSparklinePath(trust.scoreHistory, true)}
                  fill="rgba(124, 156, 255, 0.08)"
                  stroke="none"
                />
                {/* Line */}
                <path
                  d={buildSparklinePath(trust.scoreHistory, false)}
                  fill="none"
                  stroke="var(--astral-accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Current point */}
                <circle
                  cx={(trust.scoreHistory.length - 1) * 6}
                  cy={40 - ((trust.scoreHistory[trust.scoreHistory.length - 1].score - 20) / 80) * 40}
                  r="2.5"
                  fill={scoreColor(trust.creditScore)}
                />
              </svg>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div
                className="text-lg font-light font-mono"
                style={{ color: "var(--astral-accent)" }}
              >
                {trust.getMaxLoanSize()}
              </div>
              <div
                className="text-[9px]"
                style={{ color: "var(--astral-text-dim)" }}
              >
                max loan
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-lg font-light font-mono"
                style={{ color: "rgb(100, 255, 180)" }}
              >
                {loanStats.kept}
              </div>
              <div
                className="text-[9px]"
                style={{ color: "var(--astral-text-dim)" }}
              >
                kept
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-lg font-light font-mono"
                style={{ color: loanStats.broken > 0 ? "rgb(255, 140, 140)" : "var(--astral-text)" }}
              >
                {loanStats.broken}
              </div>
              <div
                className="text-[9px]"
                style={{ color: "var(--astral-text-dim)" }}
              >
                broke
              </div>
            </div>
          </div>

          {/* Threshold ladder */}
          <div className="space-y-1">
            {(["micro", "small", "medium", "large"] as const).map((size) => {
              const threshold = LOAN_THRESHOLDS[size];
              const unlocked = trust.creditScore >= threshold;
              const isCurrent = trust.getMaxLoanSize() === size;
              return (
                <div
                  key={size}
                  className="flex justify-between items-center text-[10px] px-2 py-0.5 rounded"
                  style={{
                    color: unlocked
                      ? "var(--astral-text)"
                      : "var(--astral-text-dim)",
                    opacity: unlocked ? 1 : 0.4,
                    background: isCurrent ? "rgba(100, 140, 255, 0.08)" : "transparent",
                  }}
                >
                  <span>
                    {isCurrent ? "▸" : unlocked ? "●" : "○"} {size}
                  </span>
                  <span className="font-mono">
                    {threshold === 0 ? "always" : `≥ ${threshold}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recent loan history */}
          {trust.loans.length > 0 && (
            <div className="pt-1">
              <div
                className="text-[10px] mb-1.5"
                style={{ color: "var(--astral-text-dim)" }}
              >
                Recent loans
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                {trust.loans.slice(0, 10).map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between text-[10px] px-2 py-1 rounded"
                    style={{
                      background: "rgba(100, 140, 255, 0.04)",
                    }}
                  >
                    <span
                      className="truncate mr-2"
                      style={{
                        color:
                          loan.status === "kept"
                            ? "rgb(100, 255, 180)"
                            : loan.status === "broken" || loan.status === "expired"
                              ? "rgb(255, 140, 140)"
                              : "var(--astral-text-dim)",
                      }}
                    >
                      {loan.status === "kept" ? "+" : loan.status === "active" ? "◎" : "−"}{" "}
                      {loan.commitment}
                    </span>
                    <span
                      className="font-mono shrink-0"
                      style={{ color: "var(--astral-text-dim)" }}
                    >
                      {loan.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            ["Task Dump", "Cmd+Shift+K"],
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
