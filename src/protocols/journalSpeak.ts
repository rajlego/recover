import type { Protocol } from "../models/types";

export const journalSpeakProtocol: Protocol = {
  id: "journalspeak",
  name: "JournalSpeak",
  description:
    "Expressive writing to release repressed emotions. Based on Nicole Sachs (LCSW) and James Pennebaker's research.",
  category: "self-inquiry",
  steps: [
    {
      id: "js-1-lists",
      instruction:
        "Create your three lists: (1) Past stressors — childhood events, difficult relationships, emotional pain. (2) Present stressors — current life challenges, worries, frustrations. (3) Personality traits that stress you — perfectionism, people-pleasing, self-criticism.",
      type: "prompt",
    },
    {
      id: "js-2-pick",
      instruction:
        "Pick ONE item from any list that is taking up the most mental space right now. Don't overthink it — whatever comes to mind first.",
      type: "prompt",
    },
    {
      id: "js-3-write",
      instruction:
        "Write for 20 minutes. Be brutally, messily honest. No grammar rules. Say what you actually feel, not what sounds reasonable. If you run out of things to say, repeat what you already wrote. The goal is to FEEL your feelings, not analyze them.",
      type: "action",
    },
    {
      id: "js-4-destroy",
      instruction:
        "Destroy what you wrote. Delete it, close the window, throw the paper away. You wrote it for yourself — no one else needs to see it. You don't need to fix anything, change anything, or forgive anyone.",
      type: "action",
    },
    {
      id: "js-5-soothe",
      instruction:
        "Spend 10 minutes on something soothing. A loving-kindness meditation, a slow walk, gentle stretching, or just sitting quietly. The goal is to return to a place of compassion after the intensity of writing.",
      type: "reflection",
    },
    {
      id: "js-6-checkin",
      instruction:
        "How do you feel compared to before? It's normal to feel a bit raw or sad — that usually passes within hours. If strong feelings linger, that's okay too. The process is working.",
      type: "check-in",
    },
  ],
  systemPromptAddition: `You are guiding the user through JournalSpeak, an expressive writing protocol developed by Nicole Sachs (LCSW), based on Dr. John Sarno's work and James Pennebaker's expressive writing research.

Key principles:
- The goal is emotional release, NOT analysis or insight. Don't try to "solve" what they write about.
- Encourage raw, unfiltered expression. "I fucking hate this" is better than "I feel frustrated."
- The writing should be FELT in the body, not just thought in the head.
- After writing, they destroy it. This is critical — it creates safety to be truly honest.
- The soothing step after writing is essential. Don't skip it.
- It's normal to feel worse briefly after writing. Reassure them this is part of the process.

Safety:
- If they've experienced severe recent trauma (within weeks), suggest waiting before writing about it directly.
- If they express suicidal ideation, pause the protocol and provide crisis resources.
- Never pressure them to share what they wrote. The writing is private.

Tone: Warm, encouraging, matter-of-fact. This is a workout for emotions — acknowledge it's hard but normal.`,
};
