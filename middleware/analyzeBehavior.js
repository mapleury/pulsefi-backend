const db = require('../database/init');

module.exports = async (req, res, next) => {
    try {
        const userId = req.userId;
        const today = new Date().toISOString().split('T')[0];
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const streak = await db.getAsync("SELECT * FROM streaks WHERE user_id = ?", [userId]);
        
        if (streak) {
            if (streak.last_check_date !== today) {
                let newStreak;

                if (streak.last_check_date === yesterdayStr) {
                    newStreak = streak.current_streak + 1;
                } else {
                    newStreak = 1;
                }

                const newLongest = Math.max(newStreak, streak.longest_streak);
                
                await db.runAsync(
                    "UPDATE streaks SET current_streak = ?, longest_streak = ?, last_check_date = ? WHERE user_id = ?",
                    [newStreak, newLongest, today, userId]
                );
            }
        } else {
            await db.runAsync(
                "INSERT INTO streaks (user_id, current_streak, longest_streak, last_check_date) VALUES (?, 1, 1, ?)",
                [userId, today]
            );
        }
        next();
    } catch (err) {
        console.error("Streak Middleware Error:", err);
        next(); 
    }
};