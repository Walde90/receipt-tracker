export interface FuzzyAlias {
  id: number;
  rawPattern: string;
  categoryId: number;
  confidence: number;
  hitCount: number;
  createdAt: Date;
}

export interface CategorySuggestion {
  categoryId: number;
  confidence: number;
  isAutoApplied: boolean;
}
