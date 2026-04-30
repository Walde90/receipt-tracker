import { FuzzyAlias } from '../entities/FuzzyAlias';

export interface IFuzzyAliasRepository {
  getAll(): Promise<FuzzyAlias[]>;
  create(alias: Omit<FuzzyAlias, 'id' | 'createdAt'>): Promise<FuzzyAlias>;
  incrementHit(id: number): Promise<void>;
  decrementConfidence(id: number): Promise<void>;
}
