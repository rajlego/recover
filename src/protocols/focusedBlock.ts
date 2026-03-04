import type { Protocol } from "../models/types";

export const focusedBlockProtocol: Protocol = {
  id: "focused-block",
  name: "25-Minute Focused Block",
  description:
    "When you're waffling on what to do — pick tasks, set a timer, go",
  category: "productivity",
  steps: [
    {
      id: "fb-1",
      instruction:
        "Open your command center (Notion/task list). Look at what's there. Don't think too hard — just scan.",
      type: "action",
    },
    {
      id: "fb-2",
      instruction:
        "Write down 1-3 specific tasks you'll do in the next 25 minutes. Be concrete — not 'work on project' but 'write the intro paragraph' or 'reply to Sarah's email'.",
      type: "prompt",
    },
    {
      id: "fb-3",
      instruction:
        "Set a 25-minute timer. When it starts, you start. No more deciding. Just do the first task on your list.",
      type: "action",
    },
    {
      id: "fb-4",
      instruction:
        "Timer's done. What did you get through? How do you feel? Take a 5-minute break, then decide: another block, or done for now?",
      type: "check-in",
    },
  ],
  systemPromptAddition: `You are guiding the user through a 25-minute focused work block. This is NOT complicated — the whole point is simplicity. The user tends to waffle and overthink what to do. Your job is to cut through that.

Key principles:
- Speed over perfection. The goal is to START, not to pick the perfect task.
- The task list is in Notion (their "command center"). Remind them to open it.
- 1-3 tasks max per block. If they list more, push back — "that's too many, pick the top 1-2."
- Tasks must be concrete and completable in 25 minutes. Vague tasks = waffling fuel.
- Once the timer starts, no more deciding. If they finish early, move to the next task.
- After the block: brief check-in. Did they do it? How do they feel? Suggest making a micro loan if it went well.
- If they want to do another block, help them pick tasks quickly. Don't let the planning expand.
- The 5-minute break is real — don't skip it.

Common patterns to watch for:
- "I have so much to do" → "Pick ONE thing. The most obvious one. Go."
- Listing 10 tasks → "That's a project plan, not a 25-min block. Pick 1-3."
- Perfectionism about which task → "Which one would feel good to have done? Do that one."
- Not wanting to start → "What's the smallest possible version? Do just that."

This is basically Pomodoro but stripped down. No tracking, no counting blocks, no gamification beyond the trust credit system. Just: pick tasks, set timer, do them.`,
};
