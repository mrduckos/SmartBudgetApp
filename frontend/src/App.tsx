import './App.css'
import { useEffect, useState } from 'react'
import type { Transaction } from './types/transaction'
import DashboardCards from './components/DashboardCards'
import BudgetCard from './components/BudgetCard'
import CategorySummary from './components/CategorySummary'
import TransactionTable from './components/TransactionTable'
import TransactionForm from './components/TransactionForm'



function App() {

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [transactionDate, setTransactionDate] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [category, setCategory] = useState("Other Expense")

    const now = new Date()

  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  )

  const [monthlyBudget, setMonthlyBudget] = useState<number>(1000)

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


  const remainingBudget = monthlyBudget - totalExpense

  const budgetPercentage = monthlyBudget > 0 ? (totalExpense / monthlyBudget) * 100 : 0

  const isOverBudget = totalExpense > monthlyBudget


return (
    <main>
      <h1>Smart Budget</h1>

    <p className="app-description">
      Manage your income and expenses with a
      full-stack budgeting application.
    </p>

    <div className="month-selector">
      <label htmlFor="month">
        Month
      </label>

      <input
        id="month"
        type="month"
        value={selectedMonth}
        onChange={(event) =>
          setSelectedMonth(
            event.target.value
          )
        }
      />
    </div>

    <DashboardCards
      transactionCount={
        monthlyTransactions.length
      }
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
    />

    <BudgetCard
      monthlyBudget={monthlyBudget}
      totalExpense={totalExpense}
      remainingBudget={
        remainingBudget
      }
      budgetPercentage={
        budgetPercentage
      }
      isOverBudget={isOverBudget}
      setMonthlyBudget={
        setMonthlyBudget
      }
    />

    <CategorySummary
      categoryEntries={categoryEntries}
    />

    <TransactionForm
      description={description}
      setDescription={setDescription}
      amount={amount}
      setAmount={setAmount}
      transactionDate={transactionDate}
      setTransactionDate={
        setTransactionDate
      }
      type={type}
      setType={setType}
      category={category}
      setCategory={setCategory}
      availableCategories={
        availableCategories
      }
      editingId={editingId}
      setEditingId={setEditingId}
      isSaving={isSaving}
      message={message}
      handleSubmit={handleSubmit}
    />

    <TransactionTable
      transactions={transactions}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />
    </main>
  )
}

export default App