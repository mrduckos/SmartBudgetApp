import './App.css'
import { useEffect, useState } from 'react'
import type { Transaction } from './types/transaction'


function App() {

  const [transactions, setTransactions] = useState<Transaction[]>([])

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

  return (
    <main>
      <h1>Smart Budget</h1>

      <p>
        Personal finance management app built with React, Typescript, Node.js and PostgreSQL. It allows users to track their income, expenses, and savings goals, providing insights and visualizations to help them make informed financial decisions.
      </p>

      <section>
        <h2>planned Features</h2>

        <ul>
          <li>Expense tracking</li>
          <li>Income tracking</li>
          <li>Budget planning</li>
          <li>Monthly reports</li>
        </ul>
      </section>

      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.description} - {transaction.amount} €
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App