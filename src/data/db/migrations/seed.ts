import { sqlite } from '../database';

type SeedCategory = {
  name: string;
  color: string;
  icon: string;
  children?: SeedCategory[];
};

const DEFAULT_CATEGORIES: SeedCategory[] = [
  {
    name: 'Lebensmittel',
    color: '#10B981',
    icon: 'cart',
    children: [
      { name: 'Getränke', color: '#10B981', icon: 'water' },
      { name: 'Fleisch & Fisch', color: '#10B981', icon: 'nutrition' },
      { name: 'Obst & Gemüse', color: '#10B981', icon: 'leaf' },
      { name: 'Milchprodukte', color: '#10B981', icon: 'cafe' },
      { name: 'Backwaren', color: '#10B981', icon: 'pizza' },
    ],
  },
  {
    name: 'Genussmittel',
    color: '#F59E0B',
    icon: 'heart',
    children: [
      { name: 'Süßigkeiten', color: '#F59E0B', icon: 'ice-cream' },
      { name: 'Alkohol', color: '#F59E0B', icon: 'wine' },
      { name: 'Zigaretten', color: '#F59E0B', icon: 'flame' },
    ],
  },
  {
    name: 'Auto',
    color: '#3B82F6',
    icon: 'car',
    children: [
      { name: 'Kraftstoff', color: '#3B82F6', icon: 'speedometer' },
      { name: 'Reparatur', color: '#3B82F6', icon: 'build' },
      { name: 'Ersatzteile', color: '#3B82F6', icon: 'settings' },
      { name: 'Versicherung', color: '#3B82F6', icon: 'shield' },
    ],
  },
  {
    name: 'Haushalt',
    color: '#8B5CF6',
    icon: 'home',
    children: [
      { name: 'Reinigung', color: '#8B5CF6', icon: 'sparkles' },
      { name: 'Hygiene', color: '#8B5CF6', icon: 'medkit' },
    ],
  },
  {
    name: 'Versicherung',
    color: '#EC4899',
    icon: 'shield-checkmark',
    children: [],
  },
  {
    name: 'Sonstiges',
    color: '#6B7280',
    icon: 'ellipsis-horizontal',
    children: [],
  },
];

export function seedDefaultCategories(): void {
  const count = sqlite.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM categories');

  if (count && count.count > 0) return;

  let sortOrder = 0;

  for (const cat of DEFAULT_CATEGORIES) {
    const parent = sqlite.runSync(
      'INSERT INTO categories (name, parent_id, color, icon, sort_order) VALUES (?, NULL, ?, ?, ?)',
      cat.name,
      cat.color,
      cat.icon,
      sortOrder++
    );

    const parentId = parent.lastInsertRowId;

    for (const child of cat.children ?? []) {
      sqlite.runSync(
        'INSERT INTO categories (name, parent_id, color, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
        child.name,
        parentId,
        child.color,
        child.icon,
        sortOrder++
      );
    }
  }
}
