import Fuse from 'fuse.js';
import { FuzzyAlias, CategorySuggestion } from '../../domain/entities/FuzzyAlias';

const AUTO_APPLY_THRESHOLD = 0.85;
const SUGGEST_THRESHOLD = 0.70;
const SIZE_SUFFIX_PATTERN = /\s+\d+(\.\d+)?\s*(ml|l|g|kg|cl|stk|pcs|x)?$/i;

export class FuzzyMatcherService {
  private fuse: Fuse<FuzzyAlias> | null = null;

  load(aliases: FuzzyAlias[]): void {
    this.fuse = new Fuse(aliases, {
      keys: ['rawPattern'],
      threshold: 1 - SUGGEST_THRESHOLD,
      includeScore: true,
    });
  }

  suggest(rawName: string): CategorySuggestion | null {
    if (!this.fuse) return null;

    const normalized = this.normalizeName(rawName);
    const results = this.fuse.search(normalized);

    if (results.length === 0 || results[0].score === undefined) return null;

    const confidence = 1 - results[0].score;
    if (confidence < SUGGEST_THRESHOLD) return null;

    return {
      categoryId: results[0].item.categoryId,
      confidence,
      isAutoApplied: confidence >= AUTO_APPLY_THRESHOLD,
    };
  }

  private normalizeName(rawName: string): string {
    return rawName.trim().replace(SIZE_SUFFIX_PATTERN, '').toLowerCase();
  }
}

export const fuzzyMatcherService = new FuzzyMatcherService();
