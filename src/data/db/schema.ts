import { int, real, text, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  parentId: int('parent_id').references((): any => categories.id),
  color: text('color').notNull().default('#6B7280'),
  icon: text('icon').notNull().default('tag'),
  sortOrder: int('sort_order').notNull().default(0),
});

export const receipts = sqliteTable('receipts', {
  id: int('id').primaryKey({ autoIncrement: true }),
  storeName: text('store_name').notNull(),
  scannedAt: text('scanned_at').notNull(),
  totalAmount: real('total_amount').notNull(),
  imageUri: text('image_uri').notNull(),
  createdAt: text('created_at').notNull(),
});

export const lineItems = sqliteTable('line_items', {
  id: int('id').primaryKey({ autoIncrement: true }),
  receiptId: int('receipt_id').notNull().references(() => receipts.id),
  rawName: text('raw_name').notNull(),
  normalizedName: text('normalized_name').notNull(),
  quantity: real('quantity').notNull().default(1),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
  isDiscount: int('is_discount', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const lineItemCategories = sqliteTable('line_item_categories', {
  lineItemId: int('line_item_id').notNull().references(() => lineItems.id),
  categoryId: int('category_id').notNull().references(() => categories.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.lineItemId, table.categoryId] }),
}));

export const fuzzyAliases = sqliteTable('fuzzy_aliases', {
  id: int('id').primaryKey({ autoIncrement: true }),
  rawPattern: text('raw_pattern').notNull(),
  categoryId: int('category_id').notNull().references(() => categories.id),
  confidence: real('confidence').notNull().default(1.0),
  hitCount: int('hit_count').notNull().default(1),
  createdAt: text('created_at').notNull(),
});

export const budgetEntries = sqliteTable('budget_entries', {
  id: int('id').primaryKey({ autoIncrement: true }),
  month: text('month').notNull(),
  type: text('type', { enum: ['income', 'fixed_expense', 'variable_expense'] }).notNull(),
  label: text('label').notNull(),
  amount: real('amount').notNull(),
  categoryId: int('category_id').references(() => categories.id),
  isConfirmed: int('is_confirmed', { mode: 'boolean' }).notNull().default(false),
  confirmationSource: text('confirmation_source', { enum: ['receipt', 'bank_import', 'manual_confirm'] }),
  recurrence: text('recurrence', { enum: ['monthly', 'once'] }),
  createdAt: text('created_at').notNull(),
});
