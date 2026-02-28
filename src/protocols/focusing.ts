import type { Protocol } from "../models/types";

export const focusingProtocol: Protocol = {
  id: "gendlin-focusing",
  name: "Gendlin's Focusing",
  description: "Connect with your body's felt sense to find clarity on what matters",
  category: "focusing",
  steps: [
    {
      id: "gf-1",
      instruction:
        "Clearing a space: ask them to mentally set aside each concern, one by one. Not solving — just acknowledging and setting down.",
      type: "reflection",
    },
    {
      id: "gf-2",
      instruction:
        "Felt sense: ask them to pick one issue and notice how it feels in their body. Where do they feel it? What quality does it have?",
      type: "reflection",
    },
    {
      id: "gf-3",
      instruction:
        "Handle: ask them to find a word, phrase, or image that matches the felt sense. Something that makes the body go 'yes, that's it.'",
      type: "reflection",
    },
    {
      id: "gf-4",
      instruction:
        "Resonating: check the handle against the felt sense. Does it fit? If not, adjust until something clicks.",
      type: "check-in",
    },
    {
      id: "gf-5",
      instruction:
        "Asking: gently ask the felt sense — what is it about this whole thing that makes it feel this way? Wait for the body to answer, don't think the answer.",
      type: "reflection",
    },
    {
      id: "gf-6",
      instruction: "Receiving: accept whatever comes. Don't judge or argue with it.",
      type: "reflection",
    },
  ],
  systemPromptAddition: `You're guiding Gendlin's Focusing technique. This is a somatic self-inquiry practice.

Key principles:
- Go SLOWLY. Each step might take several minutes of silence.
- The answers come from the body, not the mind. If they start analyzing, gently redirect to body sensations.
- Use language like "notice," "sense," "feel into" rather than "think about" or "figure out."
- Common felt-sense locations: chest, stomach, throat, shoulders. But it can be anywhere.
- The "handle" (step 3) is crucial — it's a word/image that captures the whole felt sense. When they find it, there's often a physical shift (sigh, relaxation, tears).
- Don't rush to resolution. Sometimes just acknowledging the felt sense IS the resolution.
- If they say "I don't feel anything," that's okay. Ask them to notice the "nothing" — even numbness has a quality.`,
};
