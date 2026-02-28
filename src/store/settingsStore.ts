import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AIProvider } from "../models/types";

interface SettingsState {
  // AI
  geminiApiKey: string;
  openRouterApiKey: string;
  primaryProvider: AIProvider;
  geminiModel: string;
  openRouterModel: string;

  // Actions
  setGeminiApiKey: (key: string) => void;
  setOpenRouterApiKey: (key: string) => void;
  setPrimaryProvider: (provider: AIProvider) => void;
  setGeminiModel: (model: string) => void;
  setOpenRouterModel: (model: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      geminiApiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || "",
      openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "",
      primaryProvider: "gemini",
      geminiModel: "gemini-2.0-flash",
      openRouterModel: "google/gemini-2.0-flash-001",

      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setOpenRouterApiKey: (key) => set({ openRouterApiKey: key }),
      setPrimaryProvider: (provider) => set({ primaryProvider: provider }),
      setGeminiModel: (model) => set({ geminiModel: model }),
      setOpenRouterModel: (model) => set({ openRouterModel: model }),
    }),
    {
      name: "recover-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
