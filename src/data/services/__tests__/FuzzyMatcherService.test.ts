import { FuzzyMatcherService } from '../FuzzyMatcherService';
import { FuzzyAlias } from '../../../domain/entities/FuzzyAlias';

const makeAlias = (id: number, rawPattern: string, categoryId: number): FuzzyAlias => ({
  id,
  rawPattern,
  categoryId,
  confidence: 1.0,
  hitCount: 1,
  createdAt: new Date(),
});

describe('FuzzyMatcherService', () => {
  let service: FuzzyMatcherService;

  beforeEach(() => {
    service = new FuzzyMatcherService();
  });

  describe('suggest', () => {
    it('returns null when no aliases are loaded', () => {
      const result = service.suggest('Coca Cola');
      expect(result).toBeNull();
    });

    it('returns null when aliases list is empty', () => {
      service.load([]);
      const result = service.suggest('Coca Cola');
      expect(result).toBeNull();
    });

    it('returns a suggestion for an exact match', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('coca cola');
      expect(result).not.toBeNull();
      expect(result!.categoryId).toBe(1);
    });

    it('returns a suggestion for a fuzzy match (typo)', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('coka cola');
      expect(result).not.toBeNull();
      expect(result!.categoryId).toBe(1);
    });

    it('strips trailing size suffixes before matching', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('Coca Cola 1.5L');
      expect(result).not.toBeNull();
      expect(result!.categoryId).toBe(1);
    });

    it('strips trailing weight suffixes before matching', () => {
      service.load([makeAlias(1, 'milch', 2)]);
      const result = service.suggest('Milch 500g');
      expect(result).not.toBeNull();
      expect(result!.categoryId).toBe(2);
    });

    it('returns null for a completely unrelated item', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('Windschutzscheibe');
      expect(result).toBeNull();
    });

    it('marks high-confidence matches as auto-applied', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('coca cola');
      expect(result!.isAutoApplied).toBe(true);
    });

    it('does not auto-apply low-confidence matches', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('cok col');
      if (result) {
        expect(result.isAutoApplied).toBe(false);
      }
    });

    it('confidence is between 0 and 1', () => {
      service.load([makeAlias(1, 'coca cola', 1)]);
      const result = service.suggest('coca cola');
      expect(result!.confidence).toBeGreaterThan(0);
      expect(result!.confidence).toBeLessThanOrEqual(1);
    });

    it('matches are case-insensitive', () => {
      service.load([makeAlias(1, 'MILCH VOLLMILCH', 2)]);
      const result = service.suggest('milch vollmilch');
      expect(result).not.toBeNull();
      expect(result!.categoryId).toBe(2);
    });

    it('picks the best match when multiple aliases exist', () => {
      service.load([makeAlias(1, 'coca cola', 1), makeAlias(2, 'pepsi cola', 2)]);
      const result = service.suggest('coca cola');
      expect(result!.categoryId).toBe(1);
    });
  });
});
