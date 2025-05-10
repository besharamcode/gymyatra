import mongoose from 'mongoose';

const gymBranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true
  },
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym',
    required: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  trainers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymTrainer'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  facilities: [{
    name: String,
    description: String,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  capacity: {
    type: Number,
    required: [true, 'Branch capacity is required']
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  images: [String],
  description: String,
  amenities: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowOnlineBooking: {
      type: Boolean,
      default: true
    },
    maxBookingDays: {
      type: Number,
      default: 7
    },
    bookingTimeSlots: {
      type: Number,
      default: 60 // in minutes
    }
  }
}, {
  timestamps: true
});

// Method to add trainer
gymBranchSchema.methods.addTrainer = async function(trainerId) {
  if (!this.trainers.includes(trainerId)) {
    this.trainers.push(trainerId);
    await this.save();
  }
};

// Method to remove trainer
gymBranchSchema.methods.removeTrainer = async function(trainerId) {
  this.trainers = this.trainers.filter(id => id.toString() !== trainerId.toString());
  await this.save();
};

// Method to add member
gymBranchSchema.methods.addMember = async function(memberId) {
  if (!this.members.includes(memberId)) {
    this.members.push(memberId);
    this.currentOccupancy += 1;
    await this.save();
  }
};

// Method to remove member
gymBranchSchema.methods.removeMember = async function(memberId) {
  this.members = this.members.filter(id => id.toString() !== memberId.toString());
  this.currentOccupancy = Math.max(0, this.currentOccupancy - 1);
  await this.save();
};

// Method to check if branch is at capacity
gymBranchSchema.methods.isAtCapacity = function() {
  return this.currentOccupancy >= this.capacity;
};

// Method to get available time slots for a specific date
gymBranchSchema.methods.getAvailableTimeSlots = function(date) {
  const dayOfWeek = date.toLowerCase();
  const hours = this.operatingHours[dayOfWeek];
  
  if (!hours || !hours.open || !hours.close) {
    return [];
  }

  const slots = [];
  const startTime = new Date(`2000-01-01 ${hours.open}`);
  const endTime = new Date(`2000-01-01 ${hours.close}`);
  const slotDuration = this.settings.bookingTimeSlots;

  let currentTime = startTime;
  while (currentTime < endTime) {
    slots.push(currentTime.toLocaleTimeString('en-US', { hour12: false }));
    currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
  }

  return slots;
};

const GymBranch = mongoose.model('GymBranch', gymBranchSchema);
export default GymBranch; 