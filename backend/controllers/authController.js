const db = require('../database/init');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = "PULSEFI_SECRET_KEY_2026";

exports.register = async (req, res) => {
    const { username, password, name } = req.body;
    try {
        const hashedPw = await bcrypt.hash(password, 10);
        const result = await db.runAsync(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPw]);
        
        await db.runAsync(`INSERT INTO profiles (user_id, name) VALUES (?, ?)`, [result.lastID, name || username]);
        
        res.status(201).json({ message: "Registrasi Berhasil!" });
    } catch (err) {
        console.error("DEBUG REGISTER ERROR:", err.message);
        
        if (err.message.includes("UNIQUE")) {
            res.status(400).json({ error: "Username sudah dipakai, Mir! Coba yang lain." });
        } else {
            res.status(500).json({ error: "Ada masalah teknis: " + err.message });
        }
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.getAsync(`SELECT * FROM users WHERE username = ?`, [username]);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
            res.json({ token, username: user.username });
        } else {
            res.status(401).json({ error: "Kredensial salah" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};