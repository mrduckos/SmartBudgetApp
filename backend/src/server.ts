import express from "express"
import transactionsRouter from "./routes/transactions.js"
import { pool } from "./db/database.js"

const app = express()

app.use(express.json())

const PORT = 3001

app.use("/api/transactions", transactionsRouter)

app.get("/api/health", async (_req, res) => {
    try {
        await pool.query("SELECT 1")
        
        res.json({
            status: "ok",
            database: "connected"
        })
    } catch {
        res.status(500).json({
            status: "error",
            database: "not connected"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})