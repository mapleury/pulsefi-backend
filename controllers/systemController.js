const db = require('../config/database');

const SystemController = {
  // --- 1. USER AUTHENTICATION (Simplified for 48h Sprint) ---
  // In vibe coding, we'll assume a single-user system or simple name-based login
  login: async (req, res) => {
    try {
      const { name } = req.body;
      let user = await db.get("SELECT * FROM profiles WHERE name = ?", [name]);
      
      if (!user) {
        // Auto-register if not found (Hackathon style)
        const result = await db.run("INSERT INTO profiles (name) VALUES (?)", [name]);
        user = await db.get("SELECT * FROM profiles WHERE id = ?", [result.id]);
      }
      
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // --- 2. FINANCIAL PROFILE & PULSE ---
  // Calculates the "Pulse Score" and "Identity Type"
  getProfile: async (req, res) => {
    try {
      const profile = await db.get("SELECT * FROM profiles LIMIT 1");
      
      // Dynamic Pulse Calculation logic:
      // Let's base it on (Savings / Total Expenses) * Discipline
      const stats = await db.get(`
        SELECT 
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_out,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_in
        FROM transactions
      `);

      // Update Pulse Score logic (0-100)
      let pulse = 50; 
      if (stats.total_in > 0) {
        pulse = Math.round((stats.total_in - stats.total_out) / stats.total_in * 100);
      }
      
      // Identity Logic
      let identity = 'Explorer';
      if (pulse > 80) identity = 'Guardian';
      else if (pulse > 50) identity = 'Strategist';
      else identity = 'Hustler';

      await db.run("UPDATE profiles SET pulse_score = ?, identity_type = ? WHERE id = ?", [pulse, identity, profile.id]);
      
      res.json({ ...profile, pulse_score: pulse, identity_type: identity });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // --- 3. STREAK SYSTEM (Streak ga boros) ---
  getStreak: async (req, res) => {
    try {
      const streak = await db.get("SELECT * FROM streaks LIMIT 1");
      
      // Logic: If last expense was not today, streak continues
      const todayExpense = await db.get("SELECT id FROM transactions WHERE type = 'expense' AND date(date) = date('now')");
      
      res.json({ 
        current_streak: streak.current_streak,
        is_safe_today: !todayExpense,
        message: todayExpense ? "Streak at risk! You spent today." : "Keep it up!"
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // --- 4. SMART WARNING & NOTIFICATIONS ---
  // Fetches "Regret Replay" and "Smart Warnings" for the Modals
  getNotifications: async (req, res) => {
    try {
      // Get unread notifications
      const list = await db.query("SELECT * FROM notifications WHERE is_read = 0 ORDER BY created_at DESC");
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  markRead: async (req, res) => {
    try {
      const { id } = req.params;
      await db.run("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = SystemController;