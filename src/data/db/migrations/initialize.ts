import { sqlite } from '../database';

export function initializeDatabase(): void {
  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parent_id INTEGER REFERENCES categories(id),
      color TEXT NOT NULL DEFAULT '#6B7280',
      icon TEXT NOT NULL DEFAULT 'tag',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_name TEXT NOT NULL,
      scanned_at TEXT NOT NULL,
      total_amount REAL NOT NULL,
      image_uri TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS line_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_id INTEGER NOT NULL REFERENCES receipts(id),
      raw_name TEXT NOT NULL,
      normalized_name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      is_discount INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS line_item_categories (
      line_item_id INTEGER NOT NULL REFERENCES line_items(id),
      category_id INTEGER NOT NULL REFERENCES categories(id),
      PRIMARY KEY (line_item_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS fuzzy_aliases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raw_pattern TEXT NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      confidence REAL NOT NULL DEFAULT 1.0,
      hit_count INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budget_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      is_confirmed INTEGER NOT NULL DEFAULT 0,
      confirmation_source TEXT,
      recurrence TEXT,
      created_at TEXT NOT NULL
    );
  `);
}
