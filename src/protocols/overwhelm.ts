import type { Protocol } from "../models/types";

export const overwhelmProtocol: Protocol = {
  id: "overwhelm-breakdown",
  name: "Overwhelm Breakdown",
  description: "When everything feels like too much and you don't know where to start",
  category: "overwhelm",
  steps: [
    {
      id: "ob-1",
      instruction:
        "Acknowledge the overwhelm. Ask: what's everything that's on your plate right now? Just dump it all out.",
      type: "prompt",
    },
    {
      id: "ob-2",
      instruction:
        "Help categorize: which of these actually need to happen TODAY? Which are just hovering?",
      type: "reflection",
    },
    {
      id: "ob-3",
      instruction:
        "For the most pressing item: what is the absolute smallest first step? Something that takes under 2 minutes.",
      type: "prompt",
    },
    {
      id: "ob-4",
      instruction:
        "Ask: does that step feel credible? Do you actually believe you'll do it? If not, make it smaller.",
      type: "check-in",
    },
    {
      id: "ob-5",
      instruction: "Have them do the step right now if possible. Then check in.",
      type: "action",
    },
  ],
  systemPromptAddition: `You're helping someone who is overwhelmed. They have too many things to do and can't start.

Critical principles:
- DON'T try to help them organize everything. That adds more overwhelm.
- DO help them pick ONE thing and find the tiniest credible step.
- The step must be so small that their internal trust system believes they'll actually do it.
- "Clean the whole kitchen" is not credible when overwhelmed. "Put one dish in the dishwasher" might be.
- After they do one tiny thing, they'll often naturally continue. But don't promise that — just do the one thing.
- If they can't even pick one thing, help them notice which item gives them the most physical tension and start there.`,
};
