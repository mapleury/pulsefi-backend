const express = require('express');
const router = express.Router();

// 1. Import all controllers and middleware
const transactionController = require('../../backend/controllers/transactionController');
const insightController = require('../../backend/controllers/insightController');
const goalController = require('../../backend/controllers/goalsController'); 
const opportunityController = require('../../backend/controllers/opportunityController');
const detectImpulse = require('../../vite-project/middleware/analyzeBehavior');

// 2. Transaction Routes
// Inject your detectImpulse middleware before the controller logic
router.post('/transactions', detectImpulse, transactionController.addTransaction);
router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/recent', transactionController.getRecentTransactions);

// 3. Insight Route
router.get('/insights', insightController.getPulseInsights);

// 4. Goal Routes
router.post('/goals', goalController.createGoal);
router.get('/goals', goalController.getGoalProgress);
router.post('/simulate', goalController.simulateGoal);

// 5. Opportunity Route
router.get('/opportunities', opportunityController.getOpportunities);

// 6. Export at the VERY END
router.post('/goals', goalController.createGoal);

module.exports = router;