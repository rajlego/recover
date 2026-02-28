import type { LLMMessage } from "../models/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.0-flash-001";
const REQUEST_TIMEOUT_MS = 60000;
const MAX_RETRIES = 2;

function isTransientError(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* streamOpenRouter(
  messages: LLMMessage[],
  apiKey: string,
  model: string = DEFAULT_MODEL
): AsyncGenerator<string, void, unknown> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://recover.jp.net",
          "X-Title": "Recover",
        },
        body: JSON.stringify({
          model: model || DEFAULT_MODEL,
          messages,
          stream: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (isTransientError(response.status) && attempt < MAX_RETRIES) {
          lastError = new Error(`OpenRouter API error: ${response.status}`);
          await sleep(1000 * Math.pow(2, attempt));
          continue;
        }
        let errorMsg: string;
        try {
          const errData = await response.json();
          errorMsg =
            errData.error?.message || errData.error || JSON.stringify(errData);
        } catch {
          errorMsg = `HTTP ${response.status}`;
        }
        throw new Error(`OpenRouter API error: ${errorMsg}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") return;

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch {
              // skip invalid JSON
            }
          }
        }
      }

      return;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("OpenRouter request timed out");
      }

      if (
        error instanceof TypeError &&
        error.message.includes("fetch") &&
        attempt < MAX_RETRIES
      ) {
        lastError = error;
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error("Max retries exceeded");
}
