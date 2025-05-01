import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

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
router.put('/diet-plans/:id', adminController.updateDietPlan);

// Workout plan routes
router.post('/plans', adminController.createPlan);

export default router; 