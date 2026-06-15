const Database = require('better-sqlite3');
const path = require('path');

const dbFileName = process.env.DB_FILE || 'pulsefi.db';
const dbFolder = process.env.DB_FOLDER || __dirname;
const dbPath = path.resolve(dbFolder, dbFileName);

let db;
try {
  db = new Database(dbPath, { readonly: false, fileMustExist: false, timeout: 60000 });
  db.pragma('journal_mode = WAL');
  console.log(`✅ Connected to database at: ${dbPath}`);
} catch (err) {
  console.error('🔥 Error opening database:', err.message);
  throw err;
}

db.path = dbPath;

// --- PROMISIFICATION HELPERS ---
db.runAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const info = stmt.run(Array.isArray(params) ? params : [params]);
      resolve({ lastID: info.lastInsertRowid, changes: info.changes });
    } catch (err) {
      reject(err);
    }
  });
};

db.getAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const row = stmt.get(Array.isArray(params) ? params : [params]);
      resolve(row);
    } catch (err) {
      reject(err);
    }
  });
};

db.allAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(Array.isArray(params) ? params : [params]);
      resolve(rows || []);
    } catch (err) {
      reject(err);
    }
  });
};

// --- DB INITIALIZATION ---
db.init = () => {
  console.log('🛠️  Sedang memastikan semua tabel tersedia...');

  const run = (sql) => {
    try {
      db.prepare(sql).run();
    } catch (err) {
      console.error('DB init error:', err.message);
    }
  };

  run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    name TEXT,
    image_url TEXT DEFAULT NULL,
    identity_type TEXT DEFAULT 'Strategist',
    total_savings REAL DEFAULT 0,
    discipline_score INTEGER DEFAULT 0,
    pulse_score INTEGER DEFAULT 50,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL NOT NULL,
    category TEXT,
    category_type TEXT DEFAULT 'primary',
    description TEXT,
    type TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  run(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    target REAL NOT NULL,
    current REAL DEFAULT 0,
    deadline DATE,
    status TEXT DEFAULT 'active',
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  run(`CREATE TABLE IF NOT EXISTS streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_check_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  try {
    db.prepare(`ALTER TABLE transactions ADD COLUMN category_type TEXT DEFAULT 'primary'`).run();
    console.log("✅ Database Updated: Kolom 'category_type' berhasil ditambahkan.");
  } catch (err) {
    if (!/duplicate column name/i.test(err.message)) {
      console.error('DB migration error:', err.message);
    }
  }

  console.log('🚀 PulseFi multi-user schema is ready with Profile Support.');
};

module.exports = db;
