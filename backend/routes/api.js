const express = require('express');
const router = express.Router();

// 1. Import Controllers
const transactionController = require('../controllers/transactionController');
const insightController = require('../controllers/insightController');
// Make sure this path and name match your actual file exactly
const goalsController = require('../controllers/goalsController'); 
const opportunityController = require('../controllers/opportunityController');
const profileController = require('../controllers/profileController');

// 2. Import Middleware
const analyzeBehavior = require('../middleware/analyzeBehavior');

// 3. Safety Helper
const safe = (fn) => (typeof fn === 'function' ? fn : (req, res) => res.status(501).json({ error: "Method not implemented" }));

// --- TRANSACTION ROUTES ---
router.get('/transactions', safe(transactionController.getAllTransactions));
router.post('/transactions', safe(analyzeBehavior), safe(transactionController.addTransaction));
router.put('/transactions/:id', safe(transactionController.updateTransaction));
router.delete('/transactions/:id', safe(transactionController.deleteTransaction));
router.get('/transactions/recent', safe(transactionController.getRecentTransactions));
router.get('/transactions/summary', safe(transactionController.getTransactionSummary));

// --- GOAL ROUTES (CRUD + Logic) ---
router.get('/goals', safe(goalsController.getGoals));              
router.post('/goals', safe(goalsController.createGoal));            
router.put('/goals/:id', safe(goalsController.updateGoal));         
router.delete('/goals/:id', safe(goalsController.deleteGoal));      

// Specialized Goals
router.get('/goals/progress', safe(goalsController.getGoalProgress));
router.post('/goals/simulate', safe(goalsController.simulateGoal));


// 4. Export ONLY ONCE at the very bottom
module.exports = router;