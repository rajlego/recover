import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TaskDumpResult } from "../models/types";

interface TaskState {
  dumps: TaskDumpResult[];
  addDump: (dump: TaskDumpResult) => void;
  approveDump: (id: string) => void;
  removeDump: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      dumps: [],
      addDump: (dump) =>
        set((s) => ({ dumps: [dump, ...s.dumps] })),
      approveDump: (id) =>
        set((s) => ({
          dumps: s.dumps.map((d) =>
            d.id === id ? { ...d, approved: true } : d
          ),
        })),
      removeDump: (id) =>
        set((s) => ({ dumps: s.dumps.filter((d) => d.id !== id) })),
    }),
    {
      name: "recover-tasks",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
