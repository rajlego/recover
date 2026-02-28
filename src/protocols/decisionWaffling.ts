import type { Protocol } from "../models/types";

export const decisionWafflingProtocol: Protocol = {
  id: "decision-waffling",
  name: "Decision Waffling",
  description: "When you can't decide and keep going back and forth between options",
  category: "decision",
  steps: [
    {
      id: "dw-1",
      instruction: "Have the user write down ALL their options, no filtering",
      type: "prompt",
    },
    {
      id: "dw-2",
      instruction:
        "For each option, ask: what does your gut say? Not your head — your gut.",
      type: "reflection",
    },
    {
      id: "dw-3",
      instruction:
        "Have them pick one option (the gut-favorite) and commit to trying it for just 5 minutes",
      type: "action",
    },
    {
      id: "dw-4",
      instruction: "After 5 min: how do you feel? Relieved? Energized? Drained? Resistant?",
      type: "check-in",
    },
    {
      id: "dw-5",
      instruction:
        "Guide Gendlin's Focusing: close eyes, notice what's in your body about this situation. What's the felt sense? Find a word or image that matches it.",
      type: "reflection",
    },
    {
      id: "dw-6",
      instruction:
        "Ask: now that you've felt into it — what do you WANT to do? Not should, not need to. Want.",
      type: "reflection",
    },
  ],
  systemPromptAddition: `You're guiding someone through decision waffling. They have too many options and are stuck.

Your approach:
1. First, just get ALL options on the table without judgment. Let them brain-dump.
2. Then ask about gut feelings on each — NOT rational analysis. "What does your body say about this one?"
3. Have them pick the gut-favorite and try it for JUST 5 minutes. The commitment is tiny and credible.
4. After the 5 minutes, check in on feelings, not results.
5. If they're still unclear, guide them through a brief Focusing exercise.
6. End by asking what they WANT, not what they should do.

Key: Don't add more options or analysis. They're already overwhelmed by thinking. Move them into feeling.`,
};
