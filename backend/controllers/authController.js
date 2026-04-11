const db = require('../config/database');

exports.login = async (req, res) => {
    const { name } = req.body;
    try {
        let user = await db.get("SELECT * FROM profiles WHERE name = ?", [name]);
        if (!user) {
            const result = await db.run("INSERT INTO profiles (name) VALUES (?)", [name]);
            user = { id: result.id, name };
        }
        res.json({ message: "Welcome to PulseFi", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};