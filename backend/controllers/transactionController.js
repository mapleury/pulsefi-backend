const db = require('../database');

exports.addTransaction = async (req, res) => {
    const { amount, category, description, type } = req.body;
    try {
        const result = await db.runAsync(
            `INSERT INTO transactions (amount, category, description, type, date) VALUES (?, ?, ?, ?, datetime('now'))`,
            [amount, category, description, type]
        );
        res.status(201).json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const rows = await db.allAsync("SELECT * FROM transactions ORDER BY date DESC");
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRecentTransactions = async (req, res) => {
    try {
        const rows = await db.allAsync("SELECT * FROM transactions ORDER BY date DESC LIMIT 5");
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionSummary = async (req, res) => {
    try {
        const income = await db.getAsync("SELECT SUM(amount) as total FROM transactions WHERE type='income'");
        const expense = await db.getAsync("SELECT SUM(amount) as total FROM transactions WHERE type='expense'");
        res.json({
            totalIncome: income?.total || 0,
            totalExpense: expense?.total || 0,
            balance: (income?.total || 0) - (expense?.total || 0)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount, category, description, type } = req.body;
    try {
        await db.runAsync(
            `UPDATE transactions SET amount = ?, category = ?, description = ?, type = ? WHERE id = ?`,
            [amount, category, description, type, id]
        );
        res.json({ message: "Updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};