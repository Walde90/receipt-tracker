import { Receipt, LineItem } from '../entities/Receipt';

export interface IReceiptRepository {
  getAll(): Promise<Receipt[]>;
  getById(id: number): Promise<Receipt | null>;
  create(receipt: Omit<Receipt, 'id' | 'createdAt'>): Promise<Receipt>;
  delete(id: number): Promise<void>;
}

export interface ILineItemRepository {
  getByReceiptId(receiptId: number): Promise<LineItem[]>;
  create(lineItem: Omit<LineItem, 'id' | 'createdAt'>): Promise<LineItem>;
  update(id: number, lineItem: Partial<Omit<LineItem, 'id'>>): Promise<LineItem>;
  assignCategories(lineItemId: number, categoryIds: number[]): Promise<void>;
}
