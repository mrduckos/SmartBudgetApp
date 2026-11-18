import './App.css'
import { useEffect, useState } from 'react'
import type { Transaction } from './types/transaction'


function App() {

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [transactionDate, setTransactionDate] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0)

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0)

  const balance = totalIncome - totalExpense


useEffect(() => {
  async function fetchTransactions() {
    try {
      const response = await fetch('http://localhost:3001/api/transactions')

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data: Transaction[] = await response.json()
      console.log(data)
      setTransactions(data)
    } catch (error) {
      console.error(error)
    }
  }
  fetchTransactions()
}, [])

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault()

  setIsSaving(true)
  setMessage("Saving transaction...")

  try {
    const response = await fetch(
      'http://localhost:3001/api/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          transactionDate,
          type,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save transaction')
    }

    setTransactions((currentTransactions) => [
      data,
      ...currentTransactions,
    ])

    setMessage("Transaction saved successfully!")

    setDescription("")
    setAmount(0)
    setTransactionDate("")
    setType("expense")
  } catch (error) {
    if (error instanceof Error) {
      setMessage(error.message)
    } else {
      setMessage("Something went wrong")
    }
  } finally {
    setIsSaving(false)
  }
}

async function handleDelete(id: number) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/transactions/${id}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete transaction')
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    )
  } catch (error) {
    console.error(error)
  }
}

return (
    <main>
      <h1>Smart Budget</h1>

      <p className='app-description'>
        Manage your income and expenses with a full-stack budgeting application.
      </p>

       <div className="summary-container">
        <div className='summary-card transactions-card'>
          <h3>Transactions made</h3>
          <p>{transactions.length}</p>
        </div>
        <div className="summary-card income-card">
          <h3>Total Income</h3>
          <p className="income">{totalIncome.toFixed(2)} €</p>
        </div>
        <div className="summary-card expense-card">
          <h3>Total Expense</h3>
          <p className="expense">{totalExpense.toFixed(2)} €</p>
        </div>
        <div className="summary-card balance-card">
          <h3>Balance</h3>
          <p className="balance">{balance.toFixed(2)} €</p>
        </div>
      </div>

      <div className="form-card">
        <h2>Add Transaction</h2>

          <form className="transaction-form"
          onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              />
              <div className="type-selector">
                <button
                  type="button"
                  className={type === "income" ? "active-income" : ""}
                  onClick={() => setType("income")}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={type === "expense" ? "active-expense" : ""}
                  onClick={() => setType("expense")}
                >
                  Expense
                </button>
              </div>
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Transaction"}
              </button>

              {message && <p className="form-message">{message}</p>}
          </form>
      </div>

      <h2>Transactions</h2>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.amount}€</td>
              <td 
                className={
                  transaction.type === 'income' ? 'income' : 'expense'
                }
              >
                {transaction.type}
              </td>
              <td>
                {new Date(
                  transaction.transaction_date
                  ).toLocaleDateString('fi-FI')}
              </td>
              <td className="actions-column">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(transaction.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default App