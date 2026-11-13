import { Router } from "express"
import { pool } from "../db/database.js"

const router = Router()

router.get("/", async (_req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT * FROM transactions
            ORDER BY transaction_date DESC
            `
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "failed to retrieve transactions"
        })

    }
    
})

router.get("/:id", async (_req, res) => {
    try {
        const { id } = _req.params

        const result = await pool.query(
            `
            SELECT * FROM transactions
            WHERE id = $1
            `,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "transaction not found"
            })
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "failed to retrieve transaction"
        })
    }

})

export default router