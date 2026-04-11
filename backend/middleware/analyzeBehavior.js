const db = require('../database');

const analyzeBehavior = async (req, res, next) => {
    const { type, category } = req.body;

    try {
        if (type === 'expense' && category !== 'Fixed Needs') {
            // Using getAsync to match your DB utility pattern
            const result = await db.getAsync(`
                SELECT COUNT(*) as count FROM transactions 
                WHERE date > datetime('now', '-1 day') 
                AND category != 'Fixed Needs'
            `);

            if (result && result.count >= 5) {
                console.log("⚠️ Impulse Spike Detected!");
                req.impulseWarning = true;
            }
        }
        next();
    } catch (err) {
        console.error("Middleware Error:", err.message);
        // We call next() anyway so the transaction still saves even if analysis fails
        next();
    }
};

module.exports = analyzeBehavior;