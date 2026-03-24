export type CacheEntry = {
    total: number
    days: ContributionDay[]
    calculatedAt: number
}

export type ContributionDay = {
    date: string
    contributionCount: number
    color: string
    intensity: number
}

export type Week = {
    contributionDays: ContributionDay[]
}
