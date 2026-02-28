import type { Protocol } from "../models/types";

/**
 * "Replacing Fear" protocol.
 * Based on Richard Ngo's LessWrong sequence + AnnaSalamon's "Living Money" model.
 *
 * Core insight: Fear-based motivation ("away from") is undirected and self-defeating.
 * Excitement-based motivation ("toward") is precise and self-reinforcing.
 * The transition requires building internal trust through small, kept commitments
 * (loans from your visceral self), not willpower.
 */
export const replacingFearProtocol: Protocol = {
  id: "replacing-fear",
  name: "Replacing Fear (Trust Loans)",
  description:
    "Shift from fear-based to excitement-based motivation by building internal trust through small kept commitments.",
  category: "self-inquiry",
  steps: [
    {
      id: "rf-1-block",
      instruction:
        "What are you avoiding, procrastinating on, or forcing yourself through right now? Name it specifically. Not 'I'm stuck' but 'I keep opening my laptop and then closing it instead of writing the report.'",
      type: "prompt",
    },
    {
      id: "rf-2-fear-or-excitement",
      instruction:
        "When you imagine doing this thing, notice what comes up. Is the motivation 'away from' something (fear of failure, shame, disappointing someone, looking stupid)? Or 'toward' something (genuine curiosity, excitement, wanting to see what happens)? Fear feels like contraction in the chest or gut. Excitement feels like expansion, even if it's mixed with nervousness.",
      type: "reflection",
    },
    {
      id: "rf-3-scarcity-audit",
      instruction:
        "If fear is present: is this fear calibrated to a real, present danger? Or is it calibrated to a threat that no longer applies — ancestral scarcity, childhood punishment patterns, social rejection risks that were real at 15 but not at your current age? Most of our fear responses are tuned for a world we no longer live in. You have a deep stack — you can afford to play the positive-EV strategy.",
      type: "reflection",
    },
    {
      id: "rf-4-bid",
      instruction:
        "What is one small, explicit bid you could make? Not an ambiguous hint, not a grand gesture — one clear, specific action. A bid is something where a positive outcome brings you closer to what you want, and a negative outcome gives you useful information. Think of the smallest possible version. Examples: 'I will write one paragraph.' 'I will text them and ask directly.' 'I will sit with this feeling for 2 minutes.'",
      type: "prompt",
    },
    {
      id: "rf-5-boundary",
      instruction:
        "Is there something you're currently accepting that a part of you resents? A commitment you said yes to but wish you hadn't? An expectation you're carrying that isn't yours? Setting a boundary isn't selfish — it's an investment. When your parts see you enforce a boundary, they trust you more. What boundary would help right now?",
      type: "reflection",
    },
    {
      id: "rf-6-loan",
      instruction:
        "Based on your current trust credit, what's the smallest viable commitment you could make right now and actually keep? This is a loan from your visceral self — your body is lending you motivation. Small kept loans build credit for bigger ones. A micro-loan might be: 'In the next 15 minutes, I will ___.' What's yours?",
      type: "prompt",
    },
    {
      id: "rf-7-body-check",
      instruction:
        "Check in with your body. How does it feel compared to when we started? Is there more space, less contraction? More willingness? Even a 5% shift counts — that's the loan already paying dividends. What shifted?",
      type: "check-in",
    },
  ],
  systemPromptAddition: `You are guiding the user through the "Replacing Fear" protocol, synthesized from Richard Ngo's LessWrong sequence and AnnaSalamon's "Living Money" willpower model.

Core philosophy:
- Fear-based motivation points "away from" threats — it's undirected in high-dimensional space. Excitement-based motivation points "toward" specific outcomes — it gives precise steering.
- Willpower is a LOAN from your visceral/body self to your verbal planner. Like money in an economy, it must be repaid through actions that actually nourish the bottom-up process.
- "Living willpower" understands itself as a bet: "I don't know if this will pay off, but I'm investing my credibility." "Dead willpower" forces action disconnected from caring.
- Burnout = going credibility-broke. Recovery = rebuilding credit through tiny, kept commitments.
- Most fear is calibrated to ancestral/social scarcity that no longer applies. The user likely has a "deep stack" (poker analogy) — they can afford the positive-EV play.

Trust-building mechanics:
- Trust develops via small bids (explicit > ambiguous) and respected boundaries.
- A boundary enforced now enables MORE action later, not less. "Most things are less scary when you trust you'll let yourself stop."
- Each kept micro-commitment builds credit for the next, slightly larger one.
- NEVER suggest a commitment bigger than the user's current credit supports. Too-big = broken promise = trust erosion.

The "loan" step is crucial:
- Help the user formulate a SPECIFIC, TIME-BOUNDED commitment.
- It should feel almost too easy — that's the right size for their current credit.
- Frame it explicitly as a loan: "Your body is lending you motivation for this. When you follow through, you earn credit for a bigger loan next time."

Tone: Direct and clear, not clinical. Use the loan/credit metaphor naturally. This is practical, not therapeutic — it's about rebuilding a system that works.`,
};
