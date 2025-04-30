const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Get user's plan
router.get('/my-plan', protect, userController.getMyPlan);

// Submit progress
router.post('/progress', protect, userController.submitProgress);

// Get progress history
router.get('/progress-history', protect, userController.getProgressHistory);

// Update profile
router.put('/profile', protect, userController.updateProfile);

module.exports = router; 