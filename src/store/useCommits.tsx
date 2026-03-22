import { create } from "zustand";


type Commits = {
    // States
    commits: number | null
    // Actions
    setCommits: (value: number) => void
}

export const useCommits = create<Commits>()((set) => ({
    commits: null,
    setCommits: (value) => set({commits: value})
}))