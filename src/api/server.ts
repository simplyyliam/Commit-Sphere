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
    intensity?: number
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

const envPaths = [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "..", "..", ".env.local"),
]

envPaths.forEach((envPath) => {
    dotenv.config({ path: envPath, override: false })
})

const app = express()
const parsedPort = Number(process.env.PORT)
const PORT = Number.isFinite(parsedPort) ? parsedPort : 3000

// const DEFAULT_USERNAME = "simplyyliam"
const ONE_HOUR = 60 * 60 * 1000
const cache = new Map<string, CacheEntry>()

app.use(cors())
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ message: "pong" })
})

app.get("/commits", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "")
    if (!token) {
        return res.status(401).json({ error: "Missing user token" })
    }

    const userRes = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
    });

    const username = userRes.data.login;

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


app.post("/github/token", async (req, res) => {
    const { code } = req.body;
    const clientId = process.env.GITHUB_CLIENT_ID ?? process.env.VITE_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? process.env.VITE_GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({
            error: "OAuth misconfigured",
            details: "Missing CLIENT_ID/CLIENT_SECRET (or VITE_GITHUB_CLIENT_ID/VITE_GITHUB_CLIENT_SECRET)",
        });
    }

    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: clientId,
                client_secret: clientSecret,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        if (!response.data?.access_token) {
            return res.status(400).json({
                error: "OAuth failed",
                details: response.data,
            });
        }

        res.json(response.data); // contains access_token
    } catch (err) {
        const error = err as { response?: { data?: unknown } };
        console.error("OAuth failed", error?.response?.data ?? err);
        res.status(500).json({ error: "OAuth failed", details: error?.response?.data });
    }
});

app.listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`)
})
