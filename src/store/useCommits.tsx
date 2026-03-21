import { create } from "zustand";


type Commits = {
    // States
    commits: number
    // Actions
    setCommits: (value: number) => void
}

export const useCommits = create<Commits>()((set) => ({
    commits: 0,
    setCommits: (value) => set({commits: value})
}))