import type { Transaction } from "../types/transaction";

type TransactionTableProps = {
    transactions: Transaction[]
    handleDelete: (id: number) => void
    handleEdit: (transaction: Transaction) => void
}

export default function TransactionTable ({
    transactions,
    handleDelete,
    handleEdit,
} : TransactionTableProps) {
    return (
        <>
      <h2>Transactions</h2>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Category</th>
            <th className="actions-column">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>

              <td>
                {transaction.amount} €
              </td>

              <td
                className={
                  transaction.type === "income"
                    ? "income"
                    : "expense"
                }
              >
                {transaction.type}
              </td>

              <td>
                {new Date(
                  transaction.transaction_date
                ).toLocaleDateString("fi-FI")}
              </td>

              <td>{transaction.category}</td>

              <td className="actions-column">
                <button
                  className="delete-button"
                  onClick={() => {
                    const confirmed =
                      window.confirm(
                        "Are you sure you want to delete this transaction?"
                      );

                    if (confirmed) {
                      handleDelete(
                        transaction.id
                      );
                    }
                  }}
                >
                  Delete
                </button>

                <button
                  className="edit-button"
                  onClick={() =>
                    handleEdit(transaction)
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
    )
}