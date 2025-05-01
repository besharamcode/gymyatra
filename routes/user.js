import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get user's plan
router.get('/my-plan', protect, userController.getMyPlan);

// Submit progress
router.post('/progress', protect, userController.submitProgress);

// Get progress history
router.get('/progress-history', protect, userController.getProgressHistory);

// Update profile
router.put('/profile', protect, userController.updateProfile);

export default router; 