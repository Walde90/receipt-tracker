import { Category, CategoryTree } from '../Category';

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 1,
  name: 'Lebensmittel',
  parentId: null,
  color: '#6B7280',
  icon: 'tag',
  sortOrder: 0,
  ...overrides,
});

const makeCategoryTree = (overrides: Partial<CategoryTree> = {}): CategoryTree => ({
  ...makeCategory(),
  children: [],
  ...overrides,
});

describe('Category', () => {
  it('root category has no parent', () => {
    const category = makeCategory({ parentId: null });
    expect(category.parentId).toBeNull();
  });

  it('subcategory references parent by id', () => {
    const parent = makeCategory({ id: 1 });
    const child = makeCategory({ id: 2, parentId: parent.id, name: 'Getränke' });
    expect(child.parentId).toBe(parent.id);
  });
});

describe('CategoryTree', () => {
  it('leaf node has empty children array', () => {
    const leaf = makeCategoryTree({ children: [] });
    expect(leaf.children).toHaveLength(0);
  });

  it('parent node contains child nodes', () => {
    const child = makeCategoryTree({ id: 2, name: 'Getränke', parentId: 1 });
    const parent = makeCategoryTree({ id: 1, children: [child] });
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0].name).toBe('Getränke');
  });

  it('supports three levels of nesting', () => {
    const level3 = makeCategoryTree({ id: 3, name: 'Säfte', parentId: 2 });
    const level2 = makeCategoryTree({ id: 2, name: 'Getränke', parentId: 1, children: [level3] });
    const level1 = makeCategoryTree({ id: 1, name: 'Lebensmittel', children: [level2] });

    expect(level1.children[0].children[0].name).toBe('Säfte');
  });
});
