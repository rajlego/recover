import { protocols, getProtocolById } from "../protocols";
import type { ProtocolCategory, RecoverySession } from "../models/types";

interface ProtocolPickerProps {
  onSelect: (protocolId: string | null) => void;
  onResume?: (session: RecoverySession) => void;
  pastSessions?: RecoverySession[];
}

const categoryLabels: Record<ProtocolCategory, string> = {
  decision: "Decision Making",
  overwhelm: "Overwhelm",
  motivation: "Motivation",
  "self-inquiry": "Self-Inquiry",
  focusing: "Somatic / Focusing",
  productivity: "Productivity",
  insight: "Insight Practice",
};

const categoryOrder: ProtocolCategory[] = [
  "productivity",
  "insight",
  "decision",
  "overwhelm",
  "motivation",
  "focusing",
  "self-inquiry",
];

function sessionPreview(session: RecoverySession): string {
  const lastUserMsg = [...session.messages]
    .reverse()
    .find((m) => m.role === "user");
  if (lastUserMsg) {
    const text = lastUserMsg.content;
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  }
  return `${session.messages.length} messages`;
}

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ProtocolPicker({ onSelect, onResume, pastSessions }: ProtocolPickerProps) {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: protocols.filter((p) => p.category === cat),
  }));

  const recentSessions = pastSessions
    ?.slice(-5)
    .reverse() || [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-10 max-w-xl mx-auto">
        <p
          className="text-sm font-light leading-relaxed mb-8 max-w-md text-center italic"
          style={{ color: "var(--astral-text-dim)" }}
        >
          What if I could solve all my problems? What if it is within my
          power? Right here, right now, there's enough knowledge, enough
          capacity, that I can take the actions I want to take without having
          to be attached to the outcomes
        </p>

        {/* Recent sessions */}
        {recentSessions.length > 0 && onResume && (
          <div className="w-full mb-6">
            <div className="category-label mb-2 px-1">Continue</div>
            <div className="space-y-1.5">
              {recentSessions.map((session) => {
                const protocol = session.protocolId
                  ? getProtocolById(session.protocolId)
                  : null;
                return (
                  <button
                    key={session.id}
                    className="protocol-card flex items-start justify-between"
                    onClick={() => onResume(session)}
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--astral-text)" }}
                      >
                        {protocol?.name || "Free talk"}
                      </div>
                      <div
                        className="text-xs mt-0.5 truncate"
                        style={{ color: "var(--astral-text-dim)" }}
                      >
                        {sessionPreview(session)}
                      </div>
                    </div>
                    <span
                      className="text-xs shrink-0 ml-3"
                      style={{ color: "var(--astral-text-dim)" }}
                    >
                      {timeAgo(session.updatedAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          className="protocol-card flex items-center justify-between mb-6"
          onClick={() => onSelect(null)}
        >
          <span style={{ color: "var(--astral-text)" }}>Just talk to me</span>
          <span className="text-xs" style={{ color: "var(--astral-text-dim)" }}>
            AI picks the approach
          </span>
        </button>

        <div className="w-full space-y-5">
          {grouped.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.category}>
                  <div className="category-label mb-2 px-1">
                    {group.label}
                  </div>
                  <div className="space-y-1.5">
                    {group.items.map((protocol) => (
                      <button
                        key={protocol.id}
                        className="protocol-card"
                        onClick={() => onSelect(protocol.id)}
                      >
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--astral-text)" }}
                        >
                          {protocol.name}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "var(--astral-text-dim)" }}
                        >
                          {protocol.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
