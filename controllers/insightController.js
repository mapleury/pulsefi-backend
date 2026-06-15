const db = require('../database/init');

exports.getInsights = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Ambil total income vs expense
        const summary = await db.getAsync(
            `SELECT 
                SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
             FROM transactions WHERE user_id = ?`, [userId]
        );

        // 2. Ambil pengeluaran per kategori
        const categories = await db.allAsync(
            `SELECT category, SUM(amount) as total 
             FROM transactions 
             WHERE user_id = ? AND type='expense'
             GROUP BY category 
             ORDER BY total DESC`, [userId]
        );

        res.json({
            summary: {
                income: summary.income || 0,
                expense: summary.expense || 0,
                savings: (summary.income || 0) - (summary.expense || 0)
            },
            categories
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};