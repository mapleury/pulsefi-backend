const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'pulsefi.db'); 
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("🔥 Error opening database:", err.message);
  console.log(`✅ Connected to database at: ${dbPath}`);
});

// --- PROMISIFICATION HELPERS (ATTACHED TO DB) ---
db.runAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

db.getAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

db.allAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []); // Return empty array if no rows
        });
    });
};

// --- DB INITIALIZATION ---
const initDb = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      identity_type TEXT DEFAULT 'Strategist',
      total_savings REAL DEFAULT 0,
      discipline_score INTEGER DEFAULT 0,
      pulse_score INTEGER DEFAULT 50 
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT,
      description TEXT,
      type TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target REAL NOT NULL,        
      current REAL DEFAULT 0,      
      deadline DATE,
      status TEXT DEFAULT 'active'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_check_date DATE DEFAULT (CURRENT_DATE)
    )`);

    db.get("SELECT count(*) as count FROM profiles", (err, row) => {
      if (row && row.count === 0) {
        db.run("INSERT INTO profiles (name, identity_type) VALUES ('PulseUser', 'Strategist')");
        db.run("INSERT INTO streaks (current_streak) VALUES (0)");
        console.log("🌱 Seed data generated.");
      }
    });

    console.log("🚀 PulseFi schema is ready.");
  });
};

initDb();

module.exports = db;