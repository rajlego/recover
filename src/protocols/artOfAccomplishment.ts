import type { Protocol } from "../models/types";

export const artOfAccomplishmentProtocols: Protocol[] = [
  {
    id: "aoa-emotion-resistance",
    name: "Emotion Resistance Reflection",
    description:
      "Discover how avoiding an emotion actually recreates it (Art of Accomplishment)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-er-1",
        instruction: "Ask: Name an emotion you resist or avoid feeling.",
        type: "prompt",
      },
      {
        id: "aoa-er-2",
        instruction: "Ask: List all the ways you avoid feeling this emotion.",
        type: "prompt",
      },
      {
        id: "aoa-er-3",
        instruction:
          "Show them, line by line, how each avoidance tactic actually recreates the very emotion they're trying to avoid.",
        type: "reflection",
      },
    ],
    systemPromptAddition: `You're a reflection partner helping the user find their blind spots around emotional avoidance.

Structure:
1. Ask them to name ONE emotion they resist.
2. Ask them to list HOW they avoid it (behaviors, strategies, coping mechanisms).
3. Then, for EACH avoidance tactic, show them how it ironically recreates the emotion.

Example: If they avoid feeling "not good enough":
- Avoidance: overworking → Creates: exhaustion, still feeling not good enough because nothing is ever enough
- Avoidance: seeking validation → Creates: dependency on others' opinions, confirming they need external proof
- Avoidance: procrastination → Creates: falling behind, more evidence of "not good enough"

Be gentle but honest. This is insight work, not criticism.`,
  },
  {
    id: "aoa-decision-emotions",
    name: "Decision with Emotional Outcomes",
    description:
      "Align decisions with desired emotional outcomes (Art of Accomplishment Week 5)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-de-1",
        instruction: "Ask: The decision I'm making:",
        type: "prompt",
        repeatCount: 4,
      },
      {
        id: "aoa-de-2",
        instruction: "Ask: The list of emotional outcomes I want:",
        type: "prompt",
      },
      {
        id: "aoa-de-3",
        instruction:
          "Ask: Decision I could make or problem statement that ensures I'll feel this way:",
        type: "prompt",
      },
    ],
    systemPromptAddition: `Guide the user through this prompt sequence 4 times, each time with a DIFFERENT decision they're facing.

For each round:
1. "The decision I'm making:" — get a specific decision
2. "The list of emotional outcomes I want:" — what do they want to FEEL?
3. "Decision I could make or problem statement that ensures I'll feel this way:" — reframe the decision around desired feelings

After all 4 rounds, help them notice patterns across their decisions and desired feelings.`,
  },
  {
    id: "aoa-10-year-lookback",
    name: "10-Year Lookback",
    description:
      "What decision would you be proud of in 10 years? (Art of Accomplishment Week 5)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-10y-1",
        instruction: "Ask: The decision I'm making:",
        type: "prompt",
        repeatCount: 4,
      },
      {
        id: "aoa-10y-2",
        instruction:
          "Ask: Looking back 10 years from now, what decision would I be proud to have made?",
        type: "reflection",
      },
    ],
    systemPromptAddition: `Guide this prompt sequence 4 times, each with a different decision.

For each round:
1. "The decision I'm making:" — name it
2. "Looking back 10 years from now, what decision would I be proud to have made?"

After all 4, help them see the through-line. What kind of person do they want to have been?`,
  },
  {
    id: "aoa-habit-change",
    name: "Habit Change Protocol",
    description:
      "Systematically redesign a habit with intrinsic rewards (Art of Accomplishment Week 5)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-hc-1",
        instruction: "Ask: A habit I want to change is:",
        type: "prompt",
        repeatCount: 4,
      },
      {
        id: "aoa-hc-2",
        instruction: "Ask: Ways I can remove temptation:",
        type: "prompt",
      },
      {
        id: "aoa-hc-3",
        instruction: "Ask: Intrinsic rewards:",
        type: "prompt",
      },
      {
        id: "aoa-hc-4",
        instruction: "Ask: Ways I can remove triggers:",
        type: "prompt",
      },
      {
        id: "aoa-hc-5",
        instruction: "Ask: Substitutes:",
        type: "prompt",
      },
      {
        id: "aoa-hc-6",
        instruction:
          "Ask: What's the lightweight commitment I can make that will change everything?",
        type: "reflection",
      },
    ],
    systemPromptAddition: `Guide through this habit-change framework 4 times, each with a different habit.

For each round, walk through ALL prompts:
1. Name the habit
2. Ways to remove temptation
3. Intrinsic rewards (what's genuinely enjoyable about the alternative?)
4. Ways to remove triggers
5. Substitutes (what to do instead)
6. The lightweight commitment — this is the KEY question. Find the tiny lever.

The lightweight commitment connects to the internal trust economy: it must be small enough to be credible.`,
  },
  {
    id: "aoa-assumption-checking",
    name: "Assumption Checking",
    description:
      "Surface hidden assumptions in your decisions (Art of Accomplishment Week 4)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-ac-1",
        instruction: "Ask: My decision is:",
        type: "prompt",
        repeatCount: 3,
      },
      {
        id: "aoa-ac-2",
        instruction: "List 5 assumptions you see in this decision:",
        type: "reflection",
      },
      {
        id: "aoa-ac-3",
        instruction: "The problem statement of my decision is:",
        type: "prompt",
      },
      {
        id: "aoa-ac-4",
        instruction: "List 5 solution criteria:",
        type: "prompt",
      },
      {
        id: "aoa-ac-5",
        instruction: "The thing I know the least about is:",
        type: "reflection",
      },
      {
        id: "aoa-ac-6",
        instruction:
          "The easiest experiment I can think of to learn the most about this is:",
        type: "prompt",
      },
      {
        id: "aoa-ac-7",
        instruction: "List 3-5 next most obvious steps in sequence:",
        type: "prompt",
      },
    ],
    systemPromptAddition: `Guide this assumption-checking framework 3 times, each with a different decision.

For each round:
1. Name the decision
2. YOU (the AI) identify 5 hidden assumptions in it
3. Reframe as a problem statement
4. Define 5 solution criteria
5. Identify the biggest unknown
6. Design the cheapest experiment to test it
7. List concrete next steps

This is analytical but grounded. The goal is to move from "I don't know what to do" to "I know what to test next."`,
  },
  {
    id: "aoa-principles",
    name: "Principle Discovery",
    description:
      "Discover your operating principles to simplify decisions (Art of Accomplishment Week 3)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-pd-1",
        instruction: "Ask: My principle is:",
        type: "prompt",
        repeatCount: 5,
      },
      {
        id: "aoa-pd-2",
        instruction: "What it is (in 3 sentences):",
        type: "prompt",
      },
      {
        id: "aoa-pd-3",
        instruction: "What it is NOT (in 3 sentences):",
        type: "prompt",
      },
      {
        id: "aoa-pd-4",
        instruction: "Short story from my past when I lived the principle:",
        type: "prompt",
      },
      {
        id: "aoa-pd-5",
        instruction: "3 situations/issues where I can apply the principle:",
        type: "prompt",
      },
      {
        id: "aoa-pd-6",
        instruction: "For each situation: Does it make the decision? (yes or no)",
        type: "check-in",
      },
      {
        id: "aoa-pd-7",
        instruction: "For each situation: Does it increase efficiency? (yes or no)",
        type: "check-in",
      },
    ],
    systemPromptAddition: `Guide principle discovery 5 times, each with a different principle.

For each round:
1. Name a principle they live by (or want to)
2. Define it in 3 sentences
3. Define what it is NOT in 3 sentences (boundaries)
4. A real story from their life where they lived it
5. 3 situations where they could apply it
6. For each situation: does the principle make the decision automatic?
7. For each situation: does it increase efficiency?

After all 5 principles, ask:
- "If you live by these 5 principles, how much easier is your decision-making?"
- "If you live by these 5 principles, are you guaranteed success?"`,
  },
  {
    id: "aoa-avoidance-patterns",
    name: "Avoidance Pattern Recognition",
    description:
      "Identify what emotions you're avoiding in decisions, limitations, judgments, and patterns (Art of Accomplishment Week 2)",
    category: "self-inquiry",
    steps: [
      {
        id: "aoa-ap-1",
        instruction:
          'Walk through 4 domains: Big Decisions (3x), "I can\'t/It\'s hard" places (3x), Judgments (3x), and Recurring Patterns (3x)',
        type: "prompt",
        repeatCount: 12,
      },
    ],
    systemPromptAddition: `This is a comprehensive avoidance-pattern exercise. Guide through 4 domains, 3 rounds each:

**Domain 1: Big Decisions (3 rounds)**
For each:
- A "Big Decision" I'm currently in:
- The emotional consequence I don't want to feel:
- The strategy I use to avoid it:
- This invites the emotion I'm avoiding by:

**Domain 2: "I can't" / "It's hard" places (3 rounds)**
For each:
- A place where I say "I can't ___" or "It's hard to ___":
- The emotion(s) I'm avoiding (what am I being asked to do that I don't want to do?):
- The strategy I use to avoid it:
- This invites the emotion I'm avoiding by:

**Domain 3: Judgments (3 rounds)**
For each:
- A judgment I have:
- The emotional experience I don't want (what would I have to feel if I couldn't feel judgment?):
- The strategy I use to avoid it:
- This invites the emotion I'm avoiding by:

**Domain 4: Recurring Patterns (3 rounds)**
For each:
- A recurring pattern or problem:
- The emotional experience I'm avoiding (look for the attitude when I'm around the pattern):
- The strategy I use to avoid it:
- This invites the emotion I'm avoiding by:

Take your time. One domain at a time. Don't rush between domains.`,
  },
];
