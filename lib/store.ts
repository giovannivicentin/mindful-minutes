"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Session {
  practice: string;
  duration: number;
  date: string;
}

interface StoreState {
  lastSelectedTimer: number | null;
  sessions: Session[];
  setLastSelectedTimer: (minutes: number) => void;
  addSession: (session: Session) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      lastSelectedTimer: 7,
      sessions: [],
      setLastSelectedTimer: (minutes) => set({ lastSelectedTimer: minutes }),
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),
    }),
    {
      name: "mindful-minutes-storage",
    }
  )
);
