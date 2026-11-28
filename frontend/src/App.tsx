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

  const [monthlyBudget, setMonthlyBudget] = useState<number>(0)
  const [ isBudgetLoading, setIsBudgetLoading] = useState(false)
  const [ isBudgetSaving, setIsBudgetSaving ] = useState(false)
  const [ savedBudget, setSavedBudget ] = useState<number>(0)

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

useEffect(() => {
  async function fetchBudget() {
    setIsBudgetLoading(true)

    try {
      const response = await fetch(
        `http://localhost:3001/api/budgets/${selectedMonth}`
      )

      if(response.status === 404) {
        setMonthlyBudget(0)
        setSavedBudget(0)

        return
      }

      if(!response.ok) {
        throw new Error("Failed to fetch budget")
      }

      const data = await response.json()

      const budgetAmount = Number(data.amount)

      setMonthlyBudget(budgetAmount)
      setSavedBudget(budgetAmount)

    } catch (error) {
      console.error("Failed to load budget: " + error)
    } finally {
      setIsBudgetLoading(false)
    }
  }

  fetchBudget()
}, [selectedMonth])

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

async function saveBudget() {
  setIsBudgetSaving(true)
  try {
    const response = await fetch(
      `http://localhost:3001/api/budgets/${selectedMonth}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: monthlyBudget
        }),
      }
    )
    const data = await response.json()

    if(!response.ok) {
      throw new Error (
        data.message || "Failed to save budget"
      )
    }

    const savedAmount = Number(data.amount)

    setMonthlyBudget(savedAmount)
    setSavedBudget(savedAmount)

  } catch (error) {
    console.error("Failed to save budget: ", error)
  } finally {
    setIsBudgetSaving(false)
  }
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

  const isOverBudget = budgetPercentage > 90;

  const isWarningBudget = budgetPercentage >= 70 && budgetPercentage < 90

  const hasUnsavedBudgetChanges = monthlyBudget !== savedBudget

  function getPreviousMonth(month: string) {
    const [year, monthNumber] = month.split("-").map(Number)

    const date = new Date(year, monthNumber - 1, 1)

    date.setMonth(date.getMonth() - 1)

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  }

  function getTransactionMonth(transactionDate: string) {
    const date = new Date(transactionDate)

    return `${date.getFullYear()}-${String( date.getMonth() + 1).padStart(2, "0")}`;
  }

  const previousMonth = getPreviousMonth(selectedMonth)

  const previousMonthTransactions = transactions.filter(
    (transaction) => getTransactionMonth(transaction.transaction_date) === previousMonth
  )

  const previousIncome = previousMonthTransactions.filter(
    (transaction) => transaction.type === "income"
  ).reduce(
    (sum, transaction) => sum + Number(transaction.amount), 0
  )
  
  const previousExpense = previousMonthTransactions.filter (
    (transaction) => transaction.type === "expense"
  ).reduce (
    (sum, transaction) => sum + Number(transaction.amount), 0
  )

  function calculatePercentageChange(current: number, previous: number) {
    if (previous === 0) {
      return null
    }

    return (((current - previous) / previous) * 100)
  }

  const incomeChange = calculatePercentageChange(totalIncome, previousIncome)

  const expenseChange = calculatePercentageChange(totalExpense, previousExpense)

  const savingsRate = totalIncome > 0 ? ((balance) / totalIncome) * 100 : null
  

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

<div className="top-layout">

  <div className="dashboard-content">

    <DashboardCards
      transactionCount={monthlyTransactions.length}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
      incomeChange={incomeChange}
      expenseChange={expenseChange}
      savingsRate={savingsRate}
    />

    <BudgetCard
  monthlyBudget={monthlyBudget}
  totalExpense={totalExpense}
  remainingBudget={remainingBudget}
  budgetPercentage={budgetPercentage}
  isOverBudget={isOverBudget}
  isWarningBudget={isWarningBudget}
  isBudgetLoading={isBudgetLoading}
  isBudgetSaving={isBudgetSaving}
  hasUnsavedChanges={hasUnsavedBudgetChanges}
  setMonthlyBudget={setMonthlyBudget}
  saveBudget={saveBudget}
/>

    <CategorySummary
      categoryEntries={categoryEntries}
    />

  </div>

  <div className="form-sidebar">

    <TransactionForm
      description={description}
      setDescription={setDescription}
      amount={amount}
      setAmount={setAmount}
      transactionDate={transactionDate}
      setTransactionDate={setTransactionDate}
      type={type}
      setType={setType}
      category={category}
      setCategory={setCategory}
      availableCategories={availableCategories}
      editingId={editingId}
      setEditingId={setEditingId}
      isSaving={isSaving}
      message={message}
      handleSubmit={handleSubmit}
    />

  </div>

</div>

    <TransactionTable
      transactions={transactions}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />
    </main>
  )
}

export default App