const express = require('express');
const router = express.Router();

// --- 1. IMPORT CONTROLLERS ---
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const goalsController = require('../controllers/goalsController'); 
const profileController = require('../controllers/profileController');
const insightController = require('../controllers/insightController');
const opportunityController = require('../controllers/opportunityController');
const streakController = require('../controllers/streakController');
const aiController = require('../controllers/aiController'); // <--- Deklarasi Cukup Sekali Di Sini

// --- 2. IMPORT MIDDLEWARE ---
const auth = require('../middleware/authMiddleware'); 
const analyzeBehavior = require('../middleware/analyzeBehavior');

// --- 3. SAFETY HELPER ---
const safe = (fn) => (typeof fn === 'function' ? fn : (req, res) => res.status(501).json({ error: "Method not implemented in Controller" }));

// --- 4. AUTH ROUTES ---
router.post('/register', safe(authController.register));
router.post('/login', safe(authController.login));


// --- 5. TRANSACTION ROUTES ---
router.get('/transactions', auth, safe(transactionController.getAllTransactions));
router.get('/transactions/recent', auth, safe(transactionController.getRecentTransactions));
router.get('/transactions/summary', auth, safe(transactionController.getTransactionSummary));
router.get('/transactions/weekly', auth, safe(transactionController.getWeeklyStats));

// Create dengan Middleware analyzeBehavior (Update Streak & Pulse Otomatis)
router.post('/transactions', auth, safe(analyzeBehavior), safe(transactionController.addTransaction));

router.put('/transactions/:id', auth, safe(transactionController.updateTransaction));
router.delete('/transactions/:id', auth, safe(transactionController.deleteTransaction));


// --- 6. GOAL ROUTES ---
router.get('/goals', auth, safe(goalsController.getGoals));
router.post('/goals', auth, safe(goalsController.createGoal));
router.put('/goals/:id', auth, safe(goalsController.updateGoal));
router.delete('/goals/:id', auth, safe(goalsController.deleteGoal));


// --- 7. PROFILE & ACCOUNT SETTINGS ---
router.get('/profile', auth, safe(profileController.getProfile)); 
router.put('/profile', auth, safe(profileController.updateProfile)); 
router.put('/profile/password', auth, safe(profileController.changePassword)); 
router.get('/profile/pulse', auth, safe(profileController.getProfilePulse));
router.get('/profile/streak', auth, safe(streakController.getStreak));


// --- 8. AI, INSIGHTS & OPPORTUNITIES ---
router.get('/insights', auth, safe(insightController.getInsights));
router.get('/opportunities', auth, safe(opportunityController.getOpportunities));

// Rute AI Advice (Dashboard) & AI Chat (Mentor)
router.get('/ai/advice', auth, safe(aiController.getFinancialAdvice));
router.post('/ai/chat', auth, safe(aiController.chatWithAI)); 


module.exports = router;