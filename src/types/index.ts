export type TransactionType = "income" | "expense";
export type IncomeCategory = "給与" | "副収入" | "その他";
export type ExpenseCategory =
  | "家賃"
  | "光熱費"
  | "通信費"
  | "サブスク"
  | "食費"
  | "日用品費"
  | "交通費"
  | "交際費"
  | "医療費"
  | "美容"
  | "娯楽"
  | "被服費"
  | "その他";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  content: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export interface CalendarContent {
  start: string;
  income: string;
  expense: string;
  balance: string;
}
