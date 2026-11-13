CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    transaction_date DATE NOT NULL,
    type TEXT NOT NULL
);