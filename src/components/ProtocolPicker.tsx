import { protocols } from "../protocols";
import type { ProtocolCategory } from "../models/types";

interface ProtocolPickerProps {
  onSelect: (protocolId: string | null) => void;
}

const categoryLabels: Record<ProtocolCategory, string> = {
  decision: "Decision Making",
  overwhelm: "Overwhelm",
  motivation: "Motivation",
  "self-inquiry": "Self-Inquiry",
  focusing: "Somatic / Focusing",
};

const categoryOrder: ProtocolCategory[] = [
  "decision",
  "overwhelm",
  "motivation",
  "focusing",
  "self-inquiry",
];

export function ProtocolPicker({ onSelect }: ProtocolPickerProps) {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: protocols.filter((p) => p.category === cat),
  }));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-10 max-w-xl mx-auto">
        <h2
          className="text-2xl font-light mb-1"
          style={{ color: "var(--astral-text)" }}
        >
          What's going on?
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--astral-text-dim)" }}>
          Just start typing, or pick a guided protocol.
        </p>

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
