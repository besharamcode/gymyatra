import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import GymRate from '../models/GymRate.js';
import Gym from '../models/Gym.js';
import GymBranch from '../models/GymBranch.js';
import GymTrainer from '../models/GymTrainer.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register GymRate
// @route   POST /api/gymrate/register
// @access  Public
const registerGymRate = asyncHandler(async (req, res) => {
  const { name, email, password, contactNumber } = req.body;

  // Check if GymRate exists
  const gymRateExists = await GymRate.findOne({ email });
  if (gymRateExists) {
    res.status(400);
    throw new Error('GymRate already exists');
  }

  // Create GymRate
  const gymRate = await GymRate.create({
    name,
    email,
    password,
    contactNumber
  });

  if (gymRate) {
    res.status(201).json({
      _id: gymRate._id,
      name: gymRate.name,
      email: gymRate.email,
      contactNumber: gymRate.contactNumber,
      role: gymRate.role,
      token: generateToken(gymRate._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid GymRate data');
  }
});

// @desc    Login GymRate
// @route   POST /api/gymrate/login
// @access  Public
const loginGymRate = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for GymRate email
  const gymRate = await GymRate.findOne({ email });
  if (gymRate && (await gymRate.comparePassword(password))) {
    // Update last login
    await gymRate.updateLastLogin();

    res.json({
      _id: gymRate._id,
      name: gymRate.name,
      email: gymRate.email,
      contactNumber: gymRate.contactNumber,
      role: gymRate.role,
      token: generateToken(gymRate._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get GymRate profile
// @route   GET /api/gymrate/profile
// @access  Private
const getGymRateProfile = asyncHandler(async (req, res) => {
  const gymRate = await GymRate.findById(req.gymRate._id).select('-password');
  if (gymRate) {
    res.json(gymRate);
  } else {
    res.status(404);
    throw new Error('GymRate not found');
  }
});

// @desc    Update GymRate profile
// @route   PUT /api/gymrate/profile
// @access  Private
const updateGymRateProfile = asyncHandler(async (req, res) => {
  const gymRate = await GymRate.findById(req.gymRate._id);

  if (gymRate) {
    gymRate.name = req.body.name || gymRate.name;
    gymRate.email = req.body.email || gymRate.email;
    gymRate.contactNumber = req.body.contactNumber || gymRate.contactNumber;
    gymRate.profilePicture = req.body.profilePicture || gymRate.profilePicture;
    gymRate.settings = req.body.settings || gymRate.settings;

    if (req.body.password) {
      gymRate.password = req.body.password;
    }

    const updatedGymRate = await gymRate.save();

    res.json({
      _id: updatedGymRate._id,
      name: updatedGymRate.name,
      email: updatedGymRate.email,
      contactNumber: updatedGymRate.contactNumber,
      role: updatedGymRate.role,
      token: generateToken(updatedGymRate._id)
    });
  } else {
    res.status(404);
    throw new Error('GymRate not found');
  }
});

// @desc    Get all gyms
// @route   GET /api/gymrate/gyms
// @access  Private
const getGyms = asyncHandler(async (req, res) => {
  const gyms = await Gym.find({ createdBy: req.gymRate._id })
    .populate('branches', 'name address')
    .select('-password');
  res.json(gyms);
});

// @desc    Create gym
// @route   POST /api/gymrate/gyms
// @access  Private
const createGym = asyncHandler(async (req, res) => {
  const { name, email, password, contactNumber, address } = req.body;

  // Check if gym exists
  const gymExists = await Gym.findOne({ email });
  if (gymExists) {
    res.status(400);
    throw new Error('Gym already exists');
  }

  // Create gym
  const gym = await Gym.create({
    name,
    email,
    password,
    contactNumber,
    address,
    createdBy: req.gymRate._id
  });

  if (gym) {
    res.status(201).json({
      _id: gym._id,
      name: gym.name,
      email: gym.email,
      contactNumber: gym.contactNumber,
      role: gym.role,
      token: generateToken(gym._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid gym data');
  }
});

// @desc    Get gym by ID
// @route   GET /api/gymrate/gym/:id
// @access  Private
const getGymById = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id)
    .populate('branches', 'name address')
    .select('-password');

  if (gym && gym.createdBy.toString() === req.gymRate._id.toString()) {
    res.json(gym);
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

// @desc    Update gym
// @route   PUT /api/gymrate/gym/:id
// @access  Private
const updateGym = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  if (gym && gym.createdBy.toString() === req.gymRate._id.toString()) {
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

// @desc    Delete gym
// @route   DELETE /api/gymrate/gym/:id
// @access  Private
const deleteGym = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  if (gym && gym.createdBy.toString() === req.gymRate._id.toString()) {
    // Delete associated branches
    await GymBranch.deleteMany({ gym: gym._id });
    // Delete associated trainers
    await GymTrainer.deleteMany({ gym: gym._id });
    // Delete gym
    await gym.remove();
    res.json({ message: 'Gym removed' });
  } else {
    res.status(404);
    throw new Error('Gym not found');
  }
});

// @desc    Get gym statistics
// @route   GET /api/gymrate/gyms/stats
// @access  Private
const getGymStats = asyncHandler(async (req, res) => {
  const stats = await Gym.aggregate([
    { $match: { createdBy: req.gymRate._id } },
    {
      $lookup: {
        from: 'gymtrainers',
        localField: '_id',
        foreignField: 'gym',
        as: 'trainers'
      }
    },
    {
      $lookup: {
        from: 'gymusers',
        localField: '_id',
        foreignField: 'gym',
        as: 'users'
      }
    },
    {
      $project: {
        totalGyms: { $size: '$_id' },
        totalTrainers: { $size: '$trainers' },
        totalUsers: { $size: '$users' },
        activeGyms: {
          $size: {
            $filter: {
              input: '$_id',
              as: 'gym',
              cond: { $eq: ['$$gym.isActive', true] }
            }
          }
        }
      }
    }
  ]);

  res.json(stats[0] || {
    totalGyms: 0,
    totalTrainers: 0,
    totalUsers: 0,
    activeGyms: 0
  });
});

export {
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
}; 