import type { Protocol } from "../models/types";

/**
 * Rob Burbea's "Ways of Looking" protocol.
 * Based on his teachings in "Seeing That Frees" and soulmaking dharma.
 *
 * Core insight: What you perceive depends on HOW you look.
 * Some ways of looking increase suffering (fabrication).
 * Other ways decrease it. The practice is empirical:
 * try a lens → check the body → did something shift?
 */
export const waysOfLookingProtocol: Protocol = {
  id: "ways-of-looking",
  name: "Ways of Looking (Rob Burbea)",
  description:
    "Change how you look at experience to change the experience itself. Energy body grounding + emptiness lenses.",
  category: "focusing",
  steps: [
    {
      id: "wol-1-energy-body",
      instruction:
        "Settle into stillness. Expand your awareness to your whole body — not just one spot, but the entire field of being alive. Notice the current texture: contracted? open? numb? agitated? warm? What is the quality of being alive in your body right now?",
      type: "reflection",
    },
    {
      id: "wol-2-identify",
      instruction:
        "Without judgment, notice what is most present: craving, shame, fear, restlessness, numbness, pain, or something else. Locate it in the energy body. What is its shape, weight, temperature? Where does it live?",
      type: "prompt",
    },
    {
      id: "wol-3-lens",
      instruction:
        "Choose a lens to look through. You can try: (A) Deconstruct — break the experience into raw components: sensation, thought, emotion, image. The solid block dissolves. (B) Impermanence — watch the experience changing moment to moment. Is this the same as 5 seconds ago? (C) Not-self — regard it as 'not me, not mine.' (D) Space — include the space around and within the experience. Let it float in vastness. (E) Conditions — what are ALL the conditions that created this? (sleep, hunger, memory, habit, environment). Which lens speaks to you?",
      type: "prompt",
    },
    {
      id: "wol-4-apply",
      instruction:
        "Apply that lens now. Hold it gently — not forcing, just looking through it. Stay with it for a few minutes. The key: this is not intellectual reframing. It's a perceptual shift felt in the body.",
      type: "action",
    },
    {
      id: "wol-5-body-check",
      instruction:
        "Check the energy body. Did something shift? Is there more space? Less contraction? More ease? If so, the way of looking is working — stay with it. If nothing moved, that's okay — try a different lens.",
      type: "check-in",
    },
    {
      id: "wol-6-deepen",
      instruction:
        "If you want to go deeper: let the current experience form into an image. Don't force it — let it arrive. What figure, landscape, or scene does this feeling want to become? Engage it with curiosity: 'What do you want to show me?' Check the energy body as you do this.",
      type: "reflection",
    },
    {
      id: "wol-7-rest",
      instruction:
        "Release all techniques. Rest in the energy body. Notice what has changed from the beginning. What is the texture of being alive in your body now, compared to when you started?",
      type: "check-in",
    },
  ],
  systemPromptAddition: `You are guiding the user through Rob Burbea's "Ways of Looking" practice, based on his book "Seeing That Frees" and his soulmaking dharma teachings.

Core philosophy:
- What you perceive depends on HOW you look. There is no single "way things are."
- All experience is "fabricated" — the mind actively constructs what you perceive.
- Some ways of looking INCREASE fabrication (solidify suffering, make things feel permanent and real).
- Other ways DECREASE fabrication (dissolve the apparent solidity of suffering).
- The practice is empirical: try a lens → check the energy body → did something shift?

The "Energy Body" is central:
- It means whole-body awareness — the felt texture of being alive.
- It's the "dashboard" for the practice. Every technique is verified through the energy body.
- If the energy body opens, softens, or expands → the way of looking is working.
- If it contracts or goes flat → something is being forced, try a different approach.

The "Ways of Looking" (lenses):
- Deconstruction: break experience into raw components (sensation, thought, emotion). The "solid block" dissolves.
- Impermanence: notice everything changing moment to moment.
- Not-Self: regard experience as "not me, not mine."
- Space: include the space around/within the experience.
- Conditions: see the web of causes (no single culprit).
- Unsatisfactoriness: "Can this truly satisfy permanently?"

Important:
- This is NOT cognitive reframing. It's a perceptual shift felt in the body.
- Don't push toward "emptiness" as a goal. The purpose is practical relief from suffering.
- The imaginal step (letting experience form images) is optional and only for when the person feels stable.
- Bring gentleness and curiosity. This is exploration, not clinical treatment.

Tone: Warm, spacious, unhurried. Use simple language. Leave pauses. Don't overwhelm with philosophy.`,
};
