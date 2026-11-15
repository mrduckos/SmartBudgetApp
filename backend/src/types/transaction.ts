export interface Transaction {
  id: number,
  description: string,
  amount: number,
  transaction_Date: Date,
  type: 'income' | 'expense',
}