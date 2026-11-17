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

return (
    <main>
      <h1>Smart Budget</h1>

      <p>
        Personal finance management app built with React, Typescript, Node.js and PostgreSQL. It allows users to track their income, expenses, and savings goals, providing insights and visualizations to help them make informed financial decisions.
      </p>

      <section>
        <h2>Features currently implemented</h2>

        <ul>
          <li>✅Transaction storage</li>
          <li>✅PostgreSQL integration</li>
          <li>✅REST API</li>
          <li>✅Transaction validation</li>
          <li>✅Full-stack data flow</li>
        </ul>
      </section>

      <form onSubmit={handleSubmit}>
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
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Add Transaction"}
          </button>

          {message && <p className="form-message">{message}</p>}
      </form>

      <h2>Transactions</h2>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
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
              
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default App