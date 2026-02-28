import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RewardEvent } from "../models/types";

interface RewardState {
  balance: number;
  totalEarned: number;
  events: RewardEvent[];
  streak: number; // Consecutive days with a session
  lastSessionDate: string | null; // YYYY-MM-DD

  addReward: (
    type: RewardEvent["type"],
    amount: number,
    description: string
  ) => void;
  updateStreak: () => void;
}

// Reward amounts — kept small and fun, not gamified
const REWARDS = {
  session_complete: 10,
  follow_through: 25,
  streak: 5, // Per day of streak
  experiment: 15,
} as const;

export { REWARDS };

export const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      balance: 0,
      totalEarned: 0,
      events: [],
      streak: 0,
      lastSessionDate: null,

      addReward: (type, amount, description) => {
        const event: RewardEvent = {
          id: Date.now().toString(),
          type,
          amount,
          description,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          balance: s.balance + amount,
          totalEarned: s.totalEarned + amount,
          events: [event, ...s.events].slice(0, 100), // Keep last 100
        }));
      },

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const { lastSessionDate, streak } = get();

        if (lastSessionDate === today) return; // Already counted today

        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];

        if (lastSessionDate === yesterday) {
          // Consecutive day — streak continues
          const newStreak = streak + 1;
          set({ streak: newStreak, lastSessionDate: today });
          // Bonus for streaks at milestones
          if (newStreak % 7 === 0) {
            get().addReward(
              "streak",
              REWARDS.streak * newStreak,
              `${newStreak}-day streak!`
            );
          }
        } else {
          // Streak broken or first session
          set({ streak: 1, lastSessionDate: today });
        }
      },
    }),
    {
      name: "recover-rewards",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
