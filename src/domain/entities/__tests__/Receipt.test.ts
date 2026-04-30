import { LineItem, Receipt } from '../Receipt';

const makeReceipt = (overrides: Partial<Receipt> = {}): Receipt => ({
  id: 1,
  storeName: 'Rewe',
  scannedAt: new Date('2026-04-30'),
  totalAmount: 42.5,
  imageUri: '/local/path/receipt.jpg',
  createdAt: new Date('2026-04-30'),
  ...overrides,
});

const makeLineItem = (overrides: Partial<LineItem> = {}): LineItem => ({
  id: 1,
  receiptId: 1,
  rawName: 'CHOC MLK 1L',
  normalizedName: 'Schokoladenmilch 1L',
  quantity: 1,
  unitPrice: 1.29,
  totalPrice: 1.29,
  isDiscount: false,
  categoryIds: [],
  createdAt: new Date('2026-04-30'),
  ...overrides,
});

describe('Receipt', () => {
  it('has a store name and total amount', () => {
    const receipt = makeReceipt();
    expect(receipt.storeName).toBe('Rewe');
    expect(receipt.totalAmount).toBe(42.5);
  });

  it('stores image URI for local file reference', () => {
    const receipt = makeReceipt({ imageUri: '/local/receipt.jpg' });
    expect(receipt.imageUri).toBeTruthy();
  });
});

describe('LineItem', () => {
  it('preserves raw OCR name separately from normalized name', () => {
    const item = makeLineItem();
    expect(item.rawName).toBe('CHOC MLK 1L');
    expect(item.normalizedName).toBe('Schokoladenmilch 1L');
  });

  it('discount items have negative or zero total price', () => {
    const discount = makeLineItem({ isDiscount: true, totalPrice: -1.0, unitPrice: -1.0 });
    expect(discount.isDiscount).toBe(true);
    expect(discount.totalPrice).toBeLessThanOrEqual(0);
  });

  it('can belong to multiple categories', () => {
    const item = makeLineItem({ categoryIds: [1, 3] });
    expect(item.categoryIds).toHaveLength(2);
    expect(item.categoryIds).toContain(1);
    expect(item.categoryIds).toContain(3);
  });

  it('total price equals unit price times quantity', () => {
    const item = makeLineItem({ quantity: 3, unitPrice: 2.0, totalPrice: 6.0 });
    expect(item.totalPrice).toBe(item.quantity * item.unitPrice);
  });

  it('references parent receipt by id', () => {
    const receipt = makeReceipt({ id: 99 });
    const item = makeLineItem({ receiptId: receipt.id });
    expect(item.receiptId).toBe(99);
  });
});
