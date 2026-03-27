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
  year: number | null
  setYears: (value: number) => void
  displayYears: number[] 
  setDisplayYears: (value: number[]) => void
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


      displayYears: [],
      setDisplayYears: (value) => set({ displayYears: value }),
      year: new Date().getFullYear(), // Defaults to the current year
      setYears: (value) => set({ year: value })
    }),
  {
    name: "commit-sphere-storage",
    partialize: (state) => ({
      sphereColor: state.sphereColor,
      year: state.year,
      displayYears: state.displayYears
    }),
  }
  )
);
