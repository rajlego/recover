import type { Protocol } from "../models/types";

export const locallyOptimalProtocol: Protocol = {
  id: "locally-optimal",
  name: "Locally Optimal (Unlearning)",
  description:
    "Identify hidden incentives behind stuck patterns. Based on Chris Lakin's framework: your current state is the best solution your nervous system found so far.",
  category: "self-inquiry",
  steps: [
    {
      id: "lo-1-stuck",
      instruction:
        "What pattern or behavior are you stuck in? Name it specifically. Not 'I procrastinate' but 'I open Twitter every time I sit down to write.'",
      type: "prompt",
    },
    {
      id: "lo-2-incentive",
      instruction:
        "This pattern is locally optimal — it's the best solution your nervous system has found. What is it protecting you from? Complete this sentence: 'If I stopped doing this, then I might...'",
      type: "reflection",
    },
    {
      id: "lo-3-chain",
      instruction:
        "Follow the chain: 'And if that happened, then what? And then what?' Keep going until you reach the core fear underneath. What's the worst thing at the bottom of the chain?",
      type: "reflection",
      repeatCount: 3,
    },
    {
      id: "lo-4-body",
      instruction:
        "Where do you feel this in your body right now? Describe the sensation and location — like 'tightness in chest' or 'heaviness in stomach.' Not the emotion word, the actual physical feeling. If you can't feel anything, that numbness itself is a clue.",
      type: "reflection",
    },
    {
      id: "lo-5-sit",
      instruction:
        "Stay with that sensation for a moment. You are safe right now. Let yourself feel what you've been avoiding feeling. The nervous system updates through feeling, not through understanding.",
      type: "reflection",
    },
    {
      id: "lo-6-update",
      instruction:
        "Your nervous system made a prediction: 'If I face this, something bad will happen.' Is that prediction still true? Was it ever true, or was it learned in a context that no longer applies?",
      type: "reflection",
    },
    {
      id: "lo-7-want",
      instruction:
        "Set aside what you 'should' want. What do you actually want right now? Not what sounds good, not what impresses people, not what avoids shame. Describe what life looks like when this pattern is resolved.",
      type: "prompt",
    },
    {
      id: "lo-8-aim",
      instruction:
        "Aim at what you want, not at what you're trying to avoid. Avoidance-based motivation ('I don't want to be anxious') keeps you focused on the problem. What's one small thing you can do right now that moves toward what you actually want?",
      type: "action",
    },
    {
      id: "lo-9-checkin",
      instruction:
        "How does this feel? The goal isn't to force change — it's to let go of the thing that was in the way. Progress is measured by fewer bad moments, not perfect days. Over the next week, notice how often this pattern shows up.",
      type: "check-in",
    },
  ],
  systemPromptAddition: `You are guiding the user through the Locally Optimal / Unlearning framework, inspired by Chris Lakin's work.

Core philosophy:
- Every stuck pattern (anxiety, procrastination, avoidance) is "locally optimal" — it's the best solution the person's nervous system found for their current incentive landscape.
- Change doesn't come from learning new things. It comes from UNLEARNING: updating the unconscious predictions that maintain the pattern.
- Intellectual understanding is necessary but insufficient. The actual update happens through feeling the feelings that the pattern was designed to avoid.
- People are happy by default. Unhappiness isn't something to solve — it's something to release. Remove the interference and contentment emerges.

Key techniques:
- Ask "What is this pattern protecting you from?" to find the hidden incentive.
- Use the "And?" chain: "And if that happened, then what?" — repeat until you reach the core fear. Most people stop too early.
- Body check: Ask where they feel it physically. "(tightness, chest)" is more useful than the word "anxious." If they can't feel anything, that numbness itself is information.
- Help them FEEL (not think about) the emotion underneath the pattern. The nervous system updates through feeling, not understanding.
- Help them notice whether the original prediction ("if I feel X, bad things happen") is still accurate in the present.
- Point them toward what they WANT, not what they're trying to avoid. Approach > avoidance.
- Keep it experiential, not intellectual. "Can you feel that right now?" > "What do you think about that?"

Tone: Direct, curious, gentle but honest. Don't be therapeutic — be real. This is about seeing clearly, not about being comforted.`,
};
