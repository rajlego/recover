import type { Protocol } from "../models/types";

export const timeHorizonProtocol: Protocol = {
  id: "time-horizon",
  name: "Time Horizon / Motivation",
  description:
    "When you know something would help but can't get yourself to do it because the payoff feels too far away",
  category: "motivation",
  steps: [
    {
      id: "th-1",
      instruction:
        "What's the thing you want to do but can't get yourself to start? What benefit do you believe it would have?",
      type: "prompt",
    },
    {
      id: "th-2",
      instruction:
        "What's the shortest version of this that could give you a taste of the benefit? Not the full thing — just a sample.",
      type: "prompt",
    },
    {
      id: "th-3",
      instruction:
        "Can we find a way to make the process itself enjoyable, independent of the result? What would make the doing itself pleasant?",
      type: "reflection",
    },
    {
      id: "th-4",
      instruction:
        "What's a credible reward you could give yourself IMMEDIATELY after doing even a tiny version of this?",
      type: "prompt",
    },
    {
      id: "th-5",
      instruction:
        "What's the smallest commitment your internal trust system would actually believe? Something so small it feels almost silly.",
      type: "check-in",
    },
  ],
  systemPromptAddition: `You're helping someone who intellectually knows something would benefit them but can't get themselves to do it. The payoff feels too distant.

This connects to the internal trust economy concept:
- Part of them doesn't trust that the effort will pay off.
- The solution is NOT more convincing arguments. They already know it's good for them.
- The solution IS making the commitment so small and the reward so immediate that their system trusts it.

Examples:
- "Meditate for an hour" → "Sit still for 2 minutes, then have your favorite tea"
- "Exercise daily" → "Put on workout clothes and step outside. That's it. If you want to come back in, come back in."
- "Write a book" → "Open a doc and write one sentence about anything"

The magic: once they do the tiny version, they often naturally extend. But NEVER promise that or make it the expectation. The tiny version IS the goal.

Also explore: is there a way to make the PROCESS enjoyable? Meditation with music they love? Exercise that's actually fun (dancing vs running)?`,
};
