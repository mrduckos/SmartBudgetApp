type BudgetCardProps = {
  monthlyBudget: number;
  totalExpense: number;
  remainingBudget: number;
  budgetPercentage: number;
  isOverBudget: boolean;
  isWarningBudget: boolean;
  isBudgetLoading: boolean;
  isBudgetSaving: boolean;
  hasUnsavedChanges: boolean;

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
    isWarningBudget,
    isBudgetLoading,
    isBudgetSaving,
    hasUnsavedChanges,
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
              disabled={isBudgetSaving || !hasUnsavedChanges}
            >
              {isBudgetSaving
                ? "Saving..."
                : "Save Budget"}
            </button>

            <p className={hasUnsavedChanges ? "budget-unsaved" : "budget-saved"}
              >
                {hasUnsavedChanges ? "Unsaved changes" : "✓ Saved"}
            </p>
          </div>
        </div>

        <div className="budget-stats">

          <div className="budget-stat">
            <span>Budget</span>
            <strong>
              {monthlyBudget.toFixed(2)} €
            </strong>
          </div>

          <div className="budget-stat">
            <span>Spent</span>
            <strong>
              {totalExpense.toFixed(2)} €
            </strong>
          </div>

          <div className="budget-stat">
            <span>Remaining</span>

            <strong
              className={
                isOverBudget ? "expense" : "income"
              }
            >
              {remainingBudget.toFixed(2)} €
            </strong>
          </div>

        </div>

        <div className="budget-progress">
          <div
            className={`budget-progress-bar ${isWarningBudget ? "warning-budget" : ""} ${isOverBudget ? "over-budget" : ""}`}
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