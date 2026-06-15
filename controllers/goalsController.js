const db = require('../database/init');

// 1. Ambil Goals (Ditingkatkan dengan Safety Check)
exports.getGoals = async (req, res) => {
    try {
        const goals = await db.allAsync(
            "SELECT * FROM goals WHERE user_id = ? ORDER BY id DESC", 
            [req.userId]
        );
        
        const data = (goals || []).map(g => {
            const target = parseFloat(g.target) || 0;
            const current = parseFloat(g.current) || 0;
            return {
                ...g,
                target,
                current,
                progress: target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
            };
        });
        res.json(data);
    } catch (err) {
        console.error("SQL Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. Buat Goal Baru
exports.createGoal = async (req, res) => {
    const { name, target, current } = req.body;
    try {
        const result = await db.runAsync(
            `INSERT INTO goals (user_id, name, target, current, status) VALUES (?, ?, ?, ?, 'active')`,
            [req.userId, name, target, current || 0]
        );
        res.status(201).json({ id: result.lastID, name, target, current: current || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Update Goal
exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const { name, target, current } = req.body;
    try {
        const result = await db.runAsync(
            `UPDATE goals SET name = ?, target = ?, current = ? WHERE id = ? AND user_id = ?`,
            [name, target, current, id, req.userId]
        );
        
        if (result.changes === 0) {
            return res.status(403).json({ error: "Izin ditolak atau data tidak ada" });
        }
        res.json({ message: "Goal updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Hapus Goal
exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.runAsync(
            `DELETE FROM goals WHERE id = ? AND user_id = ?`, 
            [id, req.userId]
        );
        if (result.changes === 0) return res.status(403).json({ error: "Gagal hapus" });
        res.json({ message: "Goal deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Simulasi Goal
exports.simulateGoal = (req, res) => {
    const { target, monthly } = req.body;
    if (!target || !monthly) return res.status(400).json({ error: "Missing data" });
    const months = Math.ceil(target / monthly);
    res.json({
        months,
        insight: months > 12 ? "Focus on the long game." : "You're sprinting to the finish!"
    });
};