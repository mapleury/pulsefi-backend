const db = require('../database/init');

exports.getStreak = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date().toISOString().split('T')[0];
        
        let streak = await db.getAsync("SELECT * FROM streaks WHERE user_id = ?", [userId]);
        
        if (!streak) {
            return res.json({ current_streak: 0, longest_streak: 0, is_active_today: false });
        }

        // Ambil tanggal transaksi terakhir
        const lastActivity = await db.getAsync(
            "SELECT date(date) as last_date FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 1", 
            [userId]
        );

        const lastActiveDate = lastActivity ? lastActivity.last_date : null;
        
        // Cek apakah terakhir aktif adalah kemarin
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let current = streak.current_streak;

        // LOGIKA RESET:
        // Jika terakhir aktif BUKAN hari ini DAN BUKAN kemarin, maka RESET ke 0.
        if (lastActiveDate !== today && lastActiveDate !== yesterdayStr) {
            current = 0;
            await db.runAsync("UPDATE streaks SET current_streak = 0 WHERE user_id = ?", [userId]);
        }

        res.json({
            current_streak: current,
            longest_streak: streak.longest_streak,
            is_active_today: lastActiveDate === today
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};