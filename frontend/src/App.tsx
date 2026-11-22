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
  const [editingId, setEditingId] = useState<Number | null>(null)
  const [category, setCategory] = useState("Other Expense")

    const now = new Date()

  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  )

  const incomeCategories = [
    "Salary",
    "Benefits",
    "Investments",
    "Sales",
    "Other Income"
  ];

  const expenseCagerogies = [
    "Housing",
    "Food",
    "Transport",
    "Health",
    "Leisure",
    "Subscriptions",
    "Shopping",
    "Family",
    "Finance",
    "Savings",
    "Other Expense",
  ];

    const monthlyTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.transaction_date);

    const month =
      date.getMonth() + 1;

    const year =
      date.getFullYear();

    const transactionMonth =
      `${year}-${String(month).padStart(2, "0")}`;

    return transactionMonth === selectedMonth;
  }
);

  const totalIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0)

  const totalExpense = monthlyTransactions
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

    const url = editingId 
    ? `http://localhost:3001/api/transactions/${editingId}`
    : `http://localhost:3001/api/transactions`

    const method = editingId
    ? "PATCH"
    : "POST"

    const response = await fetch(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          transactionDate,
          type,
          category
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save transaction')
    }

    if (editingId) {
      setTransactions((currentTransactions) => 
        currentTransactions.map((transaction) =>
          transaction.id === editingId
            ? data
            :transaction
        )
      )

      setMessage("Transaction updated succesfully")

      setEditingId(null)
    } else {
      setTransactions((currentTransactions) => [
      data,
      ...currentTransactions,
    ])

     setMessage("Transaction saved successfully!")
    }

  

   
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

function handleEdit(transaction: Transaction) {
  setEditingId(transaction.id)

  setDescription(transaction.description)

  setAmount(Number(transaction.amount))

  setTransactionDate(String(transaction.transaction_date).split("T")[0])

  setType(transaction.type)

}

const availableCategories = type === 'income' ? incomeCategories : expenseCagerogies

const expenseTransactions = monthlyTransactions.filter(
  (transaction) => transaction.type === "expense"
)

const expensesByCategory = expenseTransactions.reduce<
  Record<string, number>
>((totals, transaction) => {
  const category = transaction.category;

  totals[category] =
    (totals[category] ?? 0) + Number(transaction.amount);

  return totals;
}, {});

  const categoryEntries = Object.entries(expensesByCategory).sort(([, amountA], [, amountB]) => amountB - amountA)



return (
    <main>
      <h1>Smart Budget</h1>

      <p className='app-description'>
        Manage your income and expenses with a full-stack budgeting application.
      </p>

      <div className='month-selector'>
        <label htmlFor='month'>Month</label>

        <input
          id='month'
          type='month'
          value={selectedMonth}
          onChange={(event) =>
            setSelectedMonth(event.target.value)
          }
        ></input>
      </div>
       <div className="summary-container">
        <div className='summary-card transactions-card'>
          <h3>Transactions made</h3>
          <p>{monthlyTransactions.length}</p>
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

      <section className='category-summary'>
        <h2>Expenses by category</h2>

        {categoryEntries.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          <div className='category-list'>
            {categoryEntries.map(([category, amount]) => (
              <div 
                className='category-row'
                key={category}
                >
                  <span>{category}</span>

                  <strong>
                    {amount.toFixed(2)} €
                  </strong>
                </div>
            ))}
          </div>
        )}
      </section>

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
                  onClick={() => {
                    setType("income")
                    setCategory("Salary")
                  }}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={type === "expense" ? "active-expense" : ""}
                  onClick={() => {
                    setType("expense")
                    setCategory("Food")
                  }}
                >
                  Expense
                </button>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {availableCategories.map((categoryOption) => (
                    <option 
                      key={categoryOption}
                      value={categoryOption}
                    >
                      {categoryOption}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update Transaction"
                    : "Add Transaction"}
              </button>

              {editingId && (
                <button 
                  type='button'
                  onClick={() => {
                    setEditingId(null);
                    setDescription("");
                    setAmount(0);
                    setTransactionDate("");
                    setType("expense");
                  }}
                >
                  Cancel
                </button>
              )}

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
            <th>Category</th>
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
              <td>{transaction.category}</td>
              <td className="actions-column">
                <button
                  className="delete-button"
                  onClick={() => {
                    const confirmed = window.confirm (
                      "Are you sure you want to delete this transaction?"
                    )

                    if (confirmed) {
                      handleDelete(transaction.id)
                    }
                  }}
                >
                  Delete
                </button>
                <button 
                  className='edit-button'
                  onClick={() => handleEdit(transaction)}
                  >
                  Edit
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