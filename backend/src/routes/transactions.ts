import { Router } from "express"
import { transactions } from "../data/transactions.js"

const router = Router()

router.get("/", (_req, res) => {
    res.json(transactions)
})

router.get("/:id", (req, res) => {
    const id = Number(req.params.id)
    const transaction = transactions.find(t => t.id === id)

    if (transaction) {
        res.json(transaction)
    } else {
        res.status(404).json({ message: "Transaction not found" })
    }
})

export default router