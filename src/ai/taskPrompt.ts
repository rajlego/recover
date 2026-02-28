import type { LLMMessage } from "../models/types";

/**
 * Build LLM messages to categorize a raw task dump.
 * The AI returns JSON with categorized tasks.
 */
export function buildTaskCategorizeMessages(rawInput: string): LLMMessage[] {
  return [
    {
      role: "system",
      content: `You are a task organizer. The user will give you a messy dump of tasks, thoughts, and to-dos. Your job is to:

1. Extract every individual task or action item from the text.
2. Categorize them into clear groups.
3. Return the result as JSON.

CRITICAL RULES:
- Do NOT delete, merge, or lose any tasks. Every item the user mentioned must appear exactly once.
- If something is ambiguous, keep it as-is rather than rewriting it.
- Preserve the user's original wording as much as possible.
- Number each task with its original position (1-indexed) from the dump so the user can verify nothing was lost.

Return ONLY valid JSON in this format:
{
  "categories": [
    {
      "name": "Category Name",
      "tasks": [
        { "text": "task text from user", "originalIndex": 1 },
        { "text": "another task", "originalIndex": 3 }
      ]
    }
  ],
  "taskCount": 10
}

Common categories: Work, Personal, Health, Errands, Creative, Finance, Communication, Research, Maintenance.
Use whatever categories make sense for the specific tasks. Aim for 3-7 categories.`,
    },
    {
      role: "user",
      content: rawInput,
    },
  ];
}
