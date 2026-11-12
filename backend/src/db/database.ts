import { Pool } from "pg"

export const pool = new Pool({
    user: "postgres",
    database: "smartbudget"
})

