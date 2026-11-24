import { Router } from "express"
import { pool } from "../db/database.js"
import { error } from "node:console"

const router = Router()

router.get("/:month", async (req, res) => {
    try {
        const { month } = req.params

        const result = await pool.query(
            `
            SELECT *
            FROM budgets
            WHERE month = $1
            `,
            [month]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Budget not found"
            })
        }

        res.json(result.rows[0])

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Failed to fetch budget"
        })
    }
})

router.put("/:month", async (req, res) => {
    try {
        const { month } = req.params
        const { amount } = req.body

        if (typeof amount !== "number" || amount < 0) {
            return res.status(400).json({
                message: "Budget must be a positive number"
            })
        }

        const result = await pool.query(
            `
            INSERT INTO budgets (month, amount)
            VALUES ($1, $2)

            ON CONFLICT (month)
            DO UPDATE SET amount = EXCLUDED.amount

            RETURNING *
            `, 
            [month, amount]
        )

        res.json(result.rows[0])

    } catch (error) {
        console.error("Budget save error:");
  console.error(error);

  res.status(500).json({
    message: "Failed to save budget" + error
  });
    }
})

export default router

