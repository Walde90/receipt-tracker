import { create } from 'zustand';
import { BudgetEntry, MonthlyReport } from '../../domain/entities/Budget';
import { BudgetRepository } from '../../data/repositories/BudgetRepository';

const repository = new BudgetRepository();

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

type BudgetStore = {
  entries: BudgetEntry[];
  report: MonthlyReport | null;
  selectedMonth: string;
  isLoading: boolean;
  error: string | null;
  setMonth: (month: string) => void;
  load: () => Promise<void>;
  create: (entry: Omit<BudgetEntry, 'id' | 'createdAt'>) => Promise<void>;
  update: (id: number, data: Partial<Omit<BudgetEntry, 'id'>>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  confirm: (id: number, source: BudgetEntry['confirmationSource']) => Promise<void>;
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  entries: [],
  report: null,
  selectedMonth: currentMonth(),
  isLoading: false,
  error: null,

  setMonth: (month) => {
    set({ selectedMonth: month });
    get().load();
  },

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const { selectedMonth } = get();
      const [entries, report] = await Promise.all([
        repository.getByMonth(selectedMonth),
        repository.getMonthlyReport(selectedMonth),
      ]);
      set({ entries, report, isLoading: false });
    } catch {
      set({ error: 'Budget konnte nicht geladen werden.', isLoading: false });
    }
  },

  create: async (entry) => {
    await repository.create(entry);
    await get().load();
  },

  update: async (id, data) => {
    await repository.update(id, data);
    await get().load();
  },

  remove: async (id) => {
    await repository.delete(id);
    await get().load();
  },

  confirm: async (id, source) => {
    await repository.confirm(id, source);
    await get().load();
  },
}));
