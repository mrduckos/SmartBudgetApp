export interface Transaction {
  id: number,
  description: string,
  amount: number,
  transaction_date: string,
  type: 'income' | 'expense',
  category: string
}