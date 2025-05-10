import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['gym'],
    default: 'gym'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymRate',
    required: true
  },
  branches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymBranch'
  }],
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  logo: String,
  description: String,
  website: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'pro', 'enterprise'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    }
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    features: {
      allowOnlineBooking: {
        type: Boolean,
        default: true
      },
      allowDietPlans: {
        type: Boolean,
        default: true
      },
      allowProgressTracking: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
gymSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
gymSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
gymSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

// Method to add branch
gymSchema.methods.addBranch = async function(branchId) {
  if (!this.branches.includes(branchId)) {
    this.branches.push(branchId);
    await this.save();
  }
};

// Method to remove branch
gymSchema.methods.removeBranch = async function(branchId) {
  this.branches = this.branches.filter(id => id.toString() !== branchId.toString());
  await this.save();
};

const Gym = mongoose.model('Gym', gymSchema);
export default Gym; 