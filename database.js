// database.js (in the same folder as app.js)
const Database = require('better-sqlite3');
const path = require('path');

// We are using ONE database file named pulsefi.sqlite
const dbPath = path.join(__dirname, 'pulsefi.sqlite');
const db = new Database(dbPath, { readonly: false, fileMustExist: false, timeout: 60000 });

try {
    db.pragma('journal_mode = WAL');
    console.log('✅ Connected to PulseFi SQLite database.');
} catch (err) {
    console.error('Database connection error:', err.message);
}

// --- MANUAL PROMISIFIERS ---
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
    try {
        db.prepare(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, category TEXT, description TEXT, type TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
        db.prepare(`CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, identity_type TEXT DEFAULT 'Strategist', total_savings REAL DEFAULT 0, discipline_score INTEGER DEFAULT 0, pulse_score INTEGER DEFAULT 50)`).run();
        db.prepare(`CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, target REAL NOT NULL, current REAL DEFAULT 0, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run();
        console.log("🚀 All PulseFi tables verified and ready.");
    } catch (err) {
        console.error('DB init error:', err.message);
    }
};

module.exports = db;
