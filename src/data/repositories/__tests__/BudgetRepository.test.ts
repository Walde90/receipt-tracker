import { BudgetEntry } from '../../../domain/entities/Budget';

function calculateReport(entries: BudgetEntry[]) {
  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = entries
    .filter((e) => e.type !== 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const suspicious = entries.filter((e) => e.type !== 'income' && !e.isConfirmed);

  return { totalIncome, totalExpenses, suspicious };
}

const makeEntry = (overrides: Partial<BudgetEntry> = {}): BudgetEntry => ({
  id: 1,
  month: '2026-04',
  type: 'fixed_expense',
  label: 'Miete',
  amount: 800,
  categoryId: null,
  isConfirmed: false,
  confirmationSource: null,
  recurrence: 'monthly',
  createdAt: new Date(),
  ...overrides,
});

describe('Budget report calculation', () => {
  it('correctly sums income entries', () => {
    const entries = [
      makeEntry({ type: 'income', amount: 2000, isConfirmed: true }),
      makeEntry({ type: 'income', amount: 500, isConfirmed: true }),
    ];
    const { totalIncome } = calculateReport(entries);
    expect(totalIncome).toBe(2500);
  });

  it('correctly sums expense entries', () => {
    const entries = [
      makeEntry({ type: 'fixed_expense', amount: 800 }),
      makeEntry({ type: 'variable_expense', amount: 150 }),
    ];
    const { totalExpenses } = calculateReport(entries);
    expect(totalExpenses).toBe(950);
  });

  it('income entries are not counted as expenses', () => {
    const entries = [
      makeEntry({ type: 'income', amount: 2000, isConfirmed: true }),
      makeEntry({ type: 'fixed_expense', amount: 800 }),
    ];
    const { totalIncome, totalExpenses } = calculateReport(entries);
    expect(totalIncome).toBe(2000);
    expect(totalExpenses).toBe(800);
  });

  it('returns zero totals for empty entries', () => {
    const { totalIncome, totalExpenses } = calculateReport([]);
    expect(totalIncome).toBe(0);
    expect(totalExpenses).toBe(0);
  });
});

describe('Suspicious flag logic', () => {
  it('unconfirmed expenses are suspicious', () => {
    const entries = [makeEntry({ isConfirmed: false, type: 'fixed_expense' })];
    const { suspicious } = calculateReport(entries);
    expect(suspicious).toHaveLength(1);
  });

  it('confirmed expenses are not suspicious', () => {
    const entries = [
      makeEntry({ isConfirmed: true, confirmationSource: 'receipt', type: 'fixed_expense' }),
    ];
    const { suspicious } = calculateReport(entries);
    expect(suspicious).toHaveLength(0);
  });

  it('income entries are never suspicious', () => {
    const entries = [makeEntry({ type: 'income', isConfirmed: false })];
    const { suspicious } = calculateReport(entries);
    expect(suspicious).toHaveLength(0);
  });

  it('counts multiple suspicious entries correctly', () => {
    const entries = [
      makeEntry({ id: 1, isConfirmed: false, type: 'fixed_expense' }),
      makeEntry({ id: 2, isConfirmed: false, type: 'variable_expense' }),
      makeEntry({ id: 3, isConfirmed: true, type: 'fixed_expense' }),
    ];
    const { suspicious } = calculateReport(entries);
    expect(suspicious).toHaveLength(2);
  });
});
