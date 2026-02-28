/**
 * fal.ai image generation client using Flux Schnell.
 * Generates companion avatar images based on conversation mood/context.
 */

const FAL_ENDPOINT = "https://fal.run/fal-ai/flux/schnell";

export interface FalImageResult {
  url: string;
  width: number;
  height: number;
}

/**
 * Generate an image using fal.ai Flux Schnell.
 * Returns the image URL from fal.ai CDN.
 */
export async function generateImage(
  prompt: string,
  apiKey: string,
  options?: {
    width?: number;
    height?: number;
    numInferenceSteps?: number;
  }
): Promise<FalImageResult> {
  const response = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: {
        width: options?.width ?? 256,
        height: options?.height ?? 256,
      },
      num_inference_steps: options?.numInferenceSteps ?? 4,
      num_images: 1,
      enable_safety_checker: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`fal.ai error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const image = data.images?.[0];

  if (!image?.url) {
    throw new Error("No image returned from fal.ai");
  }

  return {
    url: image.url,
    width: image.width ?? options?.width ?? 256,
    height: image.height ?? options?.height ?? 256,
  };
}

/**
 * Build an avatar prompt based on the current conversation mood.
 * The avatar is a stylized companion character that reflects
 * the emotional tone of the conversation.
 */
export function buildAvatarPrompt(mood: AvatarMood): string {
  const base =
    "A mystical celestial companion entity, ethereal glowing being made of starlight and gentle nebula colors, floating in deep space";

  const moodDescriptions: Record<AvatarMood, string> = {
    neutral:
      `${base}, calm and present, soft blue-purple glow, serene expression, pixel art style, 8-bit aesthetic, dark background with stars`,
    listening:
      `${base}, leaning forward attentively, warm golden-blue glow emanating softly, eyes wide and compassionate, pixel art style, 8-bit aesthetic, dark background`,
    encouraging:
      `${base}, radiating warm light, gentle smile, surrounded by small floating sparkles of hope, warm amber and gold tones, pixel art style, 8-bit aesthetic`,
    empathetic:
      `${base}, soft and gentle, cradling a small glowing orb of light, purple and pink hues, tender expression, pixel art style, 8-bit aesthetic`,
    celebrating:
      `${base}, joyful, surrounded by tiny bursts of colorful light like fireworks, bright and vibrant, arms raised in celebration, pixel art style, 8-bit aesthetic`,
    thinking:
      `${base}, contemplative pose, hand on chin, surrounded by orbiting constellation symbols, deep blue and silver tones, pixel art style, 8-bit aesthetic`,
  };

  return moodDescriptions[mood] || moodDescriptions.neutral;
}

export type AvatarMood =
  | "neutral"
  | "listening"
  | "encouraging"
  | "empathetic"
  | "celebrating"
  | "thinking";

/**
 * Determine avatar mood from the latest AI response content.
 * Uses simple keyword matching — fast and doesn't cost any API calls.
 */
export function detectMoodFromResponse(text: string): AvatarMood {
  const lower = text.toLowerCase();

  // Celebration / positive
  if (
    lower.includes("great job") ||
    lower.includes("well done") ||
    lower.includes("proud") ||
    lower.includes("amazing") ||
    lower.includes("congratulations") ||
    lower.includes("fantastic")
  ) {
    return "celebrating";
  }

  // Empathy / sadness acknowledgment
  if (
    lower.includes("i hear you") ||
    lower.includes("that sounds hard") ||
    lower.includes("that sounds really") ||
    lower.includes("i understand") ||
    lower.includes("it's okay") ||
    lower.includes("must be difficult") ||
    lower.includes("painful")
  ) {
    return "empathetic";
  }

  // Encouragement
  if (
    lower.includes("you can") ||
    lower.includes("try") ||
    lower.includes("small step") ||
    lower.includes("start with") ||
    lower.includes("one thing") ||
    lower.includes("you've got")
  ) {
    return "encouraging";
  }

  // Thinking / analyzing
  if (
    lower.includes("let me think") ||
    lower.includes("consider") ||
    lower.includes("what if") ||
    lower.includes("interesting") ||
    lower.includes("pattern")
  ) {
    return "thinking";
  }

  // Questions = listening
  if (lower.includes("?")) {
    return "listening";
  }

  return "neutral";
}
