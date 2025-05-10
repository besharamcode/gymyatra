import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Gym from '../models/Gym.js';
import GymBranch from '../models/GymBranch.js';
import GymTrainer from '../models/GymTrainer.js';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Get gym profile
// @route   GET /api/gym/profile
// @access  Private
const getGymProfile = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.gym._id)
    .select('-password')
    .populate('branches', 'name address');
  
  if (gym) {
    res.json(gym);
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

// @desc    Update gym profile
// @route   PUT /api/gym/profile
// @access  Private
const updateGymProfile = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.gym._id);

  if (gym) {
    gym.name = req.body.name || gym.name;
    gym.email = req.body.email || gym.email;
    gym.contactNumber = req.body.contactNumber || gym.contactNumber;
    gym.address = req.body.address || gym.address;
    gym.logo = req.body.logo || gym.logo;
    gym.description = req.body.description || gym.description;
    gym.website = req.body.website || gym.website;
    gym.socialMedia = req.body.socialMedia || gym.socialMedia;
    gym.settings = req.body.settings || gym.settings;

    if (req.body.password) {
      gym.password = req.body.password;
    }

    const updatedGym = await gym.save();
    res.json(updatedGym);
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

// @desc    Create branch
// @route   POST /api/gym/branches
// @access  Private
const createBranch = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    contactNumber,
    email,
    facilities,
    operatingHours,
    capacity
  } = req.body;

  const branch = await GymBranch.create({
    name,
    gym: req.gym._id,
    address,
    contactNumber,
    email,
    facilities,
    operatingHours,
    capacity
  });

  // Add branch to gym
  await req.gym.addBranch(branch._id);

  res.status(201).json(branch);
});

// @desc    Get all branches
// @route   GET /api/gym/branches
// @access  Private
const getBranches = asyncHandler(async (req, res) => {
  const branches = await GymBranch.find({ gym: req.gym._id })
    .populate('trainers', 'name specialization')
    .populate('members', 'name email');
  res.json(branches);
});

// @desc    Get branch by ID
// @route   GET /api/gym/branch/:id
// @access  Private
const getBranchById = asyncHandler(async (req, res) => {
  const branch = await GymBranch.findById(req.params.id)
    .populate('trainers', 'name specialization')
    .populate('members', 'name email');

  if (branch && branch.gym.toString() === req.gym._id.toString()) {
    res.json(branch);
  } else {
    res.status(404);
    throw new Error('Branch not found');
  }
});

// @desc    Update branch
// @route   PUT /api/gym/branch/:id
// @access  Private
const updateBranch = asyncHandler(async (req, res) => {
  const branch = await GymBranch.findById(req.params.id);

  if (branch && branch.gym.toString() === req.gym._id.toString()) {
    branch.name = req.body.name || branch.name;
    branch.address = req.body.address || branch.address;
    branch.contactNumber = req.body.contactNumber || branch.contactNumber;
    branch.email = req.body.email || branch.email;
    branch.facilities = req.body.facilities || branch.facilities;
    branch.operatingHours = req.body.operatingHours || branch.operatingHours;
    branch.capacity = req.body.capacity || branch.capacity;
    branch.description = req.body.description || branch.description;
    branch.amenities = req.body.amenities || branch.amenities;
    branch.settings = req.body.settings || branch.settings;

    const updatedBranch = await branch.save();
    res.json(updatedBranch);
  } else {
    res.status(404);
    throw new Error('Branch not found');
  }
});

// @desc    Delete branch
// @route   DELETE /api/gym/branch/:id
// @access  Private
const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await GymBranch.findById(req.params.id);

  if (branch && branch.gym.toString() === req.gym._id.toString()) {
    // Remove branch from gym
    await req.gym.removeBranch(branch._id);
    // Delete branch
    await branch.remove();
    res.json({ message: 'Branch removed' });
  } else {
    res.status(404);
    throw new Error('Branch not found');
  }
});

// @desc    Assign trainer to branch
// @route   POST /api/gym/branch/:id/assign-trainer
// @access  Private
const assignTrainer = asyncHandler(async (req, res) => {
  const { trainerId } = req.body;
  const branch = await GymBranch.findById(req.params.id);

  if (branch && branch.gym.toString() === req.gym._id.toString()) {
    const trainer = await GymTrainer.findById(trainerId);
    
    if (!trainer) {
      res.status(404);
      throw new Error('Trainer not found');
    }

    if (trainer.gym.toString() !== req.gym._id.toString()) {
      res.status(403);
      throw new Error('Trainer does not belong to this gym');
    }

    await branch.addTrainer(trainerId);
    trainer.branch = branch._id;
    await trainer.save();

    res.json({ message: 'Trainer assigned successfully' });
  } else {
    res.status(404);
    throw new Error('Branch not found');
  }
});

// @desc    Get branch statistics
// @route   GET /api/gym/branches/stats
// @access  Private
const getBranchStats = asyncHandler(async (req, res) => {
  const stats = await GymBranch.aggregate([
    { $match: { gym: req.gym._id } },
    {
      $lookup: {
        from: 'gymtrainers',
        localField: '_id',
        foreignField: 'branch',
        as: 'trainers'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'branch',
        as: 'members'
      }
    },
    {
      $project: {
        totalBranches: { $size: '$_id' },
        totalTrainers: { $size: '$trainers' },
        totalMembers: { $size: '$members' },
        activeBranches: {
          $size: {
            $filter: {
              input: '$_id',
              as: 'branch',
              cond: { $eq: ['$$branch.isActive', true] }
            }
          }
        }
      }
    }
  ]);

  res.json(stats[0] || {
    totalBranches: 0,
    totalTrainers: 0,
    totalMembers: 0,
    activeBranches: 0
  });
});

// @desc    Get all trainers
// @route   GET /api/gym/trainers
// @access  Private
const getTrainers = asyncHandler(async (req, res) => {
  const trainers = await GymTrainer.find({ gym: req.gym._id })
    .populate('branch', 'name')
    .select('-password');
  res.json(trainers);
});

// @desc    Get all members
// @route   GET /api/gym/members
// @access  Private
const getMembers = asyncHandler(async (req, res) => {
  const members = await User.find({ gym: req.gym._id })
    .populate('branch', 'name')
    .select('-password');
  res.json(members);
});

// @desc    Update subscription
// @route   PUT /api/gym/subscription
// @access  Private
const updateSubscription = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.gym._id);

  if (gym) {
    gym.subscription = {
      ...gym.subscription,
      ...req.body,
      startDate: req.body.startDate || gym.subscription.startDate,
      endDate: req.body.endDate || gym.subscription.endDate
    };

    const updatedGym = await gym.save();
    res.json(updatedGym.subscription);
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

export {
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
}; 