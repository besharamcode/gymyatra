import User from '../models/User.js';
import Plan from '../models/Plan.js';
import Progress from '../models/Progress.js';
import Exercise from '../models/Exercise.js';

// @desc    Get user's plan
// @route   GET /api/user/my-plan
// @access  Private
export const getMyPlan = async (req, res) => {
  try {
    const plans = await Plan.find({ assignedTo: req.user._id })
      .populate('dietPlan')
      .populate({
        path: 'schedule.day1 schedule.day2 schedule.day3 schedule.day4 schedule.day5 schedule.day6 schedule.day7',
        model: 'Exercise',
      });

    if (!plans || plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No plan assigned yet',
      });
    }

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Submit progress
// @route   POST /api/user/progress
// @access  Private
export const submitProgress = async (req, res) => {
  try {
    const { weight, completedExercises, notes } = req.body;

    // Create new progress
    const progress = await Progress.create({
      userId: req.user._id,
      weight,
      completedExercises,
      notes,
    });

    res.status(201).json({
      success: true,
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

// @desc    Get progress history
// @route   GET /api/user/progress-history
// @access  Private
export const getProgressHistory = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('completedExercises.exercise');

    res.json({
      success: true,
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

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, profilePic } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.profilePic = profilePic || user.profilePic;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profilePic: updatedUser.profilePic,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 