import { eq } from 'drizzle-orm';
import { db } from '../db/database';
import { categories } from '../db/schema';
import { Category, CategoryTree } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

function toEntity(row: typeof categories.$inferSelect): Category {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parentId ?? null,
    color: row.color,
    icon: row.icon,
    sortOrder: row.sortOrder,
  };
}

function buildTree(flat: Category[]): CategoryTree[] {
  const map = new Map<number, CategoryTree>();
  const roots: CategoryTree[] = [];

  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));

  flat.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(c.parentId);
      if (parent) parent.children.push(node);
    }
  });

  return roots;
}

export class CategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    const rows = await db.select().from(categories).orderBy(categories.sortOrder);
    return rows.map(toEntity);
  }

  async getTree(): Promise<CategoryTree[]> {
    const all = await this.getAll();
    return buildTree(all);
  }

  async getById(id: number): Promise<Category | null> {
    const rows = await db.select().from(categories).where(eq(categories.id, id));
    return rows.length > 0 ? toEntity(rows[0]) : null;
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return toEntity(result[0]);
  }

  async update(id: number, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
    const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return toEntity(result[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }
}
