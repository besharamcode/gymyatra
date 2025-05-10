import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import GymRate from '../models/GymRate.js';
import Gym from '../models/Gym.js';
import GymTrainer from '../models/GymTrainer.js';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      let user;
      switch (decoded.role) {
        case 'gymrate':
          user = await GymRate.findById(decoded.id).select('-password');
          break;
        case 'gym':
          user = await Gym.findById(decoded.id).select('-password');
          break;
        case 'gymtrainer':
          user = await GymTrainer.findById(decoded.id).select('-password');
          break;
        case 'user':
          user = await User.findById(decoded.id).select('-password');
          break;
        default:
          res.status(401);
          throw new Error('Not authorized, invalid role');
      }

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Role-based middleware
const gymRate = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'gymrate') {
    req.gymRate = req.user;
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as GymRate');
  }
});

const gym = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'gym') {
    req.gym = req.user;
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as Gym');
  }
});

const trainer = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'gymtrainer') {
    req.trainer = req.user;
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as Trainer');
  }
});

const user = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    req.member = req.user;
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as User');
  }
});

export { protect, gymRate, gym, trainer, user }; 