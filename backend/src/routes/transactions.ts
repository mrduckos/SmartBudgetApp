import { Router } from "express"
import { transactions } from "../data/transactions.js"

const router = Router()

router.get("/", (_req, res) => {
    res.json(transactions)
})

export default router