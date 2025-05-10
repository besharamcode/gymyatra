import GymTrainer from '../models/GymTrainer.js';
import User from '../models/User.js';
import GymBranch from '../models/GymBranch.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register trainer
// @route   POST /api/trainer/register
// @access  Public
const registerTrainer = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    contactNumber,
    specialization,
    experience,
    branch
  } = req.body;

  // Check if trainer exists
  const trainerExists = await GymTrainer.findOne({ email });
  if (trainerExists) {
    res.status(400);
    throw new Error('Trainer already exists');
  }

  // Check if branch exists
  const branchExists = await GymBranch.findById(branch);
  if (!branchExists) {
    res.status(404);
    throw new Error('Branch not found');
  }

  // Create trainer
  const trainer = await GymTrainer.create({
    name,
    email,
    password,
    contactNumber,
    specialization,
    experience,
    branch,
    gym: branchExists.gym
  });

  if (trainer) {
    // Add trainer to branch
    await branchExists.addTrainer(trainer._id);

    res.status(201).json({
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      contactNumber: trainer.contactNumber,
      specialization: trainer.specialization,
      experience: trainer.experience,
      role: trainer.role,
      token: generateToken(trainer._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid trainer data');
  }
});

// @desc    Login trainer
// @route   POST /api/trainer/login
// @access  Public
const loginTrainer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for trainer email
  const trainer = await GymTrainer.findOne({ email });
  if (trainer && (await trainer.comparePassword(password))) {
    // Update last login
    await trainer.updateLastLogin();

    res.json({
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      contactNumber: trainer.contactNumber,
      specialization: trainer.specialization,
      experience: trainer.experience,
      role: trainer.role,
      token: generateToken(trainer._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get trainer profile
// @route   GET /api/trainer/profile
// @access  Private
const getTrainerProfile = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id)
    .select('-password')
    .populate('branch', 'name address')
    .populate('gym', 'name');
  
  if (trainer) {
    res.json(trainer);
  } else {
    res.status(404);
    throw new Error('Trainer not found');
  }
});

// @desc    Update trainer profile
// @route   PUT /api/trainer/profile
// @access  Private
const updateTrainerProfile = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id);

  if (trainer) {
    trainer.name = req.body.name || trainer.name;
    trainer.email = req.body.email || trainer.email;
    trainer.contactNumber = req.body.contactNumber || trainer.contactNumber;
    trainer.specialization = req.body.specialization || trainer.specialization;
    trainer.experience = req.body.experience || trainer.experience;
    trainer.certifications = req.body.certifications || trainer.certifications;
    trainer.bio = req.body.bio || trainer.bio;
    trainer.socialMedia = req.body.socialMedia || trainer.socialMedia;
    trainer.settings = req.body.settings || trainer.settings;

    if (req.body.password) {
      trainer.password = req.body.password;
    }

    const updatedTrainer = await trainer.save();
    res.json(updatedTrainer);
  } else {
    res.status(404);
    throw new Error('Trainer not found');
  }
});

// @desc    Get assigned users
// @route   GET /api/trainer/users
// @access  Private
const getAssignedUsers = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id)
    .populate({
      path: 'assignedUsers.user',
      select: 'name email profilePicture'
    });

  res.json(trainer.assignedUsers);
});

// @desc    Get user by ID
// @route   GET /api/trainer/user/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id);
  const userAssignment = trainer.assignedUsers.find(
    assignment => assignment.user.toString() === req.params.id
  );

  if (!userAssignment) {
    res.status(404);
    throw new Error('User not found in assigned users');
  }

  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('workoutPlan')
    .populate('dietPlan');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Assign plan to user
// @route   POST /api/trainer/user/:id/plan
// @access  Private
const assignPlan = asyncHandler(async (req, res) => {
  const { workoutPlan, dietPlan } = req.body;
  const trainer = await GymTrainer.findById(req.trainer._id);
  const userAssignment = trainer.assignedUsers.find(
    assignment => assignment.user.toString() === req.params.id
  );

  if (!userAssignment) {
    res.status(404);
    throw new Error('User not found in assigned users');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.workoutPlan = workoutPlan;
  user.dietPlan = dietPlan;
  await user.save();

  res.json({ message: 'Plan assigned successfully' });
});

// @desc    Update user progress
// @route   PUT /api/trainer/user/:id/progress
// @access  Private
const updateUserProgress = asyncHandler(async (req, res) => {
  const { weight, exercises } = req.body;
  const trainer = await GymTrainer.findById(req.trainer._id);
  const userAssignment = trainer.assignedUsers.find(
    assignment => assignment.user.toString() === req.params.id
  );

  if (!userAssignment) {
    res.status(404);
    throw new Error('User not found in assigned users');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update weight history
  user.weightHistory.push({
    weight,
    date: new Date()
  });

  // Update exercise progress
  if (exercises && exercises.length > 0) {
    user.exerciseProgress.push({
      exercises,
      date: new Date()
    });
  }

  await user.save();
  res.json({ message: 'Progress updated successfully' });
});

// @desc    Get trainer schedule
// @route   GET /api/trainer/schedule
// @access  Private
const getSchedule = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id)
    .select('schedule');
  res.json(trainer.schedule);
});

// @desc    Update trainer schedule
// @route   PUT /api/trainer/schedule
// @access  Private
const updateSchedule = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id);

  if (trainer) {
    trainer.schedule = req.body;
    const updatedTrainer = await trainer.save();
    res.json(updatedTrainer.schedule);
  } else {
    res.status(404);
    throw new Error('Trainer not found');
  }
});

// @desc    Get trainer reviews
// @route   GET /api/trainer/reviews
// @access  Private
const getReviews = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id)
    .populate('rating.reviews.user', 'name profilePicture');
  res.json(trainer.rating);
});

// @desc    Add review for trainer
// @route   POST /api/trainer/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const trainer = await GymTrainer.findById(req.trainer._id);

  if (trainer) {
    await trainer.addReview(req.user._id, rating, comment);
    res.json({ message: 'Review added successfully' });
  } else {
    res.status(404);
    throw new Error('Trainer not found');
  }
});

// @desc    Get trainer statistics
// @route   GET /api/trainer/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const trainer = await GymTrainer.findById(req.trainer._id)
    .populate('assignedUsers.user');

  const stats = {
    totalUsers: trainer.assignedUsers.length,
    activeUsers: trainer.assignedUsers.filter(
      assignment => assignment.status === 'active'
    ).length,
    averageRating: trainer.rating.average,
    totalReviews: trainer.rating.count,
    completedSessions: trainer.assignedUsers.filter(
      assignment => assignment.status === 'completed'
    ).length
  };

  res.json(stats);
});

export {
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
}; 