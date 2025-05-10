import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const gymRateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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
    enum: ['gymrate'],
    default: 'gymrate'
  },
  profilePicture: String,
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
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
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
gymRateSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
gymRateSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
gymRateSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

const GymRate = mongoose.model('GymRate', gymRateSchema);
export default GymRate; 