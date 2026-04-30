export interface Receipt {
  id: number;
  storeName: string;
  scannedAt: Date;
  totalAmount: number;
  imageUri: string;
  createdAt: Date;
}

export interface LineItem {
  id: number;
  receiptId: number;
  rawName: string;
  normalizedName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isDiscount: boolean;
  categoryIds: number[];
  createdAt: Date;
}
