// database.js (in the same folder as app.js)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// We are using ONE database file named pulsefi.sqlite
const dbPath = path.join(__dirname, 'pulsefi.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('✅ Connected to PulseFi SQLite database.');
});

// --- MANUAL PROMISIFIERS ---
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
            else resolve(rows || []);
        });
    });
};

// --- DB INITIALIZATION ---
db.init = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, category TEXT, description TEXT, type TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        
        db.run(`CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, identity_type TEXT DEFAULT 'Strategist', total_savings REAL DEFAULT 0, discipline_score INTEGER DEFAULT 0, pulse_score INTEGER DEFAULT 50)`);

        db.run(`CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, target REAL NOT NULL, current REAL DEFAULT 0, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

        console.log("🚀 All PulseFi tables verified and ready.");
    });
};

module.exports = db;