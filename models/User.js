import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GymBranch',
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GymTrainer',
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: Number,
    weight: Number,
    fitnessGoals: [{
      type: String,
    }],
    medicalConditions: [{
      type: String,
    }],
    assignedPlans: [
      {
        workoutPlan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'WorkoutPlan',
        },
        dietPlan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DietPlan',
        },
        startDate: Date,
        endDate: Date,
      },
    ],
    progress: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        weight: Number,
        exercises: [
          {
            exercise: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Exercise',
            },
            completed: Boolean,
            sets: Number,
            reps: Number,
            weight: Number,
            notes: String,
          },
        ],
      },
    ],
    membershipStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    membershipStartDate: Date,
    membershipEndDate: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add progress
UserSchema.methods.addProgress = async function (progressData) {
  this.progress.push(progressData);
  await this.save();
};

// Method to update membership status
UserSchema.methods.updateMembershipStatus = async function (status) {
  this.membershipStatus = status;
  await this.save();
};

const User = mongoose.model('User', UserSchema);

export default User; 