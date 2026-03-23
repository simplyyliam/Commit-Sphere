import { create } from "zustand";

type Commits = {
  commits: number | null;
  setCommits: (value: number) => void;
};

export const useCommits = create<Commits>()((set) => ({
  commits: null,
  setCommits: (value) => set({ commits: value }),
}));
