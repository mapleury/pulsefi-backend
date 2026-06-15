const axios = require('axios');
const db = require('../database/init');

const API_KEY = "AIzaSyA4CswwottfyuQ38BK0VGFbAMN5JEd8YuE";
let aiCache = {}; 
const CACHE_DURATION = 10 * 60 * 1000; 

// --- FUNGSI LAMA (Dashboard Advice) ---
exports.getFinancialAdvice = async (req, res) => {
    const now = Date.now();
    const userId = req.userId;
    if (aiCache[userId] && (now - aiCache[userId].time < CACHE_DURATION)) {
        return res.json({ advice: aiCache[userId].advice });
    }
    let income = 0; let expense = 0; let userName = "User";
    try {
        const profileRow = await db.getAsync("SELECT name FROM profiles WHERE user_id = ?", [userId]);
        userName = profileRow ? profileRow.name : "User";
        const dataSummary = await db.getAsync(`SELECT SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense FROM transactions WHERE user_id = ?`, [userId]);
        const topCategory = await db.getAsync(`SELECT category FROM transactions WHERE user_id = ? AND type='expense' GROUP BY category ORDER BY SUM(amount) DESC LIMIT 1`, [userId]);
        income = dataSummary?.income || 0; expense = dataSummary?.expense || 0;
        const boros = topCategory ? topCategory.category : "Belum ada";
        const promptText = `User bernama ${userName}. Stats: Income Rp${income}, Expense Rp${expense}. Terboros: ${boros}. Beri 1 saran keuangan sangat singkat, cerdas, dan panggil namanya (max 12 kata).`;
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, { contents: [{ parts: [{ text: promptText }] }] });
        const advice = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (advice) {
            aiCache[userId] = { advice: advice.trim(), time: now };
            res.json({ advice: advice.trim() });
        } else { throw new Error(); }
    } catch (err) {
        res.json({ advice: `Tetap semangat pantau Pulse kamu, ${userName}!` });
    }
};

// --- FUNGSI BARU (PulseAI Mentor Chat) ---
exports.chatWithAI = async (req, res) => {
    let userName = "User";
    let balance = 0;

    try {
        const userId = req.userId;
        const data = await db.getAsync(
            `SELECT 
                SUM(CASE WHEN type='income' THEN amount ELSE 0 END) - 
                SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as balance
             FROM transactions WHERE user_id = ?`, [userId]
        );
        const profile = await db.getAsync("SELECT name FROM profiles WHERE user_id = ?", [userId]);
        
        userName = profile ? profile.name : "Mirza";
        balance = data.balance || 0;
        const { message } = req.body;

        // --- TEMBAK API GEMINI ---
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            { contents: [{ parts: [{ text: `User: ${userName}. Balance: Rp${balance}. Chat: ${message}. Jawab bijak & gaul.` }] }] }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ reply: reply.trim() });

    } catch (err) {
        // --- LOGIC JIKA KENA LIMIT (429) ---
        if (err.response && err.response.status === 429) {
            console.log("⚠️ Gemini Limit Reach, using Local Mentor Logic.");
            
            const userMsg = req.body.message.toLowerCase();
            let manualReply = `Duh ${userName}, kuota mikirku lagi abis nih. Tapi intinya, saldo kamu Rp${balance.toLocaleString('id-ID')}. `;
            
            if (userMsg.includes("mobil") || userMsg.includes("100 juta")) {
                manualReply += "Beli mobil 100 juta? Waduh, saldo belum nyampe 5 juta gitu. Mending tabung dulu buat bensinnya! 🚗💨";
            } else {
                manualReply += "Saran mentor: mending tahan dulu jajan yang nggak perlu ya!";
            }
            
            return res.json({ reply: manualReply });
        }

        console.error("🔥 Error AI:", err.message);
        res.status(500).json({ reply: "Mentor lagi ngopi dulu, coba tanya lagi sedetik kemudian ya!" });
    }

};