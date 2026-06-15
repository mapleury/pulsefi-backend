const db = require('../database/init');

// 1. TAMBAH TRANSAKSI + SYNC KE GOALS
exports.addTransaction = async (req, res) => {
    const { amount, category, category_type, description, type } = req.body;
    const userId = req.userId; 
    try {
        // STEP 1: Simpan transaksi ke tabel transactions
        const result = await db.runAsync(
            `INSERT INTO transactions (user_id, amount, category, category_type, description, type, date) 
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
            [userId, amount, category, category_type || 'primary', description, type]
        );

        // STEP 2: SYNC KE GOALS (Jika Income masuk ke Goal tertentu)
        if (type === 'income' && category !== 'General Income') {
            const syncGoal = await db.runAsync(
                `UPDATE goals 
                 SET current = current + ? 
                 WHERE user_id = ? 
                 AND LOWER(TRIM(name)) = LOWER(TRIM(?))`,
                [amount, userId, category]
            );

            if (syncGoal.changes > 0) {
                console.log(`✅ Saldo Goal "${category}" berhasil diupdate!`);
            } else {
                console.log(`⚠️ Transaksi masuk, tapi Goal "${category}" tidak ditemukan.`);
            }
        }

        res.status(201).json({ id: result.lastID, message: "Transaction added and synced successfully" });
    } catch (err) {
        console.error("🔥 Error addTransaction:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. AMBIL SEMUA TRANSAKSI (History)
exports.getAllTransactions = async (req, res) => {
    try {
        const rows = await db.allAsync(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC", 
            [req.userId]
        );
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. AMBIL RECENT TRANSACTIONS (Dashboard)
exports.getRecentTransactions = async (req, res) => {
    try {
        const rows = await db.allAsync(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 5", 
            [req.userId]
        );
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. UPDATE / EDIT TRANSAKSI
exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount, category, category_type, description, type } = req.body;
    const userId = req.userId;
    try {
        const result = await db.runAsync(
            `UPDATE transactions SET amount = ?, category = ?, category_type = ?, description = ?, type = ? 
             WHERE id = ? AND user_id = ?`,
            [amount, category, category_type || 'primary', description, type, id, userId]
        );
        
        if (result.changes === 0) {
            return res.status(403).json({ error: "Unauthorized: Data tidak ditemukan atau milik user lain" });
        }
        
        res.json({ message: "Transaction updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. HAPUS TRANSAKSI
exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const result = await db.runAsync(
            `DELETE FROM transactions WHERE id = ? AND user_id = ?`, 
            [id, userId]
        );
        
        if (result.changes === 0) {
            return res.status(403).json({ error: "Unauthorized: Kamu tidak bisa menghapus data orang lain" });
        }

        res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. RINGKASAN SALDO
exports.getTransactionSummary = async (req, res) => {
    try {
        const income = await db.getAsync(
            "SELECT SUM(amount) as total FROM transactions WHERE type='income' AND user_id = ?", 
            [req.userId]
        );
        const expense = await db.getAsync(
            "SELECT SUM(amount) as total FROM transactions WHERE type='expense' AND user_id = ?", 
            [req.userId]
        );
        
        const totalIncome = income?.total || 0;
        const totalExpense = expense?.total || 0;

        res.json({
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. GRAFIK MINGGUAN
exports.getWeeklyStats = async (req, res) => {
    try {
        const rows = await db.allAsync(`
            SELECT strftime('%d/%m', date) as day, SUM(amount) as total 
            FROM transactions 
            WHERE type='expense' AND user_id = ? 
            GROUP BY day 
            ORDER BY date DESC LIMIT 7
        `, [req.userId]);
        
        res.json(rows.reverse() || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};