import type { ContributionDay } from "@/types/ContributionCommits";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Commits = {
  commits: number | null;
  days: ContributionDay[] | null;
  setCommits: (value: number) => void;
  setDays: (value: ContributionDay[] | null) => void;
  sphereColor: string;
  setSphereColor: (color: string) => void;
};

export const useCommits = create<Commits>()(
  persist(
    (set) => ({
      commits: null,
      days: null,
      setCommits: (value) => set({ commits: value }),
      setDays: (value) => set({ days: value }),
      sphereColor: "#ffffff",
      setSphereColor: (color) => set({ sphereColor: color }),
    }),
  {
    name: "commit-sphere-storage",
    partialize: (state) => ({
      sphereColor: state.sphereColor,
    }),
  }
  )
);