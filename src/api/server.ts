import express, { type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"
import path from "path"
import { fileURLToPath } from "url"

type CacheEntry = {
    total: number
    calculatedAt: number
}

type ContributionDay = {
    date: string
    contributionCount: number
    color: string
}

type Week = {
    contributionDays: ContributionDay[]
}

// type ContributionCalendar = {
//     totalContributions: number
//     days: ContributionDay[]
// }


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env.local") })

const app = express()
const parsedPort = Number(process.env.PORT)
const PORT = Number.isFinite(parsedPort) ? parsedPort : 3000

const DEFAULT_USERNAME = "simplyyliam"
const ONE_HOUR = 60 * 60 * 1000
const cache = new Map<string, CacheEntry>()

app.use(cors())
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ message: "pong" })
})

app.get("/commits", async (req, res) => {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
        return res.status(500).json({ error: "Missing GITHUB_TOKEN in .env.local" })
    }

    const username = typeof req.query.user === "string" && req.query.user.trim().length > 0
        ? req.query.user.trim()
        : DEFAULT_USERNAME

    const fresh = req.query.fresh === "1" || req.query.fresh === "true"
    const cached = cache.get(username)
    if (!fresh && cached && Date.now() - cached.calculatedAt < ONE_HOUR) {
        return res.json({
            totalCommits: cached.total,
            cached: true,
            user: username,
            calculatedAt: new Date(cached.calculatedAt).toISOString()
        })
    }

    const headers = {
        Authorization: `bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "commit-sphere"
    }

    try {
        const query = `
        query($login: String!) {
        user(login: $login) {
        contributionsCollection {
            contributionCalendar {
            totalContributions
            weeks {
                contributionDays {
                date
                contributionCount
                color
                }
            }
            }
        }
        }
        }
`

        const gqlRes = await axios.post(
            "https://api.github.com/graphql",
            { query, variables: { login: username } },
            { headers }
        )

        if (gqlRes.data?.errors?.length) {
            return res.status(500).json({ error: "GitHub GraphQL error", details: gqlRes.data.errors })
        }

        const calendar =
            gqlRes.data?.data?.user?.contributionsCollection?.contributionCalendar

        if (!calendar) {
            return res.status(500).json({ error: "No calendar data returned" })
        }

        // Flatten weeks → days
        const days: ContributionDay[] = calendar.weeks.flatMap((week: Week) => week.contributionDays.map((day) => ({
            ...day,
            intensity: day.contributionCount / 10 // Normalize
        })))

        // Total contributions (already provided, but you can recompute too)
        const total = calendar.totalContributions

        cache.set(username, { total, calculatedAt: Date.now() })

        res.json({
            totalContributions: total,
            days,
            cached: false,
            user: username,
            calculatedAt: new Date(cache.get(username)!.calculatedAt).toISOString()
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch commits" })
    }
})

app.listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`)
})
