import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AvatarMood } from "../ai/falClient";

interface AvatarState {
  currentImageUrl: string | null;
  currentMood: AvatarMood;
  isGenerating: boolean;
  lastGeneratedAt: string | null;
  error: string | null;

  setImage: (url: string, mood: AvatarMood) => void;
  setGenerating: (generating: boolean) => void;
  setMood: (mood: AvatarMood) => void;
  setError: (error: string | null) => void;
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      currentImageUrl: null,
      currentMood: "neutral",
      isGenerating: false,
      lastGeneratedAt: null,
      error: null,

      setImage: (url, mood) =>
        set({
          currentImageUrl: url,
          currentMood: mood,
          isGenerating: false,
          lastGeneratedAt: new Date().toISOString(),
          error: null,
        }),
      setGenerating: (generating) => set({ isGenerating: generating }),
      setMood: (mood) => set({ currentMood: mood }),
      setError: (error) => set({ error, isGenerating: false }),
    }),
    {
      name: "recover-avatar",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentImageUrl: state.currentImageUrl,
        currentMood: state.currentMood,
        lastGeneratedAt: state.lastGeneratedAt,
      }),
    }
  )
);
