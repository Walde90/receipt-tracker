import { Category, CategoryTree } from '../entities/Category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getTree(): Promise<CategoryTree[]>;
  getById(id: number): Promise<Category | null>;
  create(category: Omit<Category, 'id'>): Promise<Category>;
  update(id: number, category: Partial<Omit<Category, 'id'>>): Promise<Category>;
  delete(id: number): Promise<void>;
}
