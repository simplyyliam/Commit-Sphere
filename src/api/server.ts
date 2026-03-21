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

app.use(cors())
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ message: "pong" })
})

app.get("/commits", async (_req: Request, res: Response) => {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
        return res.status(500).json({ error: "Missing GITHUB_TOKEN in .env.local" })
    }

    try {
        const response = await axios.get(
            `https://api.github.com/search/commits?q=author:${USERNAME}`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        )

        const totalCommits = Number(response.data?.total_count ?? 0)
        res.json({ totalCommits })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch commits" })
    }
})

app.listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`)
})
