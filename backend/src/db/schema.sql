CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    transaction_date DATE NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'other'
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    month VARCHAR(7) UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0)
)