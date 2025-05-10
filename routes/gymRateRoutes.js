import express from 'express';
import {
  registerGymRate,
  loginGymRate,
  getGymRateProfile,
  updateGymRateProfile,
  getGyms,
  createGym,
  getGymById,
  updateGym,
  deleteGym,
  getGymStats
} from '../controllers/gymRateController.js';
import { protect, gymRate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerGymRate);
router.post('/login', loginGymRate);

// Protected routes
router.use(protect);
router.use(gymRate);

// Profile routes
router.route('/profile')
  .get(getGymRateProfile)
  .put(updateGymRateProfile);

// Gym management routes
router.route('/gyms')
  .get(getGyms)
  .post(createGym);

router.route('/gyms/stats')
  .get(getGymStats);

router.route('/gym/:id')
  .get(getGymById)
  .put(updateGym)
  .delete(deleteGym);

export default router; 