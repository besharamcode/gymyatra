import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const gymTrainerSchema = new mongoose.Schema({
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
    enum: ['gymtrainer'],
    default: 'gymtrainer'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymBranch',
    required: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  profilePicture: String,
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  specialization: [{
    type: String,
    required: [true, 'At least one specialization is required']
  }],
  experience: {
    years: {
      type: Number,
      required: [true, 'Years of experience is required']
    },
    description: String
  },
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date,
    document: String // URL to stored document
  }],
  assignedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    }
  }],
  schedule: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }]
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  bio: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  settings: {
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
    availability: {
      maxUsersPerDay: {
        type: Number,
        default: 10
      },
      minSessionDuration: {
        type: Number,
        default: 30 // in minutes
      }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
gymTrainerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
gymTrainerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
gymTrainerSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

// Method to assign user
gymTrainerSchema.methods.assignUser = async function(userId) {
  const existingAssignment = this.assignedUsers.find(
    assignment => assignment.user.toString() === userId.toString()
  );

  if (!existingAssignment) {
    this.assignedUsers.push({
      user: userId,
      assignedDate: new Date(),
      status: 'active'
    });
    await this.save();
  }
};

// Method to remove user assignment
gymTrainerSchema.methods.removeUserAssignment = async function(userId) {
  this.assignedUsers = this.assignedUsers.filter(
    assignment => assignment.user.toString() !== userId.toString()
  );
  await this.save();
};

// Method to update user assignment status
gymTrainerSchema.methods.updateUserAssignmentStatus = async function(userId, status) {
  const assignment = this.assignedUsers.find(
    assignment => assignment.user.toString() === userId.toString()
  );

  if (assignment) {
    assignment.status = status;
    await this.save();
  }
};

// Method to add review
gymTrainerSchema.methods.addReview = async function(userId, rating, comment) {
  const review = {
    user: userId,
    rating,
    comment,
    date: new Date()
  };

  this.rating.reviews.push(review);
  
  // Update average rating
  const totalRating = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.count = this.rating.reviews.length;
  this.rating.average = totalRating / this.rating.count;

  await this.save();
};

// Method to check availability for a specific time slot
gymTrainerSchema.methods.isAvailable = function(day, startTime, endTime) {
  const daySchedule = this.schedule[day.toLowerCase()];
  if (!daySchedule || daySchedule.length === 0) return false;

  const requestedStart = new Date(`2000-01-01 ${startTime}`);
  const requestedEnd = new Date(`2000-01-01 ${endTime}`);

  return daySchedule.some(slot => {
    const slotStart = new Date(`2000-01-01 ${slot.start}`);
    const slotEnd = new Date(`2000-01-01 ${slot.end}`);
    return requestedStart >= slotStart && requestedEnd <= slotEnd;
  });
};

const GymTrainer = mongoose.model('GymTrainer', gymTrainerSchema);
export default GymTrainer; 