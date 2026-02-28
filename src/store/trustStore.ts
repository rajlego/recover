import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TrustLoan, LoanSize } from "../models/types";

// Score thresholds for unlocking loan sizes
const LOAN_THRESHOLDS: Record<LoanSize, number> = {
  micro: 0,
  small: 60,
  medium: 70,
  large: 80,
};

// Points awarded/deducted per loan size
const LOAN_REWARDS: Record<LoanSize, { kept: number; broken: number }> = {
  micro: { kept: 3, broken: -1 },
  small: { kept: 5, broken: -3 },
  medium: { kept: 8, broken: -5 },
  large: { kept: 12, broken: -8 },
};

export { LOAN_THRESHOLDS, LOAN_REWARDS };

interface ScoreSnapshot {
  date: string;
  score: number;
}

interface TrustState {
  creditScore: number;
  loans: TrustLoan[];
  scoreHistory: ScoreSnapshot[];
  lastActivityDate: string | null;

  // Derived
  getMaxLoanSize: () => LoanSize;
  getActiveLoans: () => TrustLoan[];
  getLoanStats: () => { total: number; kept: number; broken: number; rate: number };

  // Actions
  createLoan: (commitment: string, size: LoanSize, dueBy: string, sessionId?: string) => void;
  resolveLoan: (loanId: string, outcome: "kept" | "broken") => void;
  expireOverdueLoans: () => void;
  applyDailyDecay: () => void;
}

function localDateStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function clampScore(score: number): number {
  return Math.max(20, Math.min(100, score));
}

export const useTrustStore = create<TrustState>()(
  persist(
    (set, get) => ({
      creditScore: 50,
      loans: [],
      scoreHistory: [],
      lastActivityDate: null,

      getMaxLoanSize: () => {
        const score = get().creditScore;
        if (score >= LOAN_THRESHOLDS.large) return "large";
        if (score >= LOAN_THRESHOLDS.medium) return "medium";
        if (score >= LOAN_THRESHOLDS.small) return "small";
        return "micro";
      },

      getActiveLoans: () => {
        return get().loans.filter((l) => l.status === "active");
      },

      getLoanStats: () => {
        const resolved = get().loans.filter(
          (l) => l.status === "kept" || l.status === "broken"
        );
        const kept = resolved.filter((l) => l.status === "kept").length;
        const broken = resolved.filter((l) => l.status === "broken").length;
        return {
          total: resolved.length,
          kept,
          broken,
          rate: resolved.length > 0 ? Math.round((kept / resolved.length) * 100) : 0,
        };
      },

      createLoan: (commitment, size, dueBy, sessionId) => {
        const loan: TrustLoan = {
          id: `loan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          commitment,
          size,
          createdAt: new Date().toISOString(),
          dueBy,
          status: "active",
          resolvedAt: null,
          sessionId: sessionId || null,
        };
        const today = localDateStr();
        set((s) => ({
          loans: [loan, ...s.loans].slice(0, 200),
          lastActivityDate: today,
          scoreHistory: snapshotIfNeeded(s.scoreHistory, s.creditScore, today),
        }));
      },

      resolveLoan: (loanId, outcome) => {
        const loan = get().loans.find((l) => l.id === loanId);
        if (!loan || loan.status !== "active") return;

        const delta = LOAN_REWARDS[loan.size][outcome];
        const today = localDateStr();

        set((s) => ({
          creditScore: clampScore(s.creditScore + delta),
          loans: s.loans.map((l) =>
            l.id === loanId
              ? { ...l, status: outcome, resolvedAt: new Date().toISOString() }
              : l
          ),
          lastActivityDate: today,
          scoreHistory: snapshotIfNeeded(
            s.scoreHistory,
            clampScore(s.creditScore + delta),
            today
          ),
        }));
      },

      expireOverdueLoans: () => {
        const now = new Date();
        const { loans } = get();
        const expired = loans.filter(
          (l) => l.status === "active" && new Date(l.dueBy) < now
        );
        if (expired.length === 0) return;

        // Expired loans count as broken (you didn't follow through)
        let totalDelta = 0;
        for (const loan of expired) {
          totalDelta += LOAN_REWARDS[loan.size].broken;
        }

        const today = localDateStr();
        set((s) => ({
          creditScore: clampScore(s.creditScore + totalDelta),
          loans: s.loans.map((l) =>
            l.status === "active" && new Date(l.dueBy) < now
              ? { ...l, status: "expired", resolvedAt: now.toISOString() }
              : l
          ),
          scoreHistory: snapshotIfNeeded(
            s.scoreHistory,
            clampScore(s.creditScore + totalDelta),
            today
          ),
        }));
      },

      applyDailyDecay: () => {
        const today = localDateStr();
        const { lastActivityDate } = get();
        if (lastActivityDate === today) return;

        // Calculate days since last activity
        if (lastActivityDate) {
          const last = new Date(lastActivityDate);
          const now = new Date();
          const daysDiff = Math.floor(
            (now.getTime() - last.getTime()) / 86400000
          );
          if (daysDiff > 1) {
            const decay = Math.min(daysDiff - 1, 10); // Cap at -10
            set((s) => ({
              creditScore: clampScore(s.creditScore - decay),
              scoreHistory: snapshotIfNeeded(
                s.scoreHistory,
                clampScore(s.creditScore - decay),
                today
              ),
            }));
          }
        }
      },
    }),
    {
      name: "recover-trust",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        creditScore: state.creditScore,
        loans: state.loans,
        scoreHistory: state.scoreHistory,
        lastActivityDate: state.lastActivityDate,
      }),
    }
  )
);

function snapshotIfNeeded(
  history: ScoreSnapshot[],
  score: number,
  today: string
): ScoreSnapshot[] {
  // Update today's entry or add new one
  const existing = history.findIndex((h) => h.date === today);
  if (existing >= 0) {
    const updated = [...history];
    updated[existing] = { date: today, score };
    return updated;
  }
  return [...history, { date: today, score }].slice(-90);
}
