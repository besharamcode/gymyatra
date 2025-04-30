const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  day1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  day2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  day3: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  day4: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  day5: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  day6: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  day7: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
});

const PlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schedule: ScheduleSchema,
    dietPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DietPlan',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Plan', PlanSchema); 