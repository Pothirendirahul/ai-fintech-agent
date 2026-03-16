const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../db/fintech.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')),
    category TEXT DEFAULT 'general',
    is_flagged INTEGER DEFAULT 0,
    flag_reason TEXT,
    date TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    message TEXT NOT NULL,
    type TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    role TEXT NOT NULL,
    message TEXT NOT NULL,
    agent_used TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('✅ SQLite connected and tables ready');

module.exports = db;