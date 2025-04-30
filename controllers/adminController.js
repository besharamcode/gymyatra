const User = require('../models/User');
const Plan = require('../models/Plan');
const Exercise = require('../models/Exercise');
const DietPlan = require('../models/DietPlan');
const Progress = require('../models/Progress');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create exercise
// @route   POST /api/admin/exercises
// @access  Private/Admin
exports.createExercise = async (req, res) => {
  try {
    const { name, description, sets, reps, imageUrl, muscleGroup } = req.body;

    const exercise = await Exercise.create({
      name,
      description,
      sets,
      reps,
      imageUrl,
      muscleGroup,
    });

    res.status(201).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all exercises
// @route   GET /api/admin/exercises
// @access  Private/Admin
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();

    res.json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create diet plan
// @route   POST /api/admin/diet-plans
// @access  Private/Admin
exports.createDietPlan = async (req, res) => {
  try {
    const { title, description, meals } = req.body;

    const dietPlan = await DietPlan.create({
      title,
      description,
      meals,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: dietPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all diet plans
// @route   GET /api/admin/diet-plans
// @access  Private/Admin
exports.getDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find();

    res.json({
      success: true,
      count: dietPlans.length,
      data: dietPlans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create plan
// @route   POST /api/admin/plans
// @access  Private/Admin
exports.createPlan = async (req, res) => {
  try {
    const { title, description, assignedTo, schedule, dietPlan } = req.body;

    const plan = await Plan.create({
      title,
      description,
      assignedTo,
      schedule,
      dietPlan,
      createdBy: req.user._id,
    });

    // Update user's assignedPlans array
    await User.findByIdAndUpdate(assignedTo, {
      $push: { assignedPlans: plan._id },
    });

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's progress
// @route   GET /api/admin/users/:userId/progress
// @access  Private/Admin
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .populate('completedExercises.exercise');

    res.json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 