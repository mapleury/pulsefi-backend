const db = require('../config/database');

exports.getAlerts = async (req, res) => {
    try {
        // Fetch unread notifications for the modals
        const notifications = await db.query(
            "SELECT * FROM notifications WHERE is_read = 0 ORDER BY created_at DESC"
        );
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// This function can be called internally whenever a transaction is added
exports.createAlert = async (type, message) => {
    try {
        await db.run(
            "INSERT INTO notifications (type, message) VALUES (?, ?)",
            [type, message]
        );
    } catch (err) {
        console.error("Failed to create alert:", err.message);
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await db.run("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};