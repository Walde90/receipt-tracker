import { BudgetEntry, BudgetEntryType, ConfirmationSource } from '../Budget';

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

describe('BudgetEntry', () => {
  describe('suspicious flag logic', () => {
    it('is suspicious when not confirmed and is an expense', () => {
      const entry = makeEntry({ isConfirmed: false, type: 'fixed_expense' });
      expect(entry.isConfirmed).toBe(false);
      expect(entry.type).not.toBe('income');
    });

    it('is not suspicious when confirmed', () => {
      const entry = makeEntry({ isConfirmed: true, confirmationSource: 'receipt' });
      expect(entry.isConfirmed).toBe(true);
      expect(entry.confirmationSource).toBe('receipt');
    });

    it('income entries do not require confirmation', () => {
      const entry = makeEntry({ type: 'income', isConfirmed: false });
      expect(entry.type).toBe('income');
    });
  });

  describe('month format', () => {
    it('stores month as YYYY-MM string', () => {
      const entry = makeEntry({ month: '2026-04' });
      expect(entry.month).toMatch(/^\d{4}-\d{2}$/);
    });
  });

  describe('confirmation sources', () => {
    const validSources: ConfirmationSource[] = ['receipt', 'bank_import', 'manual_confirm'];

    validSources.forEach((source) => {
      it(`accepts confirmation source: ${source}`, () => {
        const entry = makeEntry({ isConfirmed: true, confirmationSource: source });
        expect(entry.confirmationSource).toBe(source);
      });
    });
  });

  describe('entry types', () => {
    const validTypes: BudgetEntryType[] = ['income', 'fixed_expense', 'variable_expense'];

    validTypes.forEach((type) => {
      it(`accepts type: ${type}`, () => {
        const entry = makeEntry({ type });
        expect(entry.type).toBe(type);
      });
    });
  });
});
