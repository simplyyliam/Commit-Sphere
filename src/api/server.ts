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
                        totalCommitContributions
                        totalPullRequestContributions
                        totalIssueContributions
                        totalPullRequestReviewContributions
                        restrictedContributionsCount
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

        const collection = gqlRes.data?.data?.user?.contributionsCollection
        const commits = Number(collection?.totalCommitContributions ?? 0)
        const prs = Number(collection?.totalPullRequestContributions ?? 0)
        const issues = Number(collection?.totalIssueContributions ?? 0)
        const reviews = Number(collection?.totalPullRequestReviewContributions ?? 0)
        const restricted = Number(collection?.restrictedContributionsCount ?? 0)
        const totalContributions = commits + prs + issues + reviews + restricted

        cache.set(username, { total: totalContributions, calculatedAt: Date.now() })

        res.json({
            totalCommits: totalContributions,
            cached: false,
            user: username,
            breakdown: { commits, prs, issues, reviews, restricted },
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
