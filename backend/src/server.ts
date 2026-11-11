import express from "express"
import type { Transaction } from "./types/transaction.js"

const app = express()
const PORT = 3001

const transactions: Transaction[] = [
    {
        id: 1,
        description: "Salary",
        amount: 2500,
        transactionDate: new Date("2023-06-01"),
        type: "income"
    },
    {
        id: 2,
        description: "Grocery Shopping",
        amount: 200,
        transactionDate: new Date("2023-06-02"),
        type: "expense"
    }
]


app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok"
    });
});

app.get("/api/transactions", (_req, res) => {
    res.json(transactions)
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});