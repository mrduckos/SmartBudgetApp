type BudgetCardProps = {
  monthlyBudget: number;
  totalExpense: number;
  remainingBudget: number;
  budgetPercentage: number;
  isOverBudget: boolean;
  isBudgetLoading: boolean;
  isBudgetSaving: boolean;

  setMonthlyBudget: React.Dispatch<
    React.SetStateAction<number>
  >;

  saveBudget: () => Promise<void>;
};

export default function BudgetCard ({
    monthlyBudget,
    totalExpense,
    remainingBudget,
    budgetPercentage,
    isOverBudget,
    isBudgetLoading,
    isBudgetSaving,
    setMonthlyBudget,
    saveBudget,
} : BudgetCardProps) {
    return (
  <section className="budget-card">
    {isBudgetLoading ? (
      <p>Loading budget...</p>
    ) : (
      <>
        <div className="budget-header">
          <h2>Monthly Budget</h2>

          <div className="budget-controls">
            <div className="budget-pill">
              Budget: {monthlyBudget.toFixed(2)} €
            </div>

            <input
              type="number"
              min="0"
              step="50"
              value={monthlyBudget}
              onChange={(event) =>
                setMonthlyBudget(
                  Number(event.target.value)
                )
              }
            />

            <button
              type="button"
              onClick={saveBudget}
              disabled={isBudgetSaving}
            >
              {isBudgetSaving
                ? "Saving..."
                : "Save Budget"}
            </button>
          </div>
        </div>

        <div className="budget-values">
          <span>
            Spent: {totalExpense.toFixed(2)} €
          </span>

          <span
            className={
              isOverBudget ? "expense" : ""
            }
          >
            Remaining:{" "}
            {remainingBudget.toFixed(2)} €
          </span>
        </div>

        <div className="budget-progress">
          <div
            className={`budget-progress-bar ${
              isOverBudget
                ? "over-budget"
                : ""
            }`}
            style={{
              width: `${Math.min(
                budgetPercentage,
                100
              )}%`,
            }}
          />
        </div>

        <p>
          {budgetPercentage.toFixed(1)} %
          used
        </p>
      </>
    )}
  </section>
    )
}