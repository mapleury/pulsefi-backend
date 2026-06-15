const db = require('../database/init');
const bcrypt = require('bcryptjs');

// Ambil data profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await db.getAsync(
            `SELECT p.*, u.username FROM profiles p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.user_id = ?`, [req.userId]
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Nama & Image (URL)
exports.updateProfile = async (req, res) => {
    const { name, image_url } = req.body;
    try {
        await db.runAsync(
            `UPDATE profiles SET name = ?, image_url = ? WHERE user_id = ?`,
            [name, image_url, req.userId]
        );
        res.json({ message: "Profile updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ubah Password dengan Verifikasi Password Lama
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await db.getAsync("SELECT password FROM users WHERE id = ?", [req.userId]);
        
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Password lama salah!" });

        const hashedPw = await bcrypt.hash(newPassword, 10);
        await db.runAsync("UPDATE users SET password = ? WHERE id = ?", [hashedPw, req.userId]);
        
        res.json({ message: "Password berhasil diubah!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};