import express from "express"
import transactionsRouter from "./routes/transactions.js"

const app = express()
const PORT = 3001

app.use("/api/transactions", transactionsRouter)

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});