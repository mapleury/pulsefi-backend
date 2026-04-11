const db = require('../database');

exports.getPulse = async (req, res) => {
    try {
        // Fetch profile and recent transaction stats
        const profile = await db.get("SELECT * FROM profiles LIMIT 1");
        const stats = await db.get(`
            SELECT 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_spent,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_earned
            FROM transactions
        `);

        // Calculate Pulse Score (0-100)
        let pulseScore = 50;
        if (stats.total_earned > 0) {
            pulseScore = Math.round(((stats.total_earned - stats.total_spent) / stats.total_earned) * 100);
        }
        
        // Clamp between 0 and 100
        pulseScore = Math.max(0, Math.min(100, pulseScore));

        // Update Identity based on Pulse
        let identity = 'Explorer';
        if (pulseScore > 80) identity = 'Mastermind';
        else if (pulseScore > 40) identity = 'Strategist';
        else identity = 'Survivor';

        await db.run("UPDATE profiles SET pulse_score = ?, identity_type = ? WHERE id = ?", 
            [pulseScore, identity, profile.id]);

        res.json({ pulseScore, identity, stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};