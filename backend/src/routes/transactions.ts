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

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params

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

router.post("/", async (req, res) => {
    try {
        const {
            description,
            amount,
            transactionDate,
            type
        } = req.body

        if (!description?.trim()) {
            return res.status(400).json({
                message: "description is required"
            })
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "amount must be greater than 0"
            })
        }

        if (isNaN(Date.parse(transactionDate))) {
            return res.status(400).json({
                message: "transactionDate must be a valid date (YYYY-MM-DD)"
            })
        }

        if (type !== "income" && type !== "expense") {
            return res.status(400).json({
                message: "type must be either 'income' or 'expense'"
            })
        }

        const result = await pool.query (
            `
            INSERT INTO transactions
            (description, amount, transaction_date, type)
            VALUES 
            ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                description,
                amount,
                transactionDate,
                type
            ]
        );
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "failed to create transaction"
        })
    }

});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const result = await pool.query(
            `
            DELETE FROM transactions
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "transaction not found"
            })
        }
        res.json({
            message: "transaction deleted successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "failed to delete transaction"
        })
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const {
            description,
            amount,
            transactionDate,
            type,
        } = req.body

         if (!description?.trim()) {
            return res.status(400).json({
                message: "description is required"
            })
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "amount must be greater than 0"
            })
        }

        if (isNaN(Date.parse(transactionDate))) {
            return res.status(400).json({
                message: "transactionDate must be a valid date (YYYY-MM-DD)"
            })
        }

        if (type !== "income" && type !== "expense") {
            return res.status(400).json({
                message: "type must be either 'income' or 'expense'"
            })
        }

        const result = await pool.query(
            `
            UPDATE transactions
            SET
                description = $1,
                amount = $2,
                transaction_date = $3,
                type = $4
            WHERE id = $5
            RETURNING *    
            `,
            [
                description,
                amount,
                transactionDate,
                type,
                id
            ]
        )

        if(result.rows.length == 0) {
            return res.status(404).json({
                message: "Transaction not found"
            })
        }

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Failed to update transaction"
        })
    }
})

export default router