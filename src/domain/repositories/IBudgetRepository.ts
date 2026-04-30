import { BudgetEntry, MonthlyReport } from '../entities/Budget';

export interface IBudgetRepository {
  getByMonth(month: string): Promise<BudgetEntry[]>;
  create(entry: Omit<BudgetEntry, 'id' | 'createdAt'>): Promise<BudgetEntry>;
  update(id: number, entry: Partial<Omit<BudgetEntry, 'id'>>): Promise<BudgetEntry>;
  delete(id: number): Promise<void>;
  confirm(id: number, source: BudgetEntry['confirmationSource']): Promise<void>;
  getMonthlyReport(month: string): Promise<MonthlyReport>;
}
