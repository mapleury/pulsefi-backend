const db = require('../database');

exports.getPulseInsights = async (req, res) => {
    try {
        // 1. Calculate Savings Rate
        const moneyFlow = await db.get(`
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
            FROM transactions
        `);

        const income = moneyFlow.total_income || 0;
        const expense = moneyFlow.total_expense || 0;
        const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

        // 2. Identify Most Frequent Category
        const topCategory = await db.get(`
            SELECT category, COUNT(*) as count 
            FROM transactions 
            WHERE type = 'expense' 
            GROUP BY category 
            ORDER BY count DESC LIMIT 1
        `);

        // 3. Logic: Assign Identity
        let identity = "Strategist"; // Default
        let description = "You balance your needs and wants carefully.";

        if (savingsRate > 25) {
            identity = "Builder";
            description = "You are focused on long-term growth and high discipline.";
        } else if (topCategory?.category === 'Entertainment' || topCategory?.category === 'Self-Care') {
            identity = "Explorer";
            description = "You value experiences and personal treats.";
        } else if (expense > income && income > 0) {
            identity = "Sprinter";
            description = "You're moving fast, but watch out for the finish line (budget).";
        }

        res.json({
            identity,
            description,
            stats: {
                savingsRate: savingsRate.toFixed(1) + "%",
                topCategory: topCategory?.category || "None yet",
                healthStatus: savingsRate > 0 ? "Healthy" : "Critical"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Example for insightController.js
module.exports = {
    getPulseInsights: (req, res) => res.json([]),
    getBehavioralAlerts: (req, res) => res.json([])
};