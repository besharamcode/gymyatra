import express from 'express';
import {
  getGymProfile,
  updateGymProfile,
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  assignTrainer,
  getBranchStats,
  getTrainers,
  getMembers,
  updateSubscription
} from '../controllers/gymController.js';
import { protect, gym } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.use(protect);
router.use(gym);

// Profile routes
router.route('/profile')
  .get(getGymProfile)
  .put(updateGymProfile);

// Branch management routes
router.route('/branches')
  .get(getBranches)
  .post(createBranch);

router.route('/branches/stats')
  .get(getBranchStats);

router.route('/branch/:id')
  .get(getBranchById)
  .put(updateBranch)
  .delete(deleteBranch);

router.route('/branch/:id/assign-trainer')
  .post(assignTrainer);

// Trainer and member management
router.route('/trainers')
  .get(getTrainers);

router.route('/members')
  .get(getMembers);

// Subscription management
router.route('/subscription')
  .put(updateSubscription);

export default router; 