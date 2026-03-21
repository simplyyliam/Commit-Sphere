import express, { type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env.local") })

const app = express()
const parsedPort = Number(process.env.PORT)
const PORT = Number.isFinite(parsedPort) ? parsedPort : 3000

const USERNAME = "simplyyliam"
const ONE_HOUR = 60 * 60 * 1000
let cachedTotalCommits: number | null = null
let cachedAt = 0

app.use(cors())
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ message: "pong" })
})

app.get("/commits", async (_req, res) => {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
        return res.status(500).json({ error: "Missing GITHUB_TOKEN in .env.local" })
    }

    if (cachedTotalCommits !== null && Date.now() - cachedAt < ONE_HOUR) {
        return res.json({ totalCommits: cachedTotalCommits, cached: true })
    }

    const headers = {
        Authorization: `bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "commit-sphere"
    }

    try {
        // Match the GitHub profile "last year" number via GraphQL contributions
        const to = new Date()
        const from = new Date()
        from.setFullYear(from.getFullYear() - 1)

        const query = `
            query($login: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $login) {
                    contributionsCollection(from: $from, to: $to) {
                        totalCommitContributions
                        totalPullRequestContributions
                        totalIssueContributions
                        totalPullRequestReviewContributions
                    }
                }
            }
        `

        const gqlRes = await axios.post(
            "https://api.github.com/graphql",
            {
                query,
                variables: {
                    login: USERNAME,
                    from: from.toISOString(),
                    to: to.toISOString()
                }
            },
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
        const totalContributions = commits + prs + issues + reviews

        cachedTotalCommits = totalContributions
        cachedAt = Date.now()
        res.json({
            totalCommits: totalContributions,
            cached: false,
            breakdown: {
                commits,
                prs,
                issues,
                reviews
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch commits" })
    }
})

app.listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`)
})
