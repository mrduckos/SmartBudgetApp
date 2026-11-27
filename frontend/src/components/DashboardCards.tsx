type DashboardCardsProps = {
    transactionCount: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeChange: number | null;
    expenseChange: number | null;
}

export default function DashboardCards ({
    transactionCount,
    totalIncome,
    totalExpense,
    balance,
    incomeChange,
    expenseChange,
}: DashboardCardsProps) {
    return (
         <div className="summary-container">
        <div className='summary-card transactions-card'>
          <h3>Transactions made</h3>
          <p>{transactionCount}</p>
        </div>
        <div className="summary-card income-card">
          <h3>Total Income</h3>
          <p className="income">{totalIncome.toFixed(2)} €</p>

          {incomeChange !== null && (
            <small 
              className={incomeChange >= 0 ? "trend-positive" : "trend-negative"}
            >
              {incomeChange >= 0 ? "↑" : "↓"} {" "}
              {Math.abs(incomeChange).toFixed(1)} %
            </small>
          )}
        </div>
        <div className="summary-card expense-card">
          <h3>Total Expense</h3>
          <p className="expense">{totalExpense.toFixed(2)} €</p>

          {expenseChange !== null && (
            <small
              className={expenseChange <= 0 ? "trend-positive" : "trend-negative"}
            >
              {expenseChange >= 0 ? "↑" : "↓"} {" "}
              {Math.abs(expenseChange).toFixed(1)} %
            </small>
          )}
        </div>
        <div className="summary-card balance-card">
          <h3>Balance</h3>
          <p className="balance">{balance.toFixed(2)} €</p>
        </div>
      </div>
    )
}