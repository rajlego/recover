import { protocols } from "../protocols";
import type { ProtocolCategory } from "../models/types";

interface ProtocolPickerProps {
  onSelect: (protocolId: string | null) => void;
}

const categoryLabels: Record<ProtocolCategory, string> = {
  decision: "Decision Making",
  overwhelm: "Overwhelm",
  motivation: "Motivation",
  "self-inquiry": "Self-Inquiry (Art of Accomplishment)",
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
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-light text-base-content/70 mb-1">
        What's going on?
      </h2>
      <p className="text-sm text-base-content/40 mb-6">
        Just start typing, or pick a guided protocol below.
      </p>

      <button
        className="btn btn-ghost btn-block justify-start text-left mb-4 border border-base-300"
        onClick={() => onSelect(null)}
      >
        <span className="text-base-content/60">Just talk to me</span>
        <span className="text-xs text-base-content/30 ml-auto">
          AI picks the approach
        </span>
      </button>

      <div className="w-full space-y-4">
        {grouped.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.category}>
                <div className="text-xs font-medium text-base-content/30 uppercase tracking-wider mb-2">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.items.map((protocol) => (
                    <button
                      key={protocol.id}
                      className="btn btn-ghost btn-block btn-sm justify-start text-left h-auto py-2"
                      onClick={() => onSelect(protocol.id)}
                    >
                      <div>
                        <div className="text-sm">{protocol.name}</div>
                        <div className="text-xs text-base-content/40">
                          {protocol.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
