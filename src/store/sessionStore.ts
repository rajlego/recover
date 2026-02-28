import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage, RecoverySession } from "../models/types";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface SessionState {
  activeSession: RecoverySession | null;

  // Actions
  startSession: (protocolId?: string) => string;
  addMessage: (role: "user" | "assistant", content: string) => string;
  updateMessage: (messageId: string, content: string) => void;
  setMoodBefore: (mood: number) => void;
  setMoodAfter: (mood: number) => void;
  setPlan: (plan: string) => void;
  completeSession: () => RecoverySession | null;
  abandonSession: () => void;
  clearSession: () => void;

  // Queries
  getMessages: () => ChatMessage[];
  isSessionActive: () => boolean;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSession: null,

      startSession: (protocolId?: string) => {
        const id = generateId("session");
        const now = new Date().toISOString();
        set({
          activeSession: {
            id,
            protocolId: protocolId || null,
            messages: [],
            moodBefore: null,
            moodAfter: null,
            plan: null,
            followUpScheduledAt: null,
            followUpResult: null,
            createdAt: now,
            updatedAt: now,
            status: "active",
          },
        });
        return id;
      },

      addMessage: (role, content) => {
        const id = generateId("msg");
        const now = new Date().toISOString();
        const message: ChatMessage = { id, role, content, timestamp: now };

        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              messages: [...state.activeSession.messages, message],
              updatedAt: now,
            },
          };
        });
        return id;
      },

      updateMessage: (messageId, content) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              messages: state.activeSession.messages.map((m) =>
                m.id === messageId ? { ...m, content } : m
              ),
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      setMoodBefore: (mood) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: { ...state.activeSession, moodBefore: mood },
          };
        });
      },

      setMoodAfter: (mood) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: { ...state.activeSession, moodAfter: mood },
          };
        });
      },

      setPlan: (plan) => {
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: { ...state.activeSession, plan },
          };
        });
      },

      completeSession: () => {
        const session = get().activeSession;
        if (!session) return null;
        const completed = {
          ...session,
          status: "completed" as const,
          updatedAt: new Date().toISOString(),
        };
        set({ activeSession: null });
        return completed;
      },

      abandonSession: () => {
        set({ activeSession: null });
      },

      clearSession: () => {
        set({ activeSession: null });
      },

      getMessages: () => {
        return get().activeSession?.messages || [];
      },

      isSessionActive: () => {
        return get().activeSession !== null;
      },
    }),
    {
      name: "recover-active-session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
