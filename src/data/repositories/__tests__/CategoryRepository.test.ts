import { Category, CategoryTree } from '../../../domain/entities/Category';

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

const makeCategory = (id: number, name: string, parentId: number | null = null): Category => ({
  id,
  name,
  parentId,
  color: '#10B981',
  icon: 'tag',
  sortOrder: id,
});

describe('buildTree (CategoryRepository logic)', () => {
  it('returns empty array for empty input', () => {
    expect(buildTree([])).toEqual([]);
  });

  it('returns root categories with no children', () => {
    const tree = buildTree([makeCategory(1, 'Lebensmittel')]);
    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe('Lebensmittel');
    expect(tree[0].children).toHaveLength(0);
  });

  it('attaches children to correct parent', () => {
    const flat = [
      makeCategory(1, 'Lebensmittel'),
      makeCategory(2, 'Getränke', 1),
      makeCategory(3, 'Fleisch', 1),
    ];
    const tree = buildTree(flat);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children.map((c) => c.name)).toContain('Getränke');
    expect(tree[0].children.map((c) => c.name)).toContain('Fleisch');
  });

  it('supports three levels of nesting', () => {
    const flat = [
      makeCategory(1, 'Lebensmittel'),
      makeCategory(2, 'Getränke', 1),
      makeCategory(3, 'Säfte', 2),
    ];
    const tree = buildTree(flat);
    expect(tree[0].children[0].children[0].name).toBe('Säfte');
  });

  it('handles multiple root categories', () => {
    const flat = [
      makeCategory(1, 'Lebensmittel'),
      makeCategory(2, 'Auto'),
      makeCategory(3, 'Haushalt'),
    ];
    const tree = buildTree(flat);
    expect(tree).toHaveLength(3);
  });

  it('orphaned children (unknown parentId) are not added to roots', () => {
    const flat = [
      makeCategory(1, 'Lebensmittel'),
      makeCategory(2, 'Getränke', 99),
    ];
    const tree = buildTree(flat);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(0);
  });
});
