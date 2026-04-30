import { create } from 'zustand';
import { Category, CategoryTree } from '../../domain/entities/Category';
import { CategoryRepository } from '../../data/repositories/CategoryRepository';

const repository = new CategoryRepository();

type CategoryStore = {
  categories: Category[];
  tree: CategoryTree[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  create: (category: Omit<Category, 'id'>) => Promise<void>;
  update: (id: number, data: Partial<Omit<Category, 'id'>>) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  tree: [],
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const [categories, tree] = await Promise.all([
        repository.getAll(),
        repository.getTree(),
      ]);
      set({ categories, tree, isLoading: false });
    } catch {
      set({ error: 'Kategorien konnten nicht geladen werden.', isLoading: false });
    }
  },

  create: async (category) => {
    await repository.create(category);
    const [categories, tree] = await Promise.all([
      repository.getAll(),
      repository.getTree(),
    ]);
    set({ categories, tree });
  },

  update: async (id, data) => {
    await repository.update(id, data);
    const [categories, tree] = await Promise.all([
      repository.getAll(),
      repository.getTree(),
    ]);
    set({ categories, tree });
  },

  remove: async (id) => {
    await repository.delete(id);
    const [categories, tree] = await Promise.all([
      repository.getAll(),
      repository.getTree(),
    ]);
    set({ categories, tree });
  },
}));
