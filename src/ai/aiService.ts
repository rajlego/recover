import type { AIConfig, LLMMessage } from "../models/types";
import { streamGemini } from "./geminiClient";
import { streamOpenRouter } from "./openRouterClient";

/**
 * Stream AI response with automatic fallback.
 * Tries the primary provider first, falls back to the other on failure.
 */
export async function* streamAI(
  messages: LLMMessage[],
  config: AIConfig
): AsyncGenerator<string, void, unknown> {
  const { primaryProvider, geminiApiKey, openRouterApiKey, geminiModel, openRouterModel } =
    config;

  // Try primary first
  if (primaryProvider === "gemini" && geminiApiKey) {
    try {
      yield* streamGemini(messages, geminiApiKey, geminiModel);
      return;
    } catch (error) {
      console.warn("Gemini failed, trying OpenRouter fallback:", error);
    }
  } else if (primaryProvider === "openrouter" && openRouterApiKey) {
    try {
      yield* streamOpenRouter(messages, openRouterApiKey, openRouterModel);
      return;
    } catch (error) {
      console.warn("OpenRouter failed, trying Gemini fallback:", error);
    }
  }

  // Try fallback
  if (primaryProvider === "gemini" && openRouterApiKey) {
    yield* streamOpenRouter(messages, openRouterApiKey, openRouterModel);
    return;
  } else if (primaryProvider === "openrouter" && geminiApiKey) {
    yield* streamGemini(messages, geminiApiKey, geminiModel);
    return;
  }

  // If primary had a key but no fallback, try primary anyway (will throw on failure)
  if (geminiApiKey) {
    yield* streamGemini(messages, geminiApiKey, geminiModel);
    return;
  }
  if (openRouterApiKey) {
    yield* streamOpenRouter(messages, openRouterApiKey, openRouterModel);
    return;
  }

  throw new Error("No AI provider configured. Add an API key in Settings.");
}

/**
 * Non-streaming AI call for diagnostic analysis.
 * Uses the same fallback logic but collects the full response.
 */
export async function callAI(
  messages: LLMMessage[],
  config: AIConfig
): Promise<string> {
  let result = "";
  for await (const chunk of streamAI(messages, config)) {
    result += chunk;
  }
  return result;
}
