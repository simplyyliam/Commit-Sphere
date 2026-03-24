import { create } from "zustand";
import type { ContributionDay } from "@/types/ContributionCommits";

type Commits = {
  commits: number | null;
  days: ContributionDay[] | null;
  setCommits: (value: number) => void;
  setDays: (value: ContributionDay[] | null) => void;
};

export const useCommits = create<Commits>()((set) => ({
  commits: null,
  days: null,
  setCommits: (value) => set({ commits: value }),
  setDays: (value) => set({ days: value }),
}));
