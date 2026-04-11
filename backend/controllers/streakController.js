const db = require('../config/database');

exports.checkStreak = async (req, res) => {
    try {
        const streakData = await db.get("SELECT * FROM streaks LIMIT 1");
        
        // Check if there are any expenses today
        const spentToday = await db.get(`
            SELECT COUNT(*) as count FROM transactions 
            WHERE type = 'expense' AND date(date) = date('now')
        `);

        res.json({
            currentStreak: streakData.current_streak,
            onFire: streakData.current_streak >= 3, // Vibe: highlight UI if 3+ days
            canSaveToday: spentToday.count === 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};