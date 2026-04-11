// controllers/goalsController.js
const db = require('../database'); // Point exactly to the root database.js

exports.getGoals = async (req, res) => {
    try {
        const goals = await db.allAsync("SELECT * FROM goals ORDER BY id DESC");
        const data = (goals || []).map(g => ({
            ...g,
            progress: g.target > 0 ? Math.min(Math.round((g.current / g.target) * 100), 100) : 0
        }));
        res.json(data);
    } catch (err) {
        console.error("SQL Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.createGoal = async (req, res) => {
    const { name, target, current } = req.body;
    try {
        const result = await db.runAsync(
            `INSERT INTO goals (name, target, current, status) VALUES (?, ?, ?, 'active')`,
            [name, target, current || 0]
        );
        res.status(201).json({ id: result.lastID, name, target, current: current || 0 });
    } catch (err) {
        console.error("SQL INSERT ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const { name, target, current } = req.body;
    try {
        await db.runAsync(
            `UPDATE goals SET name = ?, target = ?, current = ? WHERE id = ?`,
            [name, target, current, id]
        );
        res.json({ message: "Goal updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
    try {
        await db.runAsync(`DELETE FROM goals WHERE id = ?`, [id]);
        res.json({ message: "Goal deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.simulateGoal = (req, res) => {
    const { target, monthly } = req.body;
    if (!target || !monthly) return res.status(400).json({ error: "Missing data" });
    const months = Math.ceil(target / monthly);
    res.json({
        months,
        insight: months > 12 ? "Focus on the long game." : "You're sprinting to the finish!"
    });
};