import express, { type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({
    path: ".env.local"
})

process.on("uncaughtException", (error) => {
    console.error("[server] uncaughtException", error)
})

process.on("unhandledRejection", (reason) => {
    console.error("[server] unhandledRejection", reason)
})

const app = express()
const parsedPort = Number(process.env.PORT)
const PORT = Number.isFinite(parsedPort) ? parsedPort : 3000

console.log(`[server] starting... (env: ${process.env.NODE_ENV ?? "development"})`)

app.use(cors())
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ message: "pong" })
})

app.listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`)
})
