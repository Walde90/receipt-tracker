import { eq, and } from 'drizzle-orm';
import { db } from '../db/database';
import { budgetEntries } from '../db/schema';
import { BudgetEntry, MonthlyReport } from '../../domain/entities/Budget';
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository';

function toEntity(row: typeof budgetEntries.$inferSelect): BudgetEntry {
  return {
    id: row.id,
    month: row.month,
    type: row.type as BudgetEntry['type'],
    label: row.label,
    amount: row.amount,
    categoryId: row.categoryId ?? null,
    isConfirmed: Boolean(row.isConfirmed),
    confirmationSource: (row.confirmationSource as BudgetEntry['confirmationSource']) ?? null,
    recurrence: (row.recurrence as BudgetEntry['recurrence']) ?? null,
    createdAt: new Date(row.createdAt),
  };
}

export class BudgetRepository implements IBudgetRepository {
  async getByMonth(month: string): Promise<BudgetEntry[]> {
    const rows = await db.select().from(budgetEntries).where(eq(budgetEntries.month, month));
    return rows.map(toEntity);
  }

  async create(entry: Omit<BudgetEntry, 'id' | 'createdAt'>): Promise<BudgetEntry> {
    const result = await db
      .insert(budgetEntries)
      .values({ ...entry, createdAt: new Date().toISOString() })
      .returning();
    return toEntity(result[0]);
  }

  async update(id: number, data: Partial<Omit<BudgetEntry, 'id'>>): Promise<BudgetEntry> {
    const result = await db
      .update(budgetEntries)
      .set(data)
      .where(eq(budgetEntries.id, id))
      .returning();
    return toEntity(result[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(budgetEntries).where(eq(budgetEntries.id, id));
  }

  async confirm(id: number, source: BudgetEntry['confirmationSource']): Promise<void> {
    await db
      .update(budgetEntries)
      .set({ isConfirmed: true, confirmationSource: source })
      .where(eq(budgetEntries.id, id));
  }

  async getMonthlyReport(month: string): Promise<MonthlyReport> {
    const entries = await this.getByMonth(month);

    const totalIncome = entries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = entries
      .filter((e) => e.type !== 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryBreakdown: Record<number, number> = {};
    entries
      .filter((e) => e.type !== 'income' && e.categoryId !== null)
      .forEach((e) => {
        const catId = e.categoryId!;
        categoryBreakdown[catId] = (categoryBreakdown[catId] ?? 0) + e.amount;
      });

    return { month, totalIncome, totalExpenses, totalScanned: 0, categoryBreakdown };
  }
}
