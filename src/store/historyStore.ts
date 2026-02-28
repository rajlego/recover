import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RecoverySession, FollowUpResult } from "../models/types";

interface HistoryState {
  sessions: RecoverySession[];

  // Actions
  addSession: (session: RecoverySession) => void;
  updateFollowUp: (sessionId: string, result: FollowUpResult) => void;

  // Queries
  getRecentSessions: (count: number) => RecoverySession[];
  getSessionById: (id: string) => RecoverySession | undefined;
  getPendingFollowUps: () => RecoverySession[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (session) => {
        set((state) => ({
          sessions: [...state.sessions, session],
        }));
      },

      updateFollowUp: (sessionId, result) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, followUpResult: result } : s
          ),
        }));
      },

      getRecentSessions: (count) => {
        return get().sessions.slice(-count);
      },

      getSessionById: (id) => {
        return get().sessions.find((s) => s.id === id);
      },

      getPendingFollowUps: () => {
        return get().sessions.filter(
          (s) =>
            s.status === "completed" &&
            s.plan &&
            !s.followUpResult
        );
      },
    }),
    {
      name: "recover-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
