import type React from "react";

type TransactionFormProps = {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;

  transactionDate: string;
  setTransactionDate: React.Dispatch<
    React.SetStateAction<string>
  >;

  type: "income" | "expense";
  setType: React.Dispatch<
    React.SetStateAction<"income" | "expense">
  >;

  category: string;
  setCategory: React.Dispatch<
    React.SetStateAction<string>
  >;

  availableCategories: string[];

  editingId: number | null;
  setEditingId: React.Dispatch<
    React.SetStateAction<number | null>
  >;

  isSaving: boolean;
  message: string;

  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
};

export default function TransactionForm({
  description,
  setDescription,
  amount,
  setAmount,
  transactionDate,
  setTransactionDate,
  type,
  setType,
  category,
  setCategory,
  availableCategories,
  editingId,
  setEditingId,
  isSaving,
  message,
  handleSubmit,
}: TransactionFormProps) {
  return (
    <div className="form-card">
      <h2>
        {editingId
          ? "Edit Transaction"
          : "Add Transaction"}
      </h2>

      <form
        className="transaction-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              parseFloat(e.target.value)
            )
          }
        />

        <input
          type="date"
          value={transactionDate}
          onChange={(e) =>
            setTransactionDate(e.target.value)
          }
        />

        <div className="type-selector">
          <button
            type="button"
            className={
              type === "income"
                ? "active-income"
                : ""
            }
            onClick={() => {
              setType("income");
              setCategory("Salary");
            }}
          >
            Income
          </button>

          <button
            type="button"
            className={
              type === "expense"
                ? "active-expense"
                : ""
            }
            onClick={() => {
              setType("expense");
              setCategory("Food");
            }}
          >
            Expense
          </button>
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {availableCategories.map(
            (categoryOption) => (
              <option
                key={categoryOption}
                value={categoryOption}
              >
                {categoryOption}
              </option>
            )
          )}
        </select>

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : editingId
              ? "Update Transaction"
              : "Add Transaction"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDescription("");
              setAmount(0);
              setTransactionDate("");
              setType("expense");
              setCategory("Food");
            }}
          >
            Cancel
          </button>
        )}

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}