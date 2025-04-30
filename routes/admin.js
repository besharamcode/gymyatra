const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Apply both middlewares to all routes
router.use(protect, admin);

// User routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.get('/users/:userId/progress', adminController.getUserProgress);

// Exercise routes
router.post('/exercises', adminController.createExercise);
router.get('/exercises', adminController.getExercises);

// Diet plan routes
router.post('/diet-plans', adminController.createDietPlan);
router.get('/diet-plans', adminController.getDietPlans);

// Workout plan routes
router.post('/plans', adminController.createPlan);

module.exports = router; 