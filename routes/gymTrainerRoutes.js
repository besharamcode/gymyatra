import express from 'express';
import {
  registerTrainer,
  loginTrainer,
  getTrainerProfile,
  updateTrainerProfile,
  getAssignedUsers,
  getUserById,
  assignPlan,
  updateUserProgress,
  getSchedule,
  updateSchedule,
  getReviews,
  addReview,
  getStats
} from '../controllers/gymTrainerController.js';
import { protect, trainer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerTrainer);
router.post('/login', loginTrainer);

// Protected routes
router.use(protect);
router.use(trainer);

// Profile routes
router.route('/profile')
  .get(getTrainerProfile)
  .put(updateTrainerProfile);

// User management routes
router.route('/users')
  .get(getAssignedUsers);

router.route('/user/:id')
  .get(getUserById);

router.route('/user/:id/plan')
  .post(assignPlan);

router.route('/user/:id/progress')
  .put(updateUserProgress);

// Schedule management
router.route('/schedule')
  .get(getSchedule)
  .put(updateSchedule);

// Reviews and ratings
router.route('/reviews')
  .get(getReviews)
  .post(addReview);

// Statistics
router.route('/stats')
  .get(getStats);

export default router; 