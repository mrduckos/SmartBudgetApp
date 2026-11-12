import type { Transaction } from "../types/transaction.js"

export const transactions: Transaction[] = [
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