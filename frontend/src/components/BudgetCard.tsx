type BudgetCardProps = {
    monthlyBudget: number;
    totalExpense: number;
    remainingBudget: number;
    budgetPercentage: number;
    isOverBudget: boolean;
    setMonthlyBudget: React.Dispatch<
        React.SetStateAction<number>
  >
}

export default function BudgetCard ({
    monthlyBudget,
    totalExpense,
    remainingBudget,
    budgetPercentage,
    isOverBudget,
    setMonthlyBudget,
} : BudgetCardProps) {
    return (
        <section className='budget-card'>
        <div className='budget-header'>
          <h2>Monthly Budget</h2>

          <input
            type='number'
            min='0'
            step='50'
            value={monthlyBudget}
            onChange={(event )=>
              setMonthlyBudget(Number(event.target.value))
            }
          />
        </div>

        <div className='budget-values'>
          <span>
            Spent: {totalExpense.toFixed(2)} €
          </span>

          <span className={isOverBudget ? "expense" : ""}>
            Remaining: {remainingBudget.toFixed(2)} €
          </span>
        </div>

        <div className='budget-progress'>
          <div 
            className={`budget-progress-bar ${isOverBudget ? "over-budget" : ""}`}  
            style={{
              width: `${Math.min(budgetPercentage, 100)}%`
            }}
            />
        </div>
        <p>{budgetPercentage.toFixed(1)} % used </p>
      </section>
    )
}