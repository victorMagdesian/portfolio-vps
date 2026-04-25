import Database from "better-sqlite3"
import path from "path"

let _db: Database.Database | null = null

export function getShopDb(): Database.Database {
  if (_db) return _db
  _db = new Database(path.join(process.cwd(), "data", "shop.db"))
  _db.pragma("journal_mode = WAL")
  _db.pragma("foreign_keys = ON")
  migrate(_db)
  return _db
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      active     INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT DEFAULT '',
      price       REAL NOT NULL,
      cover_url   TEXT DEFAULT '',
      group_id    INTEGER REFERENCES groups(id) ON DELETE SET NULL,
      active      INTEGER DEFAULT 1,
      sort_order  INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      phone        TEXT UNIQUE NOT NULL,
      verified_at  TEXT NOT NULL,
      created_at   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id                     INTEGER PRIMARY KEY AUTOINCREMENT,
      phone                  TEXT NOT NULL,
      payer_name             TEXT DEFAULT '',
      payer_email            TEXT DEFAULT '',
      product_id             INTEGER REFERENCES products(id),
      product_name           TEXT NOT NULL,
      amount                 REAL NOT NULL,
      status                 TEXT DEFAULT 'pending',
      gateway_preference_id  TEXT,
      gateway_transaction_id TEXT,
      checkout_url           TEXT,
      admin_notes            TEXT DEFAULT '',
      created_at             TEXT DEFAULT (datetime('now')),
      updated_at             TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_events (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      type       TEXT NOT NULL,
      content    TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)

  // Migrations: add columns if they don't exist yet
  const cols = (db.pragma("table_info(orders)") as { name: string }[]).map(c => c.name)
  if (!cols.includes("payer_name"))  db.exec("ALTER TABLE orders ADD COLUMN payer_name TEXT DEFAULT ''")
  if (!cols.includes("payer_email")) db.exec("ALTER TABLE orders ADD COLUMN payer_email TEXT DEFAULT ''")
  if (!cols.includes("admin_notes")) db.exec("ALTER TABLE orders ADD COLUMN admin_notes TEXT DEFAULT ''")
  if (!cols.includes("updated_at"))  db.exec("ALTER TABLE orders ADD COLUMN updated_at TEXT DEFAULT (datetime('now'))")
}

export type Group = {
  id: number
  name: string
  sort_order: number
  active: number
  created_at: string
}

export type Product = {
  id: number
  name: string
  description: string
  price: number
  cover_url: string
  group_id: number | null
  active: number
  sort_order: number
  created_at: string
}

export type Order = {
  id: number
  phone: string
  payer_name: string
  payer_email: string
  product_id: number | null
  product_name: string
  amount: number
  status: string
  gateway_preference_id: string | null
  gateway_transaction_id: string | null
  checkout_url: string | null
  admin_notes: string
  created_at: string
  updated_at: string
}

export type OrderEvent = {
  id: number
  order_id: number
  type: string
  content: string
  created_at: string
}
