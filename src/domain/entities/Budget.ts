export type BudgetEntryType = 'income' | 'fixed_expense' | 'variable_expense';
export type ConfirmationSource = 'receipt' | 'bank_import' | 'manual_confirm';
export type Recurrence = 'monthly' | 'once';

export interface BudgetEntry {
  id: number;
  month: string; // "YYYY-MM"
  type: BudgetEntryType;
  label: string;
  amount: number;
  categoryId: number | null;
  isConfirmed: boolean;
  confirmationSource: ConfirmationSource | null;
  recurrence: Recurrence | null;
  createdAt: Date;
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  totalScanned: number;
  categoryBreakdown: Record<number, number>;
}
