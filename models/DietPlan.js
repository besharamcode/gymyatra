const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  foodItem: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
});

const DietPlanSchema = new mongoose.Schema(
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
    meals: [MealSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('DietPlan', DietPlanSchema); 