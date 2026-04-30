export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  color: string;
  icon: string;
  sortOrder: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}
