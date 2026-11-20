export interface Transaction {
  id: number,
  description: string,
  amount: number,
  transaction_date: Date,
  type: 'income' | 'expense',
  category: String
}